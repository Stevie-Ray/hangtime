import UserWorkoutsDB from '@/firebase/user-workouts-db'
import UsersDB from '@/firebase/users-db'
import UsersWorkoutsDB from '@/firebase/users-workouts-db'

export default {
  /**
   * Fetch workouts of current logged in user
   */
  getUserWorkouts: async ({ rootState, commit }) => {
    const usersDb = new UsersWorkoutsDB(rootState.authentication.user.id)
    const workouts = await usersDb.readAll([
      ['subscribers', 'array-contains', rootState.authentication.user.id]
    ])
    commit('setWorkouts', workouts)
  },
  getCommunityWorkouts: async ({ rootState, commit }) => {
    const usersWorkoutDb = new UsersWorkoutsDB(rootState.authentication.user.id)
    const { selected } = rootState.authentication.user.settings
    const { hangboards } = rootState.authentication.user.settings
    const communityWorkouts = await usersWorkoutDb.readAll([
      ['share', '==', true],
      ['company', '==', hangboards[selected].company],
      ['hangboard', '==', hangboards[selected].hangboard]
    ])
    commit('setCommunityWorkouts', communityWorkouts)
  },
  getLeaderboard: async ({ commit }) => {
    const usersDb = new UsersDB()
    const leaderboard = await usersDb.readAll()
    commit('setLeaderboard', leaderboard)
  },
  /**
   * Create a workout for current logged in user
   */
  createUserWorkout: async ({ commit, rootState }, workout) => {
    const userWorkoutDb = new UserWorkoutsDB(rootState.authentication.user.id)

    commit('setWorkoutCreationPending', true)
    const createdWorkout = await userWorkoutDb.create(workout)
    commit('addWorkout', createdWorkout)
    // also add the workout as a community workout
    if (createdWorkout.share === true) {
      commit('addCommunityWorkout', createdWorkout)
    }
    commit('setWorkoutCreationPending', false)
  },

  /**
   * Create a new workout for current logged in user and reset workout name input
   */
  triggerAddWorkoutAction: ({ dispatch, state, commit }) => {
    if (state.workoutToCreate.name === '') return

    // map fields
    const workout = {
      name: state.workoutToCreate.name,
      description: state.workoutToCreate.description,
      level: state.workoutToCreate.level,
      hangboard: state.workoutToCreate.hangboard,
      company: state.workoutToCreate.company,
      exercises: state.workoutToCreate.exercises,
      time: state.workoutToCreate.time,
      share: state.workoutToCreate.share,
      video: state.workoutToCreate.video,
      subscribers: [state.workoutToCreate.user.id],
      user: {
        displayName: state.workoutToCreate.user.displayName,
        grade: state.workoutToCreate.user.grade,
        id: state.workoutToCreate.user.id,
        photoURL: state.workoutToCreate.user.photoURL
      }
    }
    commit('resetWorkoutToCreate')
    dispatch('createUserWorkout', workout)
  },
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
  triggerUpdateWorkout: ({ commit, dispatch, state }, payload) => {
    if (!state.workouts) return
    if (!payload.id) payload.id = 'new'
    commit('setTotalTime', payload.id)

    if (payload.id !== 'new') {
      dispatch('updateWorkout', payload)
    }
  },
  /**
   * Create a new exercise for current logged in user and reset exercise name input
   */
  triggerAddExerciseAction: ({ dispatch, state, commit }, id) => {
    if (!id) return

    const exercise = state.exerciseToCreate

    commit('addExercise', { id, data: exercise })

    commit('setTotalTime', id)

    // eslint-disable-next-line no-shadow
    const workout = state.workouts.find(workout => workout.id === id)

    commit('setExerciseToCreate', {
      exercise: 0,
      left: 0,
      right: 0,
      pause: 10,
      hold: 10,
      repeat: 0,
      rest: 0,
      time: 20
    })

    dispatch('updateWorkout', workout)
  },
  /**
   * Callback fired when changing the order of exercises
   */
  triggerReorderExercises: ({ commit, state, dispatch }, payload) => {
    if (!state.workouts) return

    if (payload.workout.id) {
      commit('setExercises', {
        id: payload.workout.id,
        data: payload.exercises
      })

      const workout = state.workouts.find(
        // eslint-disable-next-line no-shadow
        workout => workout.id === payload.workout.id
      )

      dispatch('updateWorkout', workout)
    } else {
      commit('setExercises', {
        data: payload.exercises
      })
    }
  },
  /**
   * Delete a user exercise from its id
   */
  deleteUserExercise: ({ commit, dispatch }, payload) => {
    // TODO: fix pending state
    // if (getters.isExerciseDeletionPending({ workout: payload.workout.id, index: payload.index})) return

    // commit('addExerciseDeletionPending', { workout: payload.workout.id, index: payload.index})
    commit('removeExerciseByIndex', payload)
    if (payload.workout.id) {
      commit('setTotalTime', payload.workout.id)
      dispatch('updateWorkout', payload.workout)
    } else {
      commit('setTotalTime', 'new')
    }
    // commit('removeExerciseDeletionPending', payload.exerciseId)
  },
  /**
   * Delete a user exercise from its id
   */
  copyUserExercise: ({ commit, dispatch }, payload) => {
    // TODO: fix pending state
    // if (getters.isExerciseDeletionPending({ workout: payload.workout.id, index: payload.index})) return

    // commit('addExerciseDeletionPending', { workout: payload.workout.id, index: payload.index})
    commit('copyExerciseByIndex', payload)
    if (payload.workout.id) {
      commit('setTotalTime', payload.workout.id)
      dispatch('updateWorkout', payload.workout)
    } else {
      commit('setTotalTime', 'new')
    }
    // commit('removeExerciseDeletionPending', payload.exerciseId)
  },
  shareWorkout: ({ state, commit, dispatch }, id) => {
    commit('shareWorkout', id)
    // eslint-disable-next-line no-shadow
    const workout = state.workouts.find(workout => workout.id === id)

    dispatch('updateWorkout', workout)
  },
  triggerAddWorkoutSubscriber: async ({ state, commit }, payload) => {
    commit('addSubscriber', { id: payload.id, user: payload.user })

    const workout = state.communityWorkouts.find(
      // eslint-disable-next-line no-shadow
      workout => workout.id === payload.id
    )

    const userWorkoutsDb = new UserWorkoutsDB(payload.userId)
    await userWorkoutsDb.update(workout)
    commit('addWorkout', workout)
  },
  triggerRemoveWorkoutSubscriber: async ({ state, commit }, payload) => {
    commit('removeSubscriber', { id: payload.id, user: payload.user })

    const workout = state.communityWorkouts.find(
      // eslint-disable-next-line no-shadow
      workout => workout.id === payload.id
    )
    commit('removeWorkoutById', workout.id)
    const userWorkoutsDb = new UserWorkoutsDB(payload.userId)
    await userWorkoutsDb.update(workout)
  }
}
