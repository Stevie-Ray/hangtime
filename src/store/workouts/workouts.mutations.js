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

  /* Workout creation */
  setWorkoutCreationPending: (state, value) =>
    (state.workoutCreationPending = value)
}
