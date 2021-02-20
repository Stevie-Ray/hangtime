import Vue from 'vue'

export default {
  setUser: (state, value) => (state.user = value),
  setUserWeight: (state, value) => (state.user.weight = value),
  setUserStatus: (state, value) => (state.user.status = value),
  setUserGender: (state, value) => (state.user.gender = value),
  setUserCountry: (state, value) => (state.user.country = value),
  setCompleted: (state) => {
    if (!state.user.completed) {
      state.user.completed = {}
    }
  },
  setCompletedTime: (state, value) => {
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(state.user.completed.time)) {
      state.user.completed.time += value
    } else {
      state.user.completed.time = value
    }
  },
  setCompletedHold: (state, value) => {
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(state.user.completed.hold)) {
      state.user.completed.hold += value
    } else {
      state.user.completed.hold = value
    }
  },
  setCompletedAmount: (state) => {
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(state.user.completed.amount)) {
      state.user.completed.amount += 1
    } else {
      state.user.completed.amount = 1
    }
  },
  setGrade: (state, value) => (state.user.settings.grade = value),
  setScale: (state, value) => (state.user.settings.scale = value),
  setSubscription: (state, value) => (state.user.subscribed = value),
  setLocale: (state, value) => (state.user.settings.locale = value),
  setSound: (state, value) => (state.user.settings.sound = value),
  setSpeak: (state, value) => (state.user.settings.speak = value),
  setVibrate: (state, value) => (state.user.settings.vibrate = value),
  setTheme: (state, value) => (state.user.settings.theme = value),
  setScheme: (state, value) => (state.user.settings.scheme = value),
  setWeight: (state, value) => Vue.set(state.user.settings, 'weight', value),
  setWalkthrough: (state, value) => (state.user.settings.walkthrough = value),
  setVoice: (state, value) => (state.user.settings.voice = value),
  setUserNotificationToken: (state, value) =>
    (state.user.settings.token = value),
  setSelected: (state, value) => (state.user.settings.selected = value),
  setCompany: (state, value) => (state.hangboardToAdd.company = value),
  setHangboard: (state, value) => (state.hangboardToAdd.hangboard = value),
  addHangboard: (state, value) => state.user.settings.hangboards.push(value),
  resetHangboard: (state) => (state.hangboardToAdd.hangboard = 0),
  removeHangboard: (state, index) =>
    state.user.settings.hangboards.splice(index, 1)
}
