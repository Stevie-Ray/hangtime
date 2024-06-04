import GenericDB from './generic-db'

export default class UserWorkoutsDB extends GenericDB {
  constructor(userId: string) {
    super(`users/${userId}/workouts`)
  }
}
