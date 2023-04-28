import GenericDB from './generic-db'

export default class UserActivitiesDB extends GenericDB {
  constructor(userId) {
    super(`users/${userId}/activities`)
  }
}
