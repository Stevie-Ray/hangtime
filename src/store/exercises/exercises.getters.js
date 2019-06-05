import { find } from 'lodash'

export default {
  /**
   * Check if a exercise has deletion pending
   */
  isExerciseDeletionPending: state => exerciseId =>
    state.exerciseDeletionPending.includes(exerciseId),

  /**
   * Get an exercise by id
   */
  exerciseById: state => exerciseId => find(state.exercises, { id: exerciseId })
}
