export default {
  setUser: (state, value) => (state.user = value),
  setStatus: (state, value) => (state.user.status = value),
  setSound: (state, value) => (state.user.settings.sound = value),
  setSpeak: (state, value) => (state.user.settings.speak = value),
  setVibrate: (state, value) => (state.user.settings.vibrate = value),
  setVoice: (state, value) => (state.user.settings.voice = value),
  setSelected: (state, value) => (state.user.settings.selected = value),
  setCompany: (state, value) => (state.hangboardToAdd.company = value),
  setHangboard: (state, value) => (state.hangboardToAdd.hangboard = value),
  addHangboard: (state, value) => state.user.settings.hangboards.push(value),
  resetHangboard: state => (state.hangboardToAdd.hangboard = 0)
}
