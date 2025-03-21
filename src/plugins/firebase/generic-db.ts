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
  WhereFilterOp,
  OrderByDirection,
  DocumentSnapshot,
  startAfter,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore/lite'
import { toRaw, isRef, isReactive, isProxy, ref } from 'vue'
import firebaseApp from '@/plugins/firebase'

export function deepToRaw(sourceObj: unknown): unknown {
  const objectIterator = (input: unknown): unknown => {
    if (Array.isArray(input)) {
      return input.map((item) => objectIterator(item))
    }
    if (isRef(input) || isReactive(input) || isProxy(input)) {
      return objectIterator(toRaw(input))
    }
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

export default class GenericDB<T> {
  /**
   * Path of the collection.
   */
  public collectionPath: string

  /**
   * Stores the last visible document for pagination.
   */
  protected lastVisible: DocumentSnapshot | null = null

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
   * @param data
   * @param id
   */
  async create(data: Partial<T>, id?: string | null): Promise<T & { id: string }> {
    const collectionRef = collection(db, this.collectionPath)
    const serverTimestampValue = serverTimestamp()

    const dataToCreate = {
      ...data,
      createTimestamp: serverTimestampValue,
      updateTimestamp: serverTimestampValue
    }

    const createPromise =
      id === null || id === undefined
        ? // Create doc with generated id
          addDoc(collectionRef, dataToCreate).then((doc) => doc.id)
        : // Create doc with custom id
          setDoc(doc(collectionRef, id), dataToCreate).then(() => id)

    const docId = await createPromise

    return {
      id: docId,
      ...data,
      createTimestamp: new Date(),
      updateTimestamp: new Date()
    } as unknown as T & { id: string }
  }

  /**
   * Read a document in the collection
   * @param id
   */
  async read(id: string): Promise<(T & { id: string }) | null> {
    const docRef: DocumentReference = doc(db, this.collectionPath, id)
    const result = await getDoc(docRef)

    const data = result.exists() ? result.data() : null

    if (data === null || data === undefined) return null

    this.convertObjectTimestampPropertiesToDate(data)

    return { id, ...data } as T & { id: string }
  }

  /**
   * Retrieves all documents from the Firestore collection.
   *
   * @param {Array<[string, WhereFilterOp, unknown]> | null} constraints - Array of constraints for the query.
   * @param {string | null} order - Field to sort the results by.
   * @param {OrderByDirection} direction - Field to manage the order direction.
   * @param {number | null} amount - Maximum number of documents to retrieve.
   * @returns {Promise<(T & { id: string })[]>} - Array of documents retrieved.
   */
  async readAll(
    constraints: Array<[string, WhereFilterOp, unknown]> | null = null,
    order: string | null = null,
    direction: OrderByDirection = 'desc',
    amount: number | null = null
  ): Promise<(T & { id: string })[]> {
    // Do not fetch data if lastResult is true
    if (this.lastResult.value) {
      return []
    }

    const collectionRef: CollectionReference = collection(db, this.collectionPath)

    let q = query(collectionRef)

    const combinedQuery = []

    // Add query constraints if set
    if (constraints) {
      constraints.forEach(([field, op, value]) => combinedQuery.push(where(field, op, value)))
    }

    // Order query by if set
    if (order) {
      combinedQuery.push(orderBy(order, direction))
    }

    // Start query at if set
    if (this.lastVisible) {
      combinedQuery.push(startAfter(this.lastVisible))
    }

    // limit query if set
    if (amount !== null) {
      combinedQuery.push(limit(amount))
    }

    if (combinedQuery.length > 0) {
      q = query(collectionRef, ...combinedQuery)
    }

    const querySnapshot = await getDocs(q)

    // Return the last document
    this.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null

    // Check if fewer results than requested are returned
    this.lastResult.value = amount !== null ? querySnapshot.docs.length < amount : false

    const formatResult = (result: QuerySnapshot<DocumentData>): (T & { id: string })[] =>
      result.docs.map(
        (ref: DocumentSnapshot<DocumentData>) =>
          this.convertObjectTimestampPropertiesToDate({
            id: ref.id,
            ...ref.data()
          }) as T & { id: string }
      )

    return formatResult(querySnapshot)
  }

  /**
   * Update a document in the collection
   * @param data
   */
  async update(data: T & { id: string }): Promise<string> {
    const { id } = data
    const clonedData = structuredClone(deepToRaw(data))
    delete (clonedData as Partial<T & { id: string }>).id

    const docRef: DocumentReference = doc(db, this.collectionPath, id)
    await updateDoc(docRef, {
      ...(clonedData as object),
      updateTimestamp: serverTimestamp()
    })

    return id
  }

  /**
   * Delete a document in the collection
   * @param id
   */
  async delete(id: string): Promise<void> {
    const docRef: DocumentReference = doc(db, this.collectionPath, id)
    await deleteDoc(docRef)
  }

  /**
   * Convert all object Timestamp properties to date
   * @param obj
   */
  convertObjectTimestampPropertiesToDate(obj: Record<string, unknown>): Record<string, unknown> {
    const newObj: Record<string, unknown> = {}

    Object.keys(obj)
      .filter((prop) => obj[prop] instanceof Object)
      .forEach((prop) => {
        if (obj[prop] instanceof Timestamp) {
          obj[prop] = (obj[prop] as Timestamp).toDate()
        } else {
          this.convertObjectTimestampPropertiesToDate(obj[prop] as Record<string, unknown>)
        }
      })

    return {
      ...obj,
      ...newObj
    }
  }
}
