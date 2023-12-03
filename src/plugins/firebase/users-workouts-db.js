import {
  getFirestore,
  collectionGroup,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore/lite'
import firebaseApp from '@/plugins/firebase'
import GenericDB from '@/plugins/firebase/generic-db'

const db = getFirestore(firebaseApp)

export default class UsersWorkoutsDB extends GenericDB {
  constructor() {
    super('users')
  }

  // Here you can extend UsersWorkoutsDB with custom methods
  async readAll(constraints = null, sort = null, amount = null) {
    const collectionRef = collectionGroup(db, 'workouts')

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
}
