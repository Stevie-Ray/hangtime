import GenericDB from './generic-db'
import firestore from './async-firestore'

export default class UserWorkoutDB extends GenericDB {
  constructor(userId) {
    super(`users/${userId}/workouts`)
  }

  // Here you can extend UserWorkoutsDB with custom methods
  async readAll(constraints = null) {
    const collectionRef = (await firestore())
      .collection(this.collectionPath)
      .orderBy('createTimestamp')
    let query = collectionRef

    if (constraints) {
      constraints.forEach((constraint) => (query = query.where(...constraint)))
    }

    const formatResult = (result) =>
      result.docs.map((ref) =>
        this.convertObjectTimestampPropertiesToDate({
          id: ref.id,
          ...ref.data()
        })
      )

    return query.get().then(formatResult)
  }
}
