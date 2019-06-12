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
  exerciseById: state => exerciseId =>
    find(state.exercises, { id: exerciseId }),
  /**
   * Get an option by id
   */
  typeById: state => typeId => find(state.options, { id: typeId })
}
