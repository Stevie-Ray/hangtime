import GenericDB from './generic-db'

export default class WorkoutSubscriberDB extends GenericDB {
  constructor(userId, workoutId) {
    super(`users/${userId}/workouts/${workoutId}/subscribers`)
  }

  // Here you can extend UWorkoutSubscriberDB with custom methods
}
