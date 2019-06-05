export default {
  /* Exercise inputs */
  setExerciseToCreate: (state, exerciseFieldToCreate) =>
    // state.exerciseToCreate[exerciseFieldToCreate] = exerciseFieldContentToCreate
    (state.exerciseToCreate = {
      ...state.exerciseToCreate,
      ...exerciseFieldToCreate
    }),
  /* Exercises */
  setExercises: (state, exercises) => (state.exercises = exercises),
  setExercise: (state, payload) => {
    const index = state.exercises.findIndex(
      exercise => exercise.id === payload.id
    )
    state.exercises[index].exercise = payload.value
  },
  setPause: (state, payload) => {
    const index = state.exercises.findIndex(
      exercise => exercise.id === payload.id
    )
    state.exercises[index].pause = payload.value
  },
  setHold: (state, payload) => {
    const index = state.exercises.findIndex(
      exercise => exercise.id === payload.id
    )
    state.exercises[index].hold = payload.value
  },
  setPullups: (state, payload) => {
    const index = state.exercises.findIndex(
      exercise => exercise.id === payload.id
    )
    state.exercises[index].pullups = payload.value
  },
  setRepeat: (state, payload) => {
    const index = state.exercises.findIndex(
      exercise => exercise.id === payload.id
    )
    state.exercises[index].repeat = payload.value
  },
  setRest: (state, payload) => {
    const index = state.exercises.findIndex(
      exercise => exercise.id === payload.id
    )
    state.exercises[index].rest = payload.value
  },
  setOrder: (state, payload) => {
    state.exercises[payload.index] = payload.exercise
    state.exercises[payload.index].order = payload.index
  },
  addExercise: (state, exercise) => state.exercises.push(exercise),
  removeExerciseById: (state, exerciseId) => {
    const index = state.exercises.findIndex(
      exercise => exercise.id === exerciseId
    )
    state.exercises.splice(index, 1)
  },

  /* Exercises deletion */
  addExerciseDeletionPending: (state, exerciseId) =>
    state.exerciseDeletionPending.push(exerciseId),
  removeExerciseDeletionPending: (state, exerciseId) => {
    const index = state.exercises.findIndex(
      exercise => exercise.id === exerciseId
    )
    state.exerciseDeletionPending.splice(index, 1)
  },
  /* Exercise creation */
  setExerciseCreationPending: (state, value) =>
    (state.exerciseCreationPending = value)
}
