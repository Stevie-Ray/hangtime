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
  OrderByDirection
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
   * @param {string | null} order - Field to sort the results by.
   * @param {OrderByDirection} direction - Field to manage the order direction.
   * @param {DocumentSnapshot | null} lastVisible - Last visible document from the previous query.
   * @param {number | null} amount - Maximum number of documents to retrieve.
   * @returns {Promise<any[]>} - Array of documents retrieved.
   */
  async readAll(
    constraints: Array<[string, WhereFilterOp, any]> | null = null,
    order: string | null = null,
    direction: OrderByDirection = 'desc',
    lastVisible: DocumentSnapshot | null = null,
    amount: number | null = null
  ): Promise<any[]> {
    const collectionRef = collectionGroup(db, 'workouts')

    let q = query(collectionRef)

    const combinedQuery: QueryConstraint[] = []

    if (constraints) {
      constraints.forEach(([field, op, value]) => combinedQuery.push(where(field, op, value)))
    }

    if (order) {
      combinedQuery.push(orderBy(order, direction))
    }

    if (lastVisible) {
      // @ts-expect-error Custom field on DocumentSnapshot
      const { updateTimestamp } = lastVisible
      combinedQuery.push(startAfter(updateTimestamp))
    }

    if (amount !== null) {
      combinedQuery.push(limit(amount))
    }

    // Add params to query
    if (combinedQuery.length > 0) {
      q = query(collectionRef, ...combinedQuery)
    }

    console.log(combinedQuery)
    console.log(q)

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
