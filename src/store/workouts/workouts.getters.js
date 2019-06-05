import { find } from 'lodash'

export default {
  /**
   * Check if a workout has deletion pending
   */
  isWorkoutDeletionPending: state => workoutId =>
    state.workoutDeletionPending.includes(workoutId),

  /**
   * Get a product by id
   */
  workoutById: state => workoutId => find(state.workouts, { id: workoutId })
}
