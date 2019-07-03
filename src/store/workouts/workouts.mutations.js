export default {
  /* Workout inputs */
  setWorkoutToCreate: (state, workoutFieldToCreate) =>
    // state.workoutToCreate[workoutFieldToCreate] = workoutFieldContentToCreate
    (state.workoutToCreate = {
      ...state.workoutToCreate,
      ...workoutFieldToCreate
    }),
  /* Workouts */
  setWorkouts: (state, workouts) => (state.workouts = workouts),
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
  setWorkoutDifficulty: (state, payload) => {
    const index = state.workouts.findIndex(
      exercise => exercise.id === payload.id
    )
    state.workouts[index].level = payload.value
  },
  addWorkout: (state, workout) => state.workouts.push(workout),
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
    state.workouts[index].exercises = payload.data
  },
  /* Workout creation */
  setWorkoutCreationPending: (state, value) =>
    (state.workoutCreationPending = value),

  addExercise: (state, payload) => {
    const index = state.workouts.findIndex(workout => workout.id === payload.id)
    state.workouts[index].exercises.push(payload.data)
  },

  setExercise: (state, payload) => {
    const index = state.workouts.findIndex(workout => workout.id === payload.id)
    state.workouts[index].exercises[payload.index].exercise = payload.value
  },
  setPause: (state, payload) => {
    const index = state.workouts.findIndex(workout => workout.id === payload.id)
    state.workouts[index].exercises[payload.index].pause = payload.value
  },
  setHold: (state, payload) => {
    const index = state.workouts.findIndex(workout => workout.id === payload.id)
    state.workouts[index].exercises[payload.index].hold = payload.value
  },
  setPullups: (state, payload) => {
    const index = state.workouts.findIndex(workout => workout.id === payload.id)
    state.workouts[index].exercises[payload.index].pullups = payload.value
  },
  setRepeat: (state, payload) => {
    const index = state.workouts.findIndex(workout => workout.id === payload.id)
    state.workouts[index].exercises[payload.index].repeat = payload.value
  },
  setRightHold: (state, payload) => {
    const index = state.workouts.findIndex(workout => workout.id === payload.id)
    state.workouts[index].exercises[payload.index].right = payload.value
  },
  setLeftHold: (state, payload) => {
    const index = state.workouts.findIndex(workout => workout.id === payload.id)
    state.workouts[index].exercises[payload.index].left = payload.value
  },
  setRest: (state, payload) => {
    const index = state.workouts.findIndex(workout => workout.id === payload.id)
    state.workouts[index].exercises[payload.index].rest = payload.value
  },
  setTime: (state, payload) => {
    const index = state.workouts.findIndex(workout => workout.id === payload.id)
    const item = state.workouts[index].exercises[payload.index]
    let time = item.pause + item.hold
    if (item.repeat > 1) {
      time = item.pause + (item.hold + item.rest) * item.repeat
    }
    state.workouts[index].exercises[payload.index].time = time
  },
  setTotalTime: (state, workoutId) => {
    const index = state.workouts.findIndex(workout => workout.id === workoutId)
    const item = state.workouts[index].exercises
    const time = item.reduce((sum, { time }) => sum + time, 0)
    state.workouts[index].time = time
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
    state.workouts[index].exercises.splice(payload.index, 1)
  },

  /* Community */
  setCommunityWorkouts: (state, communityWorkouts) =>
    (state.communityWorkouts = communityWorkouts),

  shareWorkout: (state, workoutId) => {
    const index = state.workouts.findIndex(workout => workout.id === workoutId)
    state.workouts[index].share = !state.workouts[index].share
  }
}
