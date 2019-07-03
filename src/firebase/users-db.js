import GenericDB from './generic-db'
import firestore from './async-firestore'

export default class UsersDB extends GenericDB {
  constructor() {
    super(`users`)
  }

  // Here you can extend UsersDB with custom methods
  async readAll(constraints = null) {
    const collectionRef = (await firestore()).collectionGroup('workouts')

    let query = collectionRef

    if (constraints) {
      constraints.forEach(constraint => (query = query.where(...constraint)))
    }

    const formatResult = result =>
      result.docs.map(ref => {
        // const userRef = ref.ref.parent.parent;
        // userRef.get().then(parentSnap => {
        //   const user = parentSnap.data();
        //   console.log(user.displayName);
        // });

        return this.convertObjectTimestampPropertiesToDate({
          id: ref.id,
          ...ref.data()
        })
      })

    return query.get().then(formatResult)
  }
}
