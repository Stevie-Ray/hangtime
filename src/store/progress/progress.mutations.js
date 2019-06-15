export default {
  /* Progress */
  setProgress: (state, progress) => (state.progress = progress),
  addProgress: (state, progress) => state.progress.push(progress),
  addRecording: (state, payload) => {
    const index = state.progress.findIndex(
      progress => progress.id === payload.id
    )
    state.progress[index].recordings.push(payload.data)
  }
}
