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
  startAfter
} from 'firebase/firestore/lite'
import { toRaw, isRef, isReactive, isProxy } from 'vue'
import firebaseApp from '@/plugins/firebase'

export function deepToRaw(sourceObj: any): any {
  const objectIterator = (input: any): any => {
    if (Array.isArray(input)) {
      return input.map((item) => objectIterator(item))
    }
    if (isRef(input) || isReactive(input) || isProxy(input)) {
      return objectIterator(toRaw(input))
    }
    if (input && typeof input === 'object') {
      return Object.keys(input).reduce((acc, key) => {
        acc[key] = objectIterator(input[key])
        return acc
      }, {} as any)
    }
    return input
  }

  return objectIterator(sourceObj)
}

const db: Firestore = getFirestore(firebaseApp)

export default class GenericDB<T> {
  public collectionPath: string

  constructor(collectionPath: string) {
    this.collectionPath = collectionPath
  }
  /**
   * Create a document in the collection
   * @param data
   * @param id
   */
  async create(data: any, id?: string | null): Promise<T> {
    const collectionRef: CollectionReference = collection(db, this.collectionPath)
    const serverTimestampA = serverTimestamp()

    const dataToCreate = {
      ...data,
      createTimestamp: serverTimestampA,
      updateTimestamp: serverTimestampA
    }

    let docId: string

    if (id === null || id === undefined) {
      const docRef = await addDoc(collectionRef, dataToCreate)
      docId = docRef.id
    } else {
      await setDoc(doc(db, this.collectionPath, id), dataToCreate)
      docId = id
    }

    return {
      id: docId,
      ...data,
      createTimestamp: new Date(),
      updateTimestamp: new Date()
    } as T
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
   * @param {Array<[string, WhereFilterOp, any]> | null} constraints - Array of constraints for the query.
   * @param {string | null} order - Field to sort the results by.
   * @param {OrderByDirection} direction - Field to manage the order direction.
   * @param {number | null} amount - Maximum number of documents to retrieve.
   * @param {DocumentSnapshot | null} lastVisible - Last visible document from the previous query.
   * @returns {Promise<any[]>} - Array of documents retrieved.
   */
  async readAll(
    constraints: Array<[string, WhereFilterOp, any]> | null = null,
    order: string | null = null,
    direction: OrderByDirection = 'desc',
    amount: number | null = null,
    lastVisible: DocumentSnapshot | null = null
  ): Promise<any[]> {
    const collectionRef: CollectionReference = collection(db, this.collectionPath)

    let q = query(collectionRef)

    const combinedQuery = []

    if (constraints) {
      constraints.forEach(([field, op, value]) => combinedQuery.push(where(field, op, value)))
    }

    if (order) {
      combinedQuery.push(orderBy(order, direction))
    }

    if (lastVisible) {
      combinedQuery.push(startAfter(lastVisible))
    }

    if (amount !== null) {
      combinedQuery.push(limit(amount))
    }

    if (combinedQuery.length > 0) {
      q = query(collectionRef, ...combinedQuery)
    }

    const formatResult = (result: any): any =>
      result.docs.map((ref: any) =>
        this.convertObjectTimestampPropertiesToDate({
          id: ref.id,
          ...ref.data()
        })
      )

    return await getDocs(q).then(formatResult)
  }

  /**
   * Update a document in the collection
   * @param data
   */
  async update(data: any): Promise<string> {
    const { id } = data
    const clonedData = structuredClone(deepToRaw(data))
    delete clonedData.id

    const docRef: DocumentReference = doc(db, this.collectionPath, id)
    await updateDoc(docRef, {
      ...clonedData,
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
  convertObjectTimestampPropertiesToDate(obj: any): any {
    const newObj = {}

    Object.keys(obj)
      .filter((prop) => obj[prop] instanceof Object)
      .forEach((prop) => {
        if (obj[prop] instanceof Timestamp) {
          obj[prop] = obj[prop].toDate()
        } else {
          this.convertObjectTimestampPropertiesToDate(obj[prop])
        }
      })

    return {
      ...obj,
      ...newObj
    }
  }
}
