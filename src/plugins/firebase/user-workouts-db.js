import GenericDB from './generic-db'

export default class UserWorkoutsDB extends GenericDB {
  constructor(userId) {
    super(`users/${userId}/workouts`)
  }
}
