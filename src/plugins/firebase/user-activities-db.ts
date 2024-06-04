import GenericDB from './generic-db'

export default class UserActivitiesDB extends GenericDB {
  constructor(userId: string) {
    super(`users/${userId}/activities`)
  }
}
