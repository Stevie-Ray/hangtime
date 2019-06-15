import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'

import authentication from './authentication'
import app from './app'
import companies from './companies'
import exercises from './exercises'
import progress from './progress'
import workouts from './workouts'

Vue.use(Vuex)

/* If you don't know about Vuex, please refer to https://vuex.vuejs.org/ */

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    authentication,
    app,
    companies,
    progress,
    exercises,
    workouts
  }
  // plugins: [createPersistedState()]
})
