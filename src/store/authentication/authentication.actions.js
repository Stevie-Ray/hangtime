import router from '@/router'
import { isNil } from 'lodash'
import { createNewUserFromFirebaseAuthUser } from '@/misc/helpers'
import UsersDB from '@/firebase/users-db'

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
    dispatch('workouts/getUserWorkouts', null, { root: true })
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
   * Callback fired when changing a user setting
   */
  triggerUpdateUser: ({ dispatch, state }) => {
    if (!state.user) return
    dispatch('updateUser', state.user)
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
    // TODO: check if hangboard exists
    if (state.hangboardToAdd.hangboard === '') return
    // commit('setHangboardToCreate', {company: 0, hangboard: 0})
    dispatch('addUserHangboard', state.hangboardToAdd)
  }
}
