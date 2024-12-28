import { IWorkout } from '@/interfaces/workout.interface'
import GenericDB from './generic-db'

export default class UserWorkoutsDB extends GenericDB<IWorkout> {
  constructor(userId: string) {
    super(`users/${userId}/workouts`)
  }
}
