import GenericDB from './generic-db'

export default class UserProgressDB extends GenericDB {
  constructor(userId) {
    super(`users/${userId}/progress`)
  }

  // Here you can extend UserWorkoutsDB with custom methods
}
