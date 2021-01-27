export default {
  /* Progress */
  setProgress: (state, progress) => (state.progress = progress),
  addProgress: (state, progress) => state.progress.push(progress),
  addRecording: (state, payload) => {
    const index = state.progress.findIndex(
      (progress) => progress.id === payload.id
    )
    state.progress[index].recordings.push(payload.data)
  },
  removeRecordingByIndex: (state, payload) => {
    const progressIndex = state.progress.findIndex(
      (element) => element.id === payload.id
    )
    const index = state.progress[progressIndex].recordings.findIndex(
      (recording) => recording.createTimestamp === payload.item.createTimestamp
    )
    state.progress[progressIndex].recordings.splice(index, 1)
  }
}
