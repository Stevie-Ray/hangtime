import {
  getFirestore,
  collectionGroup,
  getDocs,
  query,
  where,
  WhereFilterOp,
  orderBy,
  limit,
  startAfter,
  Firestore,
  DocumentSnapshot,
  QueryConstraint,
  Timestamp
} from 'firebase/firestore/lite'
import firebaseApp from '@/plugins/firebase'
import GenericDB from '@/plugins/firebase/generic-db'

const db: Firestore = getFirestore(firebaseApp)

export default class UsersWorkoutsDB extends GenericDB {
  constructor() {
    super('users')
  }

  /**
   * Retrieves all documents from the Firestore collection.
   *
   * @param {Array<[string, WhereFilterOp, any]> | null} constraints - Array of constraints for the query.
   * @param {string | null} sort - Field to sort the results by.
   * @param {DocumentSnapshot | null} lastVisible - Last visible document from the previous query.
   * @param {number | null} amount - Maximum number of documents to retrieve.
   * @returns {Promise<any[]>} - Array of documents retrieved.
   */
  async readAll(
    constraints: Array<[string, WhereFilterOp, any]> | null = null,
    sort: string | null = null,
    lastVisible: DocumentSnapshot | null = null,
    amount: number | null = null
  ): Promise<any[]> {
    const collectionRef = collectionGroup(db, 'workouts')

    let q = query(collectionRef)

    const combinedQuery: QueryConstraint[] = []

    if (constraints) {
      constraints.forEach(([field, op, value]) => combinedQuery.push(where(field, op, value)))
    }

    if (sort) {
      combinedQuery.push(orderBy(sort, 'desc'))
    }

    if (lastVisible) {
      const data = lastVisible.data() as { updateTimestamp: Timestamp }
      if (data && data.updateTimestamp) {
        combinedQuery.push(startAfter(data.updateTimestamp))
      }
    }

    if (amount !== null) {
      combinedQuery.push(limit(amount))
    }

    // Add params to query
    if (combinedQuery.length > 0) {
      q = query(collectionRef, ...combinedQuery)
    }

    const formatResult = (result: any) =>
      result.docs.map((ref: any) =>
        this.convertObjectTimestampPropertiesToDate({
          id: ref.id,
          ...ref.data()
        })
      )

    return await getDocs(q).then(formatResult)
  }
}
