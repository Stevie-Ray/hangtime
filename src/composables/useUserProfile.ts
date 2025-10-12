import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { User } from '@/models/user.model'

/**
 * Composable for handling user profile data fetching
 * @description Provides reactive state and methods for fetching user data by ID
 */
export function useUserProfile() {
  const route = useRoute()
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Get the user ID from the route parameters
   */
  const userId = computed(() => {
    return route.params.userId as string | undefined
  })

  /**
   * Fetch user data by ID
   * @param id - The user ID to fetch
   */
  async function fetchUserById(id: string): Promise<void> {
    if (!id) {
      error.value = 'User ID is required'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const { default: UsersDB } = await import('@/plugins/firebase/users-db')
      const usersDb = new UsersDB()
      const userData = await usersDb.read(id)

      if (userData) {
        user.value = new User(userData)
      } else {
        error.value = 'User not found'
        user.value = null
      }
    } catch (err) {
      console.error('Error fetching user:', err)
      error.value = err instanceof Error ? err.message : 'Failed to fetch user data'
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch user data using the ID from the current route
   */
  async function fetchCurrentUser(): Promise<void> {
    if (userId.value) {
      await fetchUserById(userId.value)
    } else {
      error.value = 'No user ID found in route'
    }
  }

  /**
   * Reset the user profile state
   */
  function resetUserProfile(): void {
    user.value = null
    error.value = null
    isLoading.value = false
  }

  return {
    user: computed(() => user.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    userId,
    fetchUserById,
    fetchCurrentUser,
    resetUserProfile
  }
}
