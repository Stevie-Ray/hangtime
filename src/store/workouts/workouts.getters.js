import { find, filter, orderBy } from 'lodash'

export default {
  /**
   * Check if a workout has deletion pending
   */
  isWorkoutDeletionPending: state => workoutId =>
    state.workoutDeletionPending.includes(workoutId),

  /**
   * Get workouts for the currently selected hangboard
   */
  workoutsByHangboard: state => payload => {
    let data = {}
    data = filter(state.workouts, {
      company: payload.settings.hangboards[payload.settings.selected].company,
      hangboard:
        payload.settings.hangboards[payload.settings.selected].hangboard
    })
    data = orderBy(data, ['updateTimestamp', 'createTimestamp'], 'desc')
    return data
  },

  communityWorkoutsByHangboard: state => payload => {
    let data = {}
    data = filter(state.communityWorkouts, {
      company:
        payload.user.settings.hangboards[payload.user.settings.selected]
          .company,
      hangboard:
        payload.user.settings.hangboards[payload.user.settings.selected]
          .hangboard
    })
    data = orderBy(data, payload.filter, payload.order)
    return data
  },

  /**
   * Get a workout by id
   */
  workoutById: state => workoutId => {
    let data = find(state.workouts, { id: workoutId })
    if (!data) data = find(state.communityWorkouts, { id: workoutId })
    if (workoutId === 'new') return state.workoutToCreate
    return data
  },
  // /**
  //  * Get subscribers of a workout by id
  //  */
  // subscribersById: state => workoutId => {
  //   return find(state.subscribers, { id: workoutId })
  // },

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
