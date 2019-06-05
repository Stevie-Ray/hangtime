import UserWorkoutsDB from '@/firebase/user-workouts-db'

export default {
  /**
   * Fetch workouts of current logged in user
   */
  getUserWorkouts: async ({ rootState, commit }) => {
    console.log('request UserWorkoutsDB')
    const userWorkoutsDb = new UserWorkoutsDB(rootState.authentication.user.id)

    const workouts = await userWorkoutsDb.readAll()
    commit('setWorkouts', workouts)
  },
  /**
   * Create a workout for current logged in user
   */
  createUserWorkout: async ({ commit, rootState }, workout) => {
    const userWorkoutDb = new UserWorkoutsDB(rootState.authentication.user.id)

    commit('setWorkoutCreationPending', true)
    const createdWorkout = await userWorkoutDb.create(workout)
    commit('addWorkout', createdWorkout)
    commit('setWorkoutCreationPending', false)
  },

  /**
   * Create a new workout for current logged in user and reset workout name input
   */
  triggerAddWorkoutAction: ({ dispatch, state, commit }) => {
    if (state.workoutToCreate.name === '') return
    const workout = {
      name: state.workoutToCreate.name,
      description: state.workoutToCreate.description
    }
    commit('setWorkoutToCreate', '')
    dispatch('createUserWorkout', workout)
  },
  /**
   * Update the total workout time
   */
  // updateUserWorkoutTime: ({ state, commit }) => {},
  /**
   * Delete a user workout from its id
   */
  deleteUserWorkout: async ({ rootState, commit, getters }, workoutId) => {
    if (getters.isWorkoutDeletionPending(workoutId)) return

    const userWorkoutsDb = new UserWorkoutsDB(rootState.authentication.user.id)

    commit('addWorkoutDeletionPending', workoutId)
    await userWorkoutsDb.delete(workoutId)
    commit('removeWorkoutById', workoutId)
    commit('removeWorkoutDeletionPending', workoutId)
  }
}
