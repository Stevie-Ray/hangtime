import { Workout } from '@/interfaces/workouts.interface'
import GenericDB from './generic-db'

export default class UserWorkoutsDB extends GenericDB<Workout> {
  constructor(userId: string) {
    super(`users/${userId}/workouts`)
  }
}
