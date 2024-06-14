import GenericDB from './generic-db'
import { Activity } from '@/interfaces/activities.interface'

export default class UserActivitiesDB extends GenericDB<Activity> {
  constructor(userId: string) {
    super(`users/${userId}/activities`)
  }
}
