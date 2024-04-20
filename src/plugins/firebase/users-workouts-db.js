import {
  getFirestore,
  collectionGroup,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter
} from 'firebase/firestore/lite'
import firebaseApp from '@/plugins/firebase'
import GenericDB from '@/plugins/firebase/generic-db'

const db = getFirestore(firebaseApp)

export default class UsersWorkoutsDB extends GenericDB {
  constructor() {
    super('users')
  }

  /**
   * Retrieves all documents from the Firestore collection.
   *
   * @param {Array|null} constraints - Array of constraints for the query.
   * @param {string|null} sort - Field to sort the results by.
   * @param {DocumentSnapshot|null} lastVisible - Last visible document from the previous query.
   * @param {number|null} amount - Maximum number of documents to retrieve.
   * @returns {Promise<Array>} - Array of documents retrieved.
   */
  async readAll(constraints = null, sort = null, lastVisible = null, amount = null) {
    const collectionRef = collectionGroup(db, 'workouts')

    let q = query(collectionRef)

    const combinedQuery = []

    if (constraints) {
      constraints.forEach((constraint) => combinedQuery.push(where(...constraint)))
    }

    if (sort) {
      combinedQuery.push(orderBy(sort, 'desc'))
    }

    if (lastVisible) {
      const { updateTimestamp } = lastVisible
      combinedQuery.push(startAfter(updateTimestamp))
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
}
