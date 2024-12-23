import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'
import { loadLanguageAsync } from '@/plugins/i18n'
import router from '@/router'
import { User as FirebaseUser } from 'firebase/auth'
import { User, UserSettings } from '@/interfaces/authentication.interface'
import { FirebaseError } from 'firebase/app'

export const useAuthenticationStore = defineStore('authentication', () => {
  const user: Ref<User | null | undefined> = ref(undefined)
  const error: Ref<string | null> = ref(null)

  /**
   * Create new user from firebase auth user infos
   */
  async function createNewUserFromFirebaseAuthUser(firebaseAuthUser: FirebaseUser): Promise<User> {
    let providerData = firebaseAuthUser.providerData[0]
    if (firebaseAuthUser.isAnonymous) {
      providerData = firebaseAuthUser
    }
    const { displayName, photoURL, email } = providerData
    const { default: UsersDB } = await import('@/plugins/firebase/users-db')
    const usersDb = new UsersDB()
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

    const user = {
      displayName,
      photoURL,
      email,
      settings
    }

    return usersDb.create(user as User, firebaseAuthUser.uid)
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

      const { useWorkoutsStore } = await import('@/stores/workouts')
      const workouts = useWorkoutsStore()
      const { useActivitiesStore } = await import('@/stores/activities')
      const activities = useActivitiesStore()

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
        if ((e as FirebaseError).code?.toString() === 'resource-exhausted') {
          error.value = 'Unfortunately our daily usage limit exceeded. Check back with us tomorrow.'
        }

        console.error(e)
      } else {
        error.value = 'An unknown error occurred'

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
    const { default: UsersDB } = await import('@/plugins/firebase/users-db')
    const usersDb = new UsersDB()
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
