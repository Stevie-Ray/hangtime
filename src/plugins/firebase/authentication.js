import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useAuthentication } from '@/stores/authentication'

const { login, logout } = useAuthentication()
const auth = getAuth()

onAuthStateChanged(
  auth,
  (user) => {
    console.log(user)
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
    console.log(error)
  }
)
