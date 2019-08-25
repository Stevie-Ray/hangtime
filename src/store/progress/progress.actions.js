import UserProgressDB from '@/firebase/user-progress-db'
import { shortDate } from '@/misc/helpers'

export default {
  /**
   * Fetch workouts of current logged in user
   */
  getUserProgress: async ({ rootState, commit }) => {
    console.log('request UserProgressDB')
    const userProgressDb = new UserProgressDB(rootState.authentication.user.id)

    const progress = await userProgressDb.readAll()
    commit('setProgress', progress)
  },
  /**
   * Update exercise
   */
  addUserRecording: async ({ rootState }, payload) => {
    const userProgressDb = new UserProgressDB(rootState.authentication.user.id)
    await userProgressDb.update(payload)
  },

  /**
   * Add a recording to a hangboard / exercise
   */
  AddRecording: ({ state, commit, dispatch }, payload) => {
    const date = new Date()
    const recording = {
      createTimestamp: date,
      label: shortDate(date),
      value: payload.value
    }
    commit('addRecording', { id: payload.data.id, data: recording })

    const progress = state.progress.find(
      // eslint-disable-next-line no-shadow
      progress => progress.id === payload.data.id
    )

    dispatch('addUserRecording', progress)
  },
  /**
   * Add a new hangboard  for current logged in user
   */
  addUserProgress: async ({ commit, rootState }, progress) => {
    const UserProgressDb = new UserProgressDB(rootState.authentication.user.id)
    // commit('setWorkoutCreationPending', true)
    const createdProgress = await UserProgressDb.create(progress)
    commit('addProgress', createdProgress)
    // commit('setProgressCreationPending', false)
  },

  /**
   * Check if hangboard has been added and add it to current logged in user
   */
  triggerAddHangboardAction: ({ dispatch }, progress) => {
    // if (state.progressToAdd === '') return
    // commit('setHangboardToAdd', { left: 0, right: 0})

    dispatch('addUserProgress', progress)
  }
}
