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

  /**
   * Update all document in the collection
   */
  async updateAll() {
    await (await firestore()).collection(this.collectionPath).get()
    // .then((querySnapshot) => querySnapshot.forEach(function (doc) {
    //   // console.log(doc)
    //       doc.ref.update({
    //         user: {
    //           id: 'EwEMPFmYJ7OpA5y1hkcf2mFz8fA2',
    //           grade: 3,
    //           displayName: "Stevie-Ray Hartog",
    //           photoURL: "https://graph.facebook.com/10206876973741829/picture"
    //         }
    //       })
    //     }));
  }
}
