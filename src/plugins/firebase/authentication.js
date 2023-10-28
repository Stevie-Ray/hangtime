import {
  onAuthStateChanged,
  getAuth
  // browserPopupRedirectResolver
} from 'firebase/auth'

// eslint-disable-next-line import/no-named-default
// import { default as app } from '@/plugins/firebase'

import { useAuthentication } from '@/stores/authentication'

const { login, logout } = useAuthentication()
const auth = getAuth()

// // https://github.com/firebase/firebase-js-sdk/issues/4946
// if (navigator.userAgent.indexOf('Chrome') > -1) {
//   Object.defineProperty(
//     browserPopupRedirectResolver.prototype,
//     '_shouldInitProactively',
//     {
//       get() {
//         return false
//       }
//     }
//   )
// }

onAuthStateChanged(
  auth,
  (user) => {
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
