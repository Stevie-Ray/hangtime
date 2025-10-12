import {
  getFirestore,
  Timestamp,
  serverTimestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Firestore,
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  startAfter,
  QueryConstraint
} from 'firebase/firestore/lite'
import type { WhereFilterOp, OrderByDirection, DocumentData, Query } from 'firebase/firestore/lite'
import { toRaw, isRef, isReactive, isProxy, ref } from 'vue'
import firebaseApp from '@/plugins/firebase'
// FIX: Timestamp
import { getAuth } from 'firebase/auth'
const auth = getAuth(firebaseApp)

export function deepToRaw(sourceObj: unknown): unknown {
  const objectIterator = (input: unknown): unknown => {
    if (Array.isArray(input)) return input.map(objectIterator)
    if (isRef(input) || isReactive(input) || isProxy(input)) return objectIterator(toRaw(input))
    if (input && typeof input === 'object') {
      return Object.keys(input as object).reduce(
        (acc, key) => {
          acc[key] = objectIterator((input as Record<string, unknown>)[key])
          return acc
        },
        {} as Record<string, unknown>
      )
    }
    return input
  }
  return objectIterator(sourceObj)
}

const db: Firestore = getFirestore(firebaseApp)

/**
 * Checks whether a document needs a fixed createTimestamp.
 */
function needsCreateFix(raw: Record<string, unknown>): boolean {
  const v = raw?.createTimestamp
  return !(v instanceof Timestamp)
}

export default class GenericDB<T extends DocumentData> {
  /**
   * Path of the collection.
   */
  public collectionPath: string
  /**
   * Stores the last visible document for pagination.
   */
  protected lastVisible: DocumentSnapshot<T> | null = null
  /**
   * Indicates if the last result set is smaller than the requested amount.
   */
  public lastResult = ref<boolean>(false)

  constructor(collectionPath: string) {
    this.collectionPath = collectionPath
  }

  /**
   * Resets the last visible document for pagination.
   */
  resetLastVisible(): void {
    this.lastVisible = null
    this.lastResult.value = false
  }

  /**
   * Create a document in the collection.
   * @param data - The data to create the document with.
   * @param id - The ID of the document to create.
   * @returns The created document.
   */
  async create(data: Partial<T>, id?: string | null): Promise<T & { id: string }> {
    const colRef = collection(db, this.collectionPath) as CollectionReference<T>
    const payload = {
      ...(data as T),
      createTimestamp: serverTimestamp(),
      updateTimestamp: serverTimestamp()
    } as T

    let docRef: DocumentReference<T>
    if (id == null) {
      docRef = await addDoc(colRef, payload)
    } else {
      docRef = doc(colRef, id)
      await setDoc(docRef, payload, { merge: false })
    }

    const snap = await getDoc(docRef)
    const snapData = snap.data()
    if (!snapData) return { id: docRef.id, ...(data as T) }

    const converted = this.convertObjectTimestampPropertiesToDate(snapData) as T
    return { id: docRef.id, ...converted }
  }

  /**
   * Checks if the document is owned by the current user.
   * @param id - The ID of the document to check.
   * @returns True if the document is owned by the current user, false otherwise.
   */
  isOwnDocument(id: string): boolean {
    return id === auth.currentUser?.uid
  }

  /**
   * Read a document in the collection.
   * @param id - The ID of the document to read.
   * @returns The document.
   */
  async read(id: string): Promise<(T & { id: string }) | null> {
    const docRef = doc(db, this.collectionPath, id) as DocumentReference<T>
    const result = await getDoc(docRef)
    if (!result.exists()) return null

    const raw = result.data() as Record<string, unknown>

    // FIX: if createTimestamp is missing or broken, reset it.
    if (needsCreateFix(raw) && this.isOwnDocument(id)) {
      try {
        await updateDoc(docRef, { createTimestamp: serverTimestamp() })
        raw.createTimestamp = serverTimestamp()
      } catch {
        // ignore if permissions fail
      }
    }

    const converted = this.convertObjectTimestampPropertiesToDate(raw) as T
    return { id, ...converted }
  }

  /**
   * Retrieves all documents from the Firestore collection.
   * @param constraints - Array of constraints for the query.
   * @param order - Field to sort the results by.
   * @param direction - Order direction.
   * @param amount - Maximum number of documents to retrieve.
   * @returns Array of documents retrieved.
   */
  async readAll(
    constraints: Array<[string, WhereFilterOp, unknown]> | null = null,
    order: string | null = null,
    direction: OrderByDirection = 'desc',
    amount: number | null = null
  ): Promise<(T & { id: string })[]> {
    if (this.lastResult.value) return []

    const colRef = collection(db, this.collectionPath) as CollectionReference<T>
    let q: Query<T> = query(colRef) as Query<T>
    const combinedQuery: QueryConstraint[] = []

    if (constraints) {
      constraints.forEach(([field, op, value]) =>
        combinedQuery.push(where(field as string, op, value))
      )
    }

    if (order) combinedQuery.push(orderBy(order, direction))
    if (this.lastVisible && amount !== null) combinedQuery.push(startAfter(this.lastVisible))
    if (amount !== null) combinedQuery.push(limit(amount))

    if (combinedQuery.length > 0) q = query(colRef, ...combinedQuery)

    const querySnapshot = await getDocs(q)
    this.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] ?? null
    this.lastResult.value = amount !== null ? querySnapshot.docs.length < amount : false

    const result: (T & { id: string })[] = []
    for (const refSnap of querySnapshot.docs) {
      const raw = refSnap.data() as Record<string, unknown>

      const converted = this.convertObjectTimestampPropertiesToDate(raw) as T
      result.push({ id: refSnap.id, ...converted })
    }

    return result
  }

  /**
   * Update a document in the collection
   * @param data - The data to update the document with.
   * @returns The ID of the updated document.
   */
  async update(data: T & { id: string }): Promise<string> {
    const { id } = data
    const clonedData = structuredClone(deepToRaw(data)) as Partial<T & { id: string }>
    delete clonedData.id

    // FIX: Never update createTimestamp
    if (clonedData && Object.prototype.hasOwnProperty.call(clonedData, 'createTimestamp')) {
      delete (clonedData as Record<string, unknown>).createTimestamp
    }

    const docRef = doc(db, this.collectionPath, id) as DocumentReference<T>
    await updateDoc(docRef, {
      ...(clonedData as object),
      updateTimestamp: serverTimestamp()
    })

    return id
  }

  /**
   * Delete a document in the collection
   * @param id - The ID of the document to delete.
   */
  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionPath, id) as DocumentReference<T>
    await deleteDoc(docRef)
  }

  /**
   * Convert all object Timestamp properties to date
   * @param input - The input to convert.
   * @returns The converted input.
   */
  convertObjectTimestampPropertiesToDate(input: unknown): unknown {
    if (input instanceof Timestamp) return input.toDate()
    if (Array.isArray(input))
      return input.map((v) => this.convertObjectTimestampPropertiesToDate(v))
    if (input && typeof input === 'object') {
      const obj = input as Record<string, unknown>
      const out: Record<string, unknown> = {}
      for (const k of Object.keys(obj)) {
        out[k] = this.convertObjectTimestampPropertiesToDate(obj[k])
      }
      return out
    }
    return input
  }
}
