import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'
import { loadLanguageAsync } from '@/plugins/i18n'
import type { User as FirebaseUser } from 'firebase/auth'
import type { FirebaseError } from 'firebase/app'
import { User } from '@/models/user.model'

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
    const { displayName, photoURL, email } = providerData || {}
    const { default: UsersDB } = await import('@/plugins/firebase/users-db')
    const usersDb = new UsersDB()

    const user = new User({
      displayName: displayName || undefined,
      photoURL: photoURL || undefined,
      email: email || undefined
    })
    // remove id if it is not set
    if (user.id === undefined || user.id === null) {
      delete user.id
    }

    return usersDb.create(user, firebaseAuthUser.uid)
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

      user.value = new User(
        userFromFirebase === null || userFromFirebase === undefined
          ? await createNewUserFromFirebaseAuthUser(firebaseAuthUser)
          : userFromFirebase
      )

      const { useWorkoutsStore } = await import('@/stores/workouts.store')
      const workouts = useWorkoutsStore()
      const { useActivitiesStore } = await import('@/stores/activities.store')
      const activities = useActivitiesStore()

      if (user.value?.settings?.locale) {
        loadLanguageAsync(user.value.settings.locale)
      }

      if (user.value?.id) {
        workouts.fetchSubscribedWorkouts()
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
    if (!user.value?.id) return
    const { default: UsersDB } = await import('@/plugins/firebase/users-db')
    const usersDb = new UsersDB()
    await usersDb.update(user.value as User & { id: string })
  }

  return {
    user,
    error,
    login,
    logout,
    updateUser
  }
})
