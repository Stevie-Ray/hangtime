import firestore from '@/firebase/async-firestore'
import GenericDB from './generic-db'

export default class UsersDB extends GenericDB {
  constructor() {
    super(`users`)
  }

  // Here you can extend UsersDB with custom methods
  async readAll(constraints = null) {
    const collectionRef = (await firestore())
      .collection(this.collectionPath)
      .orderBy(`completed`)
    let query = collectionRef

    if (constraints) {
      constraints.forEach((constraint) => {
        query = query.where(...constraint)
      })
    }

    const formatResult = (result) =>
      result.docs.map((ref) => {
        const data = this.convertObjectTimestampPropertiesToDate({
          id: ref.id,
          ...ref.data()
        })
        // TODO: move to collection call
        delete data.email
        return data
      })

    return query.get().then(formatResult)
  }
}
