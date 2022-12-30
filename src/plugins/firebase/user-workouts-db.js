import GenericDB from './generic-db'

export default class UsersDB extends GenericDB {
  constructor(userId) {
    super(`users/${userId}/workouts`)
  }
}
