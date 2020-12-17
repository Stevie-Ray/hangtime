import { isNil } from 'lodash'
import router from '@/router'
import { createNewUserFromFirebaseAuthUser } from '@/misc/helpers'
import UsersDB from '@/firebase/users-db'
import i18n from '@/misc/i18n.js'

export default {
  /**
   * Callback fired when user login
   */
  login: async ({ commit, dispatch }, firebaseAuthUser) => {
    const userFromFirebase = await new UsersDB().read(firebaseAuthUser.uid)

    const user = isNil(userFromFirebase)
      ? await createNewUserFromFirebaseAuthUser(firebaseAuthUser)
      : userFromFirebase

    commit('setUser', user)

    if (!isNil(user) && user.settings && user.settings.locale) {
      i18n.locale = user.settings.locale
    }

    dispatch('workouts/getUserWorkouts', null, { root: true })
    dispatch('workouts/getCommunityWorkouts', null, { root: true })
    dispatch('progress/getUserProgress', null, { root: true })
  },

  /**
   * Callback fired when user logout
   */
  logout: ({ commit }) => {
    commit('setUser', null)
    commit('workouts/setWorkouts', null, { root: true })

    const currentRouter = router.app.$route
    if (!(currentRouter.meta && currentRouter.meta.authNotRequired)) {
      router.push('/login')
    }
  },

  /**
   * Update user
   */
  updateUser: async ({ commit }, user) => {
    const usersDb = new UsersDB()
    await usersDb.update(user)
    commit('setUser', user)
  },
  /**
   * Callback fired when workout is done
   */
  triggerUpdateTimes: ({ commit, dispatch, state }, time) => {
    if (!state.user) return
    commit('setCompleted')
    commit('setCompletedTime', time.total)
    commit('setCompletedHold', time.hold)
    commit('setCompletedAmount')
    dispatch('updateUser', state.user)
  },
  /**
   * Callback fired when changing a user setting
   */
  triggerUpdateUser: ({ dispatch, state }) => {
    if (!state.user) return
    dispatch('updateUser', state.user)
  },
  /**
   * Callback fired when changing hangboards
   */
  triggerSwitchHangboard: ({ dispatch }) => {
    dispatch('workouts/getCommunityWorkouts', null, { root: true })
  },
  /**
   * Add a new hangboard  for current logged in user
   */
  addUserHangboard: ({ commit, state, dispatch }, hangboard) => {
    // commit('setHangboardCreationPending', true)
    commit('addHangboard', hangboard)
    dispatch('updateUser', state.user)
    // commit('setHangboardCreationPending', false)
  },

  /**
   * Check if hangboard has been added and add it to current logged in user
   */
  triggerAddHangboardAction: ({ dispatch, state }) => {
    if (state.hangboardToAdd.hangboard === '') return
    // commit('setHangboardToCreate', {company: 0, hangboard: 0})
    const hangboard = {
      company: state.hangboardToAdd.company,
      hangboard: state.hangboardToAdd.hangboard
    }
    dispatch('addUserHangboard', hangboard)
  },

  triggerChangeHangboardAction: ({ commit, dispatch, state }, index) => {
    commit('setSelected', index)
    dispatch('updateUser', state.user)
    dispatch('triggerSwitchHangboard')
  },

  triggerRemoveHangboardAction: ({ commit, dispatch, state }, index) => {
    commit('removeHangboard', index)
    commit('setSelected', 0)
    dispatch('updateUser', state.user)
  }
}
