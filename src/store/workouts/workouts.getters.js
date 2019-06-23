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
  workoutById: state => workoutId => find(state.workouts, { id: workoutId }),

  /**
   * Get an option by id
   */

  typeById: state => typeId => find(state.options, { id: typeId }),

  /**
   * Check if a exercise has deletion pending
   */
  isExerciseDeletionPending: state => exerciseId =>
    state.exerciseDeletionPending.includes(exerciseId),

  /**
   * Get a workouts difficulty by value
   */
  difficultyById: state => levelValue =>
    find(state.levels, { value: levelValue })

  // /**
  //  * Get an exercise by id
  //  */
  // exerciseById: state => exerciseId =>
  //   find(state.exercises, { id: exerciseId }),
}
