import { onAuthStateChanged, getAuth, browserPopupRedirectResolver } from 'firebase/auth'
// import { default as app } from '@/plugins/firebase'

import { useAuthenticationStore } from '@/stores/authentication'
import { User as FirebaseUser } from 'firebase/auth'

const { login, logout } = useAuthenticationStore()
const auth = getAuth()

// https://github.com/firebase/firebase-js-sdk/issues/4946
// https://github.com/GoogleChrome/lighthouse/blob/main/core/config/constants.js#L83
if (navigator.userAgent.indexOf('moto g power') > -1) {
  Object.defineProperty(browserPopupRedirectResolver, '_shouldInitProactively', {
    get() {
      return false
    }
  })
}

onAuthStateChanged(
  auth,
  (user: FirebaseUser | null) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      login(user)
    } else {
      // User is signed out
      logout()
    }
  },
  (error) => {
    // eslint-disable-next-line no-console
    console.log(error)
  }
)
