import Vue from 'vue'

export default {
  resetWorkoutToCreate: state => {
    state.workoutToCreate = {
      exercises: []
    }
  },
  /* Workout inputs */
  setWorkoutToCreate: (state, workoutFieldToCreate) =>
    // state.workoutToCreate[workoutFieldToCreate] = workoutFieldContentToCreate
    (state.workoutToCreate = {
      ...state.workoutToCreate,
      ...workoutFieldToCreate
    }),
  /* Workouts */
  setWorkouts: (state, workouts) => {
    if (workouts) {
      state.workouts = workouts.reverse()
    }
  },
  // setWorkout: (state, workout) => (state.workout = workout),
  setWorkoutName: (state, payload) => {
    const index = state.workouts.findIndex(
      exercise => exercise.id === payload.id
    )
    state.workouts[index].name = payload.value
  },
  setWorkoutDescription: (state, payload) => {
    const index = state.workouts.findIndex(
      exercise => exercise.id === payload.id
    )
    state.workouts[index].description = payload.value
  },
  setWorkoutVideo: (state, payload) => {
    const index = state.workouts.findIndex(
      exercise => exercise.id === payload.id
    )
    state.workouts[index].video = payload.value
  },
  setWorkoutDifficulty: (state, payload) => {
    const index = state.workouts.findIndex(
      exercise => exercise.id === payload.id
    )
    state.workouts[index].level = payload.value
  },
  addWorkout: (state, workout) => state.workouts.unshift(workout),
  addCommunityWorkout: (state, workout) =>
    state.communityWorkouts.unshift(workout),
  removeWorkoutById: (state, workoutId) => {
    const index = state.workouts.findIndex(workout => workout.id === workoutId)
    state.workouts.splice(index, 1)
  },

  /* Workouts deletion */
  addWorkoutDeletionPending: (state, workoutId) =>
    state.workoutDeletionPending.push(workoutId),
  removeWorkoutDeletionPending: (state, workoutId) => {
    const index = state.workouts.findIndex(workout => workout.id === workoutId)
    state.workoutDeletionPending.splice(index, 1)
  },
  setExercises: (state, payload) => {
    const index = state.workouts.findIndex(workout => workout.id === payload.id)
    if (index >= 0) {
      state.workouts[index].exercises = payload.data
    } else {
      state.workoutToCreate.exercises = payload.data
    }
  },
  /* Workout creation */
  setWorkoutCreationPending: (state, value) =>
    (state.workoutCreationPending = value),

  addExercise: (state, payload) => {
    const index = state.workouts.findIndex(workout => workout.id === payload.id)
    if (payload.id === 'new') {
      state.workoutToCreate.exercises.push(payload.data)
      // state.workoutToCreate.exercises = {
      //   ...state.workoutToCreate.exercises,
      //   ...payload.data
      // }
    } else {
      state.workouts[index].exercises.push(payload.data)
    }
  },
  setData: (state, payload) => {
    const index = state.workouts.findIndex(workout => workout.id === payload.id)
    if (payload.id === 'new') {
      const data = {
        ...state.workoutToCreate.exercises[payload.index],
        ...payload.value
      }
      Vue.set(state.workoutToCreate.exercises, payload.index, data)
    } else {
      const data = {
        ...state.workouts[index].exercises[payload.index],
        ...payload.value
      }
      Vue.set(state.workouts[index].exercises, payload.index, data)
    }
  },
  setTime: (state, payload) => {
    const index = state.workouts.findIndex(workout => workout.id === payload.id)
    let item
    if (payload.id === 'new') {
      item = state.workoutToCreate.exercises[payload.index]
    } else {
      item = state.workouts[index].exercises[payload.index]
    }
    let time = item.pause + item.hold
    if (item.repeat > 0) {
      // 13 = 5 + ((3 + 5) x 1)
      // 40 = 10 + ((10 + 10) x (1 + 1) - 10)
      time =
        item.pause + ((item.hold + item.rest) * (item.repeat + 1) - item.rest)
    }
    if (payload.id === 'new') {
      Vue.set(state.workoutToCreate.exercises[payload.index], 'time', time)
    } else {
      Vue.set(state.workouts[index].exercises[payload.index], 'time', time)
    }
  },
  setTotalTime: (state, workoutId) => {
    const index = state.workouts.findIndex(workout => workout.id === workoutId)
    let item
    if (workoutId === 'new') {
      item = state.workoutToCreate.exercises
    } else {
      item = state.workouts[index].exercises
    }
    // eslint-disable-next-line no-shadow
    const time = item.reduce((sum, { time }) => sum + time, 0)
    if (workoutId === 'new') {
      state.workoutToCreate.time = time
    } else {
      state.workouts[index].time = time
    }
  },
  addExerciseToCreate(state, exercise) {
    // mutate state
    state.workoutToCreate.exercises.push(exercise)
  },
  /* Exercise inputs */
  setExerciseToCreate: (state, exerciseFieldToCreate) =>
    // state.exerciseToCreate[exerciseFieldToCreate] = exerciseFieldContentToCreate
    (state.exerciseToCreate = {
      ...state.exerciseToCreate,
      ...exerciseFieldToCreate
    }),
  /* Exercises */
  removeExerciseByIndex: (state, payload) => {
    const index = state.workouts.findIndex(
      workout => workout.id === payload.workout.id
    )
    if (index >= 0) {
      state.workouts[index].exercises.splice(payload.index, 1)
    } else {
      state.workoutToCreate.exercises.splice(payload.index, 1)
    }
  },

  /* Community */
  setCommunityWorkouts: (state, communityWorkouts) =>
    (state.communityWorkouts = communityWorkouts.reverse()),

  shareWorkout: (state, workoutId) => {
    let index = state.workouts.findIndex(workout => workout.id === workoutId)
    state.workouts[index].share = !state.workouts[index].share
    if (state.workouts[index].share)
      state.communityWorkouts.unshift(state.workouts[index])
    else {
      index = state.communityWorkouts.findIndex(
        workout => workout.id === workoutId
      )
      state.communityWorkouts.splice(index, 1)
    }
  },
  addSubscriber: (state, payload) => {
    const index = state.communityWorkouts.findIndex(
      workout => workout.id === payload.id
    )
    const { subscribers } = state.communityWorkouts[index]
    subscribers.unshift(payload.user)
  },
  removeSubscriber: (state, payload) => {
    const index = state.communityWorkouts.findIndex(
      workout => workout.id === payload.id
    )
    const { subscribers } = state.communityWorkouts[index]
    const userIndex = subscribers.indexOf(payload.user)
    subscribers.splice(userIndex, 1)
  }
}
