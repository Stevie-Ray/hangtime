import UserWorkoutsDB from '@/firebase/user-workouts-db'
import UsersDB from '@/firebase/users-db'
import WorkoutSubscriberDB from '@/firebase/workout-subscriber-db'

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
  getCommunityWorkouts: async ({ rootState, commit }) => {
    console.log('request UsersDB')
    const usersDb = new UsersDB(rootState.authentication.user.id)
    const selected = rootState.authentication.user.settings.selected
    const hangboards = rootState.authentication.user.settings.hangboards
    const communityWorkouts = await usersDb.readAll([
      ['share', '==', true],
      ['company', '==', hangboards[selected].company],
      ['hangboard', '==', hangboards[selected].hangboard]
    ])
    commit('setCommunityWorkouts', communityWorkouts)
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

    // map fields
    const workout = {
      name: state.workoutToCreate.name,
      description: state.workoutToCreate.description,
      level: state.workoutToCreate.level,
      hangboard: state.workoutToCreate.hangboard,
      company: state.workoutToCreate.company,
      exercises: [],
      user: {
        displayName: state.workoutToCreate.user.displayName,
        grade: state.workoutToCreate.user.grade,
        id: state.workoutToCreate.user.id,
        photoURL: state.workoutToCreate.user.photoURL
      }
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
  triggerUpdateWorkout: ({ commit, dispatch, state }, payload) => {
    if (!state.workouts) return

    commit('setTotalTime', payload.id)

    // const workout = state.workouts.find(
    //   workout => workout.id === payload.id
    // )

    dispatch('updateWorkout', payload)
  },
  /**
   * Create a new exercise for current logged in user and reset exercise name input
   */
  triggerAddExerciseAction: ({ dispatch, state, commit }, id) => {
    if (!id) return

    const exercise = state.exerciseToCreate

    commit('addExercise', { id: id, data: exercise })

    commit('setTotalTime', id)

    const workout = state.workouts.find(workout => workout.id === id)

    commit('setExerciseToCreate', {
      exercise: 0,
      left: 0,
      right: 0,
      pause: 15,
      hold: 10,
      repeat: 1,
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
    commit('setTotalTime', payload.workout.id)
    dispatch('updateWorkout', payload.workout)
    // commit('removeExerciseDeletionPending', payload.exerciseId)
  },
  shareWorkout: ({ state, commit, dispatch }, id) => {
    commit('shareWorkout', id)

    const workout = state.workouts.find(workout => workout.id === id)

    dispatch('updateWorkout', workout)
  },
  getWorkoutSubscribers: async ({ commit }, payload) => {
    const workoutSubscriberDb = new WorkoutSubscriberDB(
      payload.user,
      payload.id
    )

    const subscribers = await workoutSubscriberDb.readAll()

    const subscriberList = {
      id: payload.id,
      subscribers: subscribers
    }

    commit('setSubscribers', subscriberList)
  },
  triggerAddWorkoutSubscriber: async ({ commit }, payload) => {
    const workoutSubscriberDb = new WorkoutSubscriberDB(
      payload.userId,
      payload.id
    )
    await workoutSubscriberDb.create({ id: payload.user }, payload.user)

    commit('addSubscriber', { id: payload.id, user: payload.user })
  },
  triggerRemoveWorkoutSubscriber: async ({ commit }, payload) => {
    const workoutSubscriberDb = new WorkoutSubscriberDB(
      payload.userId,
      payload.id
    )
    await workoutSubscriberDb.delete(payload.user)

    commit('removeSubscriber', { id: payload.id, user: payload.user })
  }
}
