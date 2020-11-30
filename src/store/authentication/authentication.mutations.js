export default {
  setUser: (state, value) => (state.user = value),
  setStatus: (state, value) => (state.user.status = value),
  setGrade: (state, value) => (state.user.settings.grade = value),
  setScale: (state, value) => (state.user.settings.scale = value),
  setLocale: (state, value) => (state.user.settings.locale = value),
  setSound: (state, value) => (state.user.settings.sound = value),
  setSpeak: (state, value) => (state.user.settings.speak = value),
  setVibrate: (state, value) => (state.user.settings.vibrate = value),
  setTheme: (state, value) => (state.user.settings.theme = value),
  setScheme: (state, value) => (state.user.settings.scheme = value),
  setWeight: (state, value) => (state.user.settings.weight = value),
  setWalkthrough: (state, value) => (state.user.settings.walkthrough = value),
  setVoice: (state, value) => (state.user.settings.voice = value),
  setSelected: (state, value) => (state.user.settings.selected = value),
  setCompany: (state, value) => (state.hangboardToAdd.company = value),
  setHangboard: (state, value) => (state.hangboardToAdd.hangboard = value),
  addHangboard: (state, value) => state.user.settings.hangboards.push(value),
  resetHangboard: state => (state.hangboardToAdd.hangboard = 0),
  removeHangboard: (state, index) =>
    state.user.settings.hangboards.splice(index, 1)
}
