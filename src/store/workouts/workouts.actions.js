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
      description: state.workoutToCreate.description,
      exercises: []
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
  },
  /**
   * Update workout
   */
  updateWorkout: async ({ rootState }, payload) => {
    // commit('setWorkoutCreationPending', true)
    const userWorkoutsDb = new UserWorkoutsDB(rootState.authentication.user.id)
    await userWorkoutsDb.update(payload)
    // commit('setWorkoutCreationPending', false)
  },

  /**
   * Callback fired when changing a workout
   */
  triggerUpdateWorkout: ({ dispatch, state }, payload) => {
    if (!state.workouts) return

    // const workout = state.workouts.find(
    //   workout => workout.id === payload.workout.id
    // )
    dispatch('updateWorkout', payload)
  },
  /**
   * Create a new exercise for current logged in user and reset exercise name input
   */
  triggerAddExerciseAction: ({ dispatch, state, commit }, id) => {
    if (!id) return
    commit('addExercise', { id: id, data: state.exerciseToCreate })

    const workout = state.workouts.find(workout => workout.id === id)

    dispatch('updateWorkout', workout)
  },
  /**
   * Callback fired when changing the order of exercises
   */
  triggerReorderExercises: ({ commit, state, dispatch }, payload) => {
    if (!state.workouts) return
    commit('setExercises', { id: payload.workout.id, data: payload.exercises })

    const workout = state.workouts.find(
      workout => workout.id === payload.workout.id
    )

    dispatch('updateWorkout', workout)
  },
  /**
   * Delete a user exercise from its id
   */
  deleteUserExercise: ({ commit, dispatch }, payload) => {
    // TODO: fix pending state
    // if (getters.isExerciseDeletionPending({ workout: payload.workout.id, index: payload.index})) return

    // commit('addExerciseDeletionPending', { workout: payload.workout.id, index: payload.index})
    commit('removeExerciseByIndex', payload)
    dispatch('updateWorkout', payload.workout)
    // commit('removeExerciseDeletionPending', payload.exerciseId)
  }
}
