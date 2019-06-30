import GenericDB from './generic-db'
import firestore from './async-firestore'

export default class UsersDB extends GenericDB {
  constructor() {
    super(`users`)
  }

  // Here you can extend UsersDB with custom methods
  async readAll(constraints = null) {
    const collectionRef = (await firestore())
      .collectionGroup('workouts')
      .where('share', '==', true)

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
}
