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
  limit
} from 'firebase/firestore/lite'
import { toRaw } from 'vue'
import firebaseApp from '@/plugins/firebase'

const db = getFirestore(firebaseApp)

export default class GenericDB {
  constructor(collectionPath) {
    this.collectionPath = collectionPath
  }

  /**
   * Create a document in the collection
   * @param data
   * @param id
   */
  async create(data, id = null) {
    const collectionRef = collection(db, this.collectionPath)
    const serverTimestampA = serverTimestamp()

    const dataToCreate = {
      ...data,
      createTimestamp: serverTimestampA,
      updateTimestamp: serverTimestampA
    }

    // Create doc with generated id or create doc with custom id
    const createPromise =
      id === null || id === undefined
        ? await addDoc(collectionRef, dataToCreate).then((result) => result.id)
        : await setDoc(doc(db, this.collectionPath, id), dataToCreate).then(() => id)

    const docId = await createPromise

    return {
      id: docId,
      ...data,
      createTimestamp: new Date(),
      updateTimestamp: new Date()
    }
  }

  /**
   * Read a document in the collection
   * @param id
   */
  async read(id) {
    const docRef = doc(db, this.collectionPath, id)
    const result = await getDoc(docRef)

    const data = result.exists() ? result.data() : null

    if (data === null || data === undefined) return null

    this.convertObjectTimestampPropertiesToDate(data)

    return { id, ...data }
  }

  /**
   * Read all documents in the collection following constraints
   * @param constraints {array}
   * @param sort {null|string}
   * @param amount {null|number}
   * @return {Promise<*>}
   */
  async readAll(constraints = null, sort = null, amount = null) {
    const collectionRef = collection(db, this.collectionPath)

    let q = query(collectionRef)

    const combinedQuery = []

    if (constraints) {
      constraints.forEach((constraint) => combinedQuery.push(where(...constraint)))
    }

    if (sort) {
      combinedQuery.push(orderBy(sort, 'desc'))
    }

    if (amount) {
      combinedQuery.push(limit(amount))
    }
    // add params to query
    if (combinedQuery.length > 0) {
      q = query(collectionRef, ...combinedQuery)
    }

    const formatResult = (result) =>
      result.docs.map((ref) =>
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
  async update(data) {
    const { id } = data
    const clonedData = structuredClone(toRaw(data))
    delete clonedData.id

    const docRef = doc(db, this.collectionPath, id)
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
  async delete(id) {
    const docRef = doc(db, this.collectionPath, id)
    return await deleteDoc(docRef)
  }

  /**
   * Convert all object Timestamp properties to date
   * @param obj
   */
  convertObjectTimestampPropertiesToDate(obj) {
    const newObj = {}

    Object.keys(obj)
      .filter((prop) => obj[prop] instanceof Object)
      .forEach((prop) => {
        if (obj[prop] instanceof Timestamp) {
          newObj[prop] = obj[prop].toDate()
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
