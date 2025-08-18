import GenericDB from './generic-db'
import type { IActivity } from '@/interfaces/activity.interface'

export default class UserActivitiesDB extends GenericDB<IActivity> {
  constructor(userId: string) {
    super(`users/${userId}/activities`)
  }
}
