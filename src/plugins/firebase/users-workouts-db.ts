import {
  getFirestore,
  collectionGroup,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Firestore,
  QueryConstraint,
  QueryDocumentSnapshot,
  DocumentSnapshot,
  FieldPath
} from 'firebase/firestore/lite'
import type { OrderByDirection, WhereFilterOp } from 'firebase/firestore/lite'
import firebaseApp from '@/plugins/firebase'
import GenericDB from '@/plugins/firebase/generic-db'
import type { IWorkout } from '@/interfaces/workout.interface'

const db: Firestore = getFirestore(firebaseApp)

export default class UsersWorkoutsDB extends GenericDB<IWorkout> {
  constructor() {
    super('users')
  }
  /**
   * Retrieves all documents from the Firestore collection.
   *
   * @param {Array<[string, WhereFilterOp, unknown]> | null} constraints - Array of constraints for the query.
   * @param {string | null} order - Field to sort the results by.
   * @param {OrderByDirection} direction - Field to manage the order direction.
   * @param {number | null} amount - Maximum number of documents to retrieve.
   * @returns {Promise<Workout[]>} - Array of documents retrieved.
   */
  async readAll(
    constraints: Array<[string | FieldPath, WhereFilterOp, unknown]> | null = null,
    order: string | null = null,
    direction: OrderByDirection = 'desc',
    amount: number | null = null
  ): Promise<(IWorkout & { id: string })[]> {
    // Do not fetch data if lastResult is true
    if (this.lastResult.value) {
      return []
    }
    const collectionRef = collectionGroup(db, 'workouts')

    let q = query(collectionRef)

    const combinedQuery: QueryConstraint[] = []

    if (constraints) {
      constraints.forEach(([field, op, value]) => combinedQuery.push(where(field, op, value)))
    }

    if (order) {
      combinedQuery.push(orderBy(order, direction))
    }

    if (this.lastVisible) {
      combinedQuery.push(startAfter(this.lastVisible))
    }

    if (amount !== null) {
      combinedQuery.push(limit(amount))
    }

    if (combinedQuery.length > 0) {
      q = query(collectionRef, ...combinedQuery)
    }

    const querySnapshot = await getDocs(q)

    this.lastVisible =
      (querySnapshot.docs[querySnapshot.docs.length - 1] as DocumentSnapshot<IWorkout>) || null

    this.lastResult.value = amount !== null ? querySnapshot.docs.length < amount : false

    const formatResult = (result: { docs: QueryDocumentSnapshot[] }) =>
      result.docs.map(
        (ref) =>
          this.convertObjectTimestampPropertiesToDate({
            id: ref.id,
            ...ref.data()
          }) as unknown as IWorkout
      )

    return formatResult(querySnapshot) as (IWorkout & { id: string })[]
  }
}

/**
 * Class for managing user subscribed workouts.
 */
export class UserSubscribedDB extends UsersWorkoutsDB {
  constructor() {
    super()
  }
}

/**
 * Class for managing community workouts.
 */
export class CommunityWorkoutsDB extends UsersWorkoutsDB {
  constructor() {
    super()
  }
}
