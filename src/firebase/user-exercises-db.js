import GenericDB from './generic-db'
import firestore from './async-firestore'

export default class UserExerciseDB extends GenericDB {
  constructor(userId, workoutId) {
    super(`users/${userId}/workouts/${workoutId}/exercises`)
  }
  // Here you can extend UserWorkoutsDB with custom methods
  async readAll(constraints = null) {
    const collectionRef = (await firestore())
      .collection(this.collectionPath)
      .orderBy('createTimestamp')
    let query = collectionRef
    if (constraints) {
      constraints.forEach(constraint => (query = query.where(...constraint)))
    }

    const formatResult = result =>
      result.docs.map(ref =>
        this.convertObjectTimestampPropertiesToDate({
          id: ref.id,
          ...ref.data()
        })
      )

    return query.get().then(formatResult)
  }

  // /**
  //  * Update all document in the collection
  //  * @param data
  //  */
  // async updateAll(data) {
  //   const clonedData = cloneDeep(data)
  //
  //   await (await firestore()).collection(this.collectionPath).update({
  //     ...clonedData,
  //     updateTimestamp: firebase.firestore.FieldValue.serverTimestamp()
  //   })
  //
  //   return id
  // }
}
