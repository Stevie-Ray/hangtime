import { find, filter } from 'lodash'

export default {
  /**
   * Check if a workout has deletion pending
   */
  isWorkoutDeletionPending: state => workoutId =>
    state.workoutDeletionPending.includes(workoutId),

  /**
   * Get workouts for the currently selected hangboard
   */
  workoutsByHangboard: state => payload =>
    filter(state.workouts, {
      company: payload.settings.hangboards[payload.settings.selected].company,
      hangboard:
        payload.settings.hangboards[payload.settings.selected].hangboard
    }),

  communityWorkoutsByHangboard: state => payload =>
    filter(state.communityWorkouts, {
      company: payload.settings.hangboards[payload.settings.selected].company,
      hangboard:
        payload.settings.hangboards[payload.settings.selected].hangboard
    }),

  /**
   * Get a workout by id
   */
  workoutById: state => workoutId => {
    let data = find(state.workouts, { id: workoutId })
    if (!data) data = find(state.communityWorkouts, { id: workoutId })
    return data
  },
  /**
   * Get subscribers of a workout by id
   */
  subscribersById: state => workoutId => {
    return find(state.subscribers, { id: workoutId })
  },

  // /**
  //  * Get a workout by id
  //  */
  // communityWorkoutById: state => workoutId =>
  //   find(state.communityWorkouts, { id: workoutId }),

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
}
