import { defineStore } from 'pinia'
import { ref } from 'vue'
import i18n from '@/plugins/i18n'
import router from '@/router'

export const useAuthentication = defineStore('authentication', () => {
  const user = ref(undefined)
  const error = ref(undefined)

  // action
  /**
   * Create new user from firebase auth user infos
   */
  async function createNewUserFromFirebaseAuthUser(firebaseAuthUser) {
    let providerData = firebaseAuthUser.providerData[0]
    if (firebaseAuthUser.isAnonymous) {
      // eslint-disable-next-line prefer-destructuring
      providerData = firebaseAuthUser
    }
    const { displayName, photoURL, email } = providerData
    const { default: UsersDB } = await import('@/plugins/firebase/users-db')
    const userDb = new UsersDB()
    // default user settings
    const settings = {
      selected: 0,
      hangboards: [
        {
          company: 1,
          hangboard: 0
        }
      ],
      scale: 'font',
      grade: 12,
      sound: true,
      speak: false,
      voice: 0,
      vibrate: false,
      walkthrough: false
    }
    // eslint-disable-next-line
    const user = {
      displayName,
      photoURL,
      email,
      settings
    }

    return userDb.create(user, firebaseAuthUser.uid)
  }
  /**
   * Callback fired when user login
   * @param firebaseUser
   * @return {Promise<void>}
   */
  async function login(firebaseAuthUser) {
    try {
      const { default: UsersDB } = await import('@/plugins/firebase/users-db')
      const userFromFirebase = await new UsersDB().read(firebaseAuthUser.uid)

      user.value =
        userFromFirebase === null || userFromFirebase === undefined
          ? await createNewUserFromFirebaseAuthUser(firebaseAuthUser)
          : userFromFirebase

      const { useWorkouts } = await import('@/stores/workouts')
      const workouts = useWorkouts()
      const { useActivities } = await import('@/stores/activities')
      const activities = useActivities()

      if (user.value?.settings?.locale) {
        i18n.global.locale.value = user.value.settings.locale
      }

      if (user.value?.id) {
        workouts.fetchUserWorkouts()
        workouts.fetchCommunityWorkouts()
        activities.fetchUserActivity()
      }
    } catch (e) {
      error.value = e.toString()
      if (e.code?.toString() === 'resource-exhausted') {
        error.value =
          'Unfortunately our daily usage limit exceeded. Check back with us tomorrow.'
      }
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }

  /**
   * Callback fired when user logout
   */
  function logout() {
    // you can directly mutate the state
    user.value = null
    const currentRouter = router.currentRoute
    if (!(currentRouter.value.meta && currentRouter.value.meta.public)) {
      router.push('/login')
    }
  }

  /**
   * Update the current user
   * @return {Promise<void>}
   */
  async function updateUser() {
    if (!user.value) return
    const { default: UsersWorkoutsDB } = await import(
      '@/plugins/firebase/users-workouts-db'
    )
    const usersDb = new UsersWorkoutsDB()
    await usersDb.update(user.value)
  }

  return {
    user,
    error,
    login,
    logout,
    updateUser
  }
})
