import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'
import { loadLanguageAsync } from '@/plugins/i18n'
import router from '@/router'
import { User as FirebaseUser } from 'firebase/auth'
import { User, UserSettings } from '@/interfaces/authentication.interface'

export const useAuthentication = defineStore('authentication', () => {
  const user: Ref<User | null> = ref(null)
  const error: Ref<string | null> = ref(null)

  /**
   * Create new user from firebase auth user infos
   */
  async function createNewUserFromFirebaseAuthUser(firebaseAuthUser: FirebaseUser) {
    let providerData = firebaseAuthUser.providerData[0]
    if (firebaseAuthUser.isAnonymous) {
      // eslint-disable-next-line prefer-destructuring
      providerData = firebaseAuthUser
    }
    const { displayName, photoURL, email } = providerData
    const { default: UsersDB } = await import('@/plugins/firebase/users-db')
    const userDb = new UsersDB()
    // default user settings
    const settings: UserSettings = {
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
  async function login(firebaseAuthUser: FirebaseUser): Promise<void> {
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
        loadLanguageAsync(user.value.settings.locale)
      }

      if (user.value?.id) {
        
        workouts.fetchUserWorkouts()
        workouts.fetchCommunityWorkouts()
        activities.fetchUserActivity()
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = e.message
        if ((e as any).code?.toString() === 'resource-exhausted') {
          error.value = 'Unfortunately our daily usage limit exceeded. Check back with us tomorrow.'
        }
        // eslint-disable-next-line no-console
        console.error(e)
      } else {
        error.value = 'An unknown error occurred'
        // eslint-disable-next-line no-console
        console.error('An unknown error occurred', e)
      }
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
    const { default: UsersWorkoutsDB } = await import('@/plugins/firebase/users-workouts-db')
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
