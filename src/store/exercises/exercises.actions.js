import UserExercisesDB from '@/firebase/user-exercises-db'
// import UserWorkoutsDB from '@/firebase/user-workouts-db'

export default {
  /**
   * Fetch exercises of current workout
   */
  getWorkoutExercises: async ({ rootState, commit }, id) => {
    const userExercisesDb = new UserExercisesDB(
      rootState.authentication.user.id,
      id
    )
    const exercises = await userExercisesDb.readAll()
    commit('setExercises', exercises)
  },
  /**
   * Create a exercise for current logged in user
   */
  createUserExercise: async ({ commit, rootState }, payload) => {
    const userExerciseDb = new UserExercisesDB(
      rootState.authentication.user.id,
      payload.workout
    )

    commit('setExerciseCreationPending', true)
    const createdExercise = await userExerciseDb.create(payload.exercise)
    commit('addExercise', createdExercise)
    commit('setExerciseCreationPending', false)
  },

  /**
   * Create a new exercise for current logged in user and reset exercise name input
   */
  triggerAddExerciseAction: ({ dispatch, state, commit }, id) => {
    if (!id) return
    const exerciseToCreate = {
      exercise: 0,
      left: 0,
      right: 0,
      pause: 10,
      hold: 10,
      repeat: 1,
      rest: 0
    }

    commit('setExerciseToCreate', exerciseToCreate)
    dispatch('createUserExercise', {
      exercise: state.exerciseToCreate,
      workout: id
    })
  },

  /**
   * Update exercise
   */
  updateExercise: async ({ rootState }, payload) => {
    const userExerciseDb = new UserExercisesDB(
      rootState.authentication.user.id,
      payload.workout
    )
    await userExerciseDb.update(payload.exercise)
  },

  /**
   * Callback fired when changing a exercise
   */
  triggerUpdateExercise: ({ dispatch, state }, payload) => {
    if (!state.exercises) return
    const exercise = state.exercises.find(
      exercise => exercise.id === payload.exercise.id
    )
    dispatch('updateExercise', {
      exercise: exercise,
      workout: payload.workout
    })
  },

  /**
   * Callback fired when changing the order of exercises
   */
  triggerReorderExercises: ({ commit, state, dispatch }, payload) => {
    if (!state.exercises) return
    payload.exercises.forEach(function(exercise, index) {
      commit('setOrder', { exercise: exercise, index: index })
      // TODO: dispatch outside of loop
      dispatch('updateExercise', {
        exercise: exercise,
        workout: payload.workout
      })
    })
  },

  /**
   * Delete a user exercise from its id
   */
  deleteUserExercise: async ({ rootState, commit, getters }, payload) => {
    if (getters.isExerciseDeletionPending(payload.exerciseId)) return
    const userExercisesDb = new UserExercisesDB(
      rootState.authentication.user.id,
      payload.workout
    )
    // TODO: this probably doesn't work
    commit('addExerciseDeletionPending', payload.exerciseId)
    await userExercisesDb.delete(payload.exerciseId)
    commit('removeExerciseById', payload.exerciseId)
    commit('removeExerciseDeletionPending', payload.exerciseId)
  }
}
