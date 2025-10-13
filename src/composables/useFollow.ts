import { ref, computed } from 'vue'
import {
  getFirestore,
  doc,
  arrayUnion,
  arrayRemove,
  writeBatch,
  increment,
  getDoc
} from 'firebase/firestore/lite'
import { useAuthenticationStore } from '@/stores/authentication.store'
import { User } from '@/models/user.model'
import firebaseApp from '@/plugins/firebase'

const db = getFirestore(firebaseApp)

/**
 * Composable for handling user follow/unfollow functionality
 * @description Provides reactive state and methods for following/unfollowing users
 */
export function useFollow() {
  const authStore = useAuthenticationStore()
  const { user: currentUser } = authStore
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // New state for following/followers data
  const followingUsers = ref<User[]>([])
  const followersUsers = ref<User[]>([])
  const isLoadingUsers = ref(false)

  /**
   * Follow a user
   * @param targetUserId - The ID of the user to follow
   */
  async function followUser(targetUserId: string): Promise<void> {
    if (!currentUser?.id) {
      error.value = 'User not authenticated'
      return
    }

    if (currentUser.id === targetUserId) {
      error.value = 'Cannot follow yourself'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const batch = writeBatch(db)

      // Get references to both user documents
      const currentUserRef = doc(db, 'users', currentUser.id)
      const targetUserRef = doc(db, 'users', targetUserId)

      // Add target user to current user's following array
      batch.update(currentUserRef, {
        following: arrayUnion(targetUserId),
        followingCount: increment(1) // Increment count
      })

      // Add current user to target user's followers array
      batch.update(targetUserRef, {
        followers: arrayUnion(currentUser.id),
        followersCount: increment(1) // Increment count
      })

      // Commit the batch
      await batch.commit()
    } catch (err) {
      console.error('Error following user:', err)
      error.value = err instanceof Error ? err.message : 'Failed to follow user'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Unfollow a user
   * @param targetUserId - The ID of the user to unfollow
   */
  async function unfollowUser(targetUserId: string): Promise<void> {
    if (!currentUser?.id) {
      error.value = 'User not authenticated'
      return
    }

    if (currentUser.id === targetUserId) {
      error.value = 'Cannot unfollow yourself'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const batch = writeBatch(db)

      // Get references to both user documents
      const currentUserRef = doc(db, 'users', currentUser.id)
      const targetUserRef = doc(db, 'users', targetUserId)

      // Remove target user from current user's following array
      batch.update(currentUserRef, {
        following: arrayRemove(targetUserId),
        followingCount: increment(-1) // Decrement count
      })

      // Remove current user from target user's followers array
      batch.update(targetUserRef, {
        followers: arrayRemove(currentUser.id),
        followersCount: increment(-1) // Decrement count
      })

      // Commit the batch
      await batch.commit()
    } catch (err) {
      console.error('Error unfollowing user:', err)
      error.value = err instanceof Error ? err.message : 'Failed to unfollow user'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Check if the current user is following a target user
   * @param targetUserId - The ID of the user to check
   * @returns Boolean indicating if the user is being followed
   */
  function isFollowing(targetUserId: string): boolean {
    if (!currentUser?.following) return false
    return currentUser.following.includes(targetUserId)
  }

  /**
   * Toggle follow status for a user
   * @param targetUserId - The ID of the user to toggle follow status for
   */
  async function toggleFollow(targetUserId: string): Promise<void> {
    if (isFollowing(targetUserId)) {
      await unfollowUser(targetUserId)
    } else {
      await followUser(targetUserId)
    }
  }

  /**
   * Fetch user details for a list of user IDs
   * @param userIds - Array of user IDs to fetch
   * @returns Array of User objects
   */
  async function fetchUsersByIds(userIds: string[]): Promise<User[]> {
    if (!userIds.length) return []

    const users: User[] = []

    try {
      // Fetch users in batches to avoid Firestore query limits
      const batchSize = 10
      for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize)

        // Use individual document reads for better performance with small batches
        const userPromises = batch.map(async (userId) => {
          const userDoc = doc(db, 'users', userId)
          const userSnap = await getDoc(userDoc)

          if (userSnap.exists()) {
            const userData = userSnap.data()
            return new User({ ...userData, id: userId })
          }
          return null
        })

        const batchUsers = await Promise.all(userPromises)
        users.push(...(batchUsers.filter(Boolean) as User[]))
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      throw err
    }

    return users
  }

  /**
   * Fetch following users for a given user
   * @param userId - The user ID to fetch following for
   */
  async function fetchFollowingUsers(userId: string): Promise<void> {
    if (!userId) return

    isLoadingUsers.value = true

    try {
      const userDoc = doc(db, 'users', userId)
      const userSnap = await getDoc(userDoc)

      if (userSnap.exists()) {
        const userData = userSnap.data()
        const followingIds = userData.following || []

        if (followingIds.length > 0) {
          followingUsers.value = await fetchUsersByIds(followingIds)
        } else {
          followingUsers.value = []
        }
      }
    } catch (err) {
      console.error('Error fetching following users:', err)
    } finally {
      isLoadingUsers.value = false
    }
  }

  /**
   * Fetch followers for a given user
   * @param userId - The user ID to fetch followers for
   */
  async function fetchFollowersUsers(userId: string): Promise<void> {
    if (!userId) return

    isLoadingUsers.value = true

    try {
      const userDoc = doc(db, 'users', userId)
      const userSnap = await getDoc(userDoc)

      if (userSnap.exists()) {
        const userData = userSnap.data()
        const followersIds = userData.followers || []

        if (followersIds.length > 0) {
          followersUsers.value = await fetchUsersByIds(followersIds)
        } else {
          followersUsers.value = []
        }
      }
    } catch (err) {
      console.error('Error fetching followers users:', err)
    } finally {
      isLoadingUsers.value = false
    }
  }

  /**
   * Fetch both following and followers for a user
   * @param userId - The user ID to fetch data for
   */
  async function fetchFollowData(userId: string): Promise<void> {
    if (!userId) return

    isLoadingUsers.value = true

    try {
      await Promise.all([fetchFollowingUsers(userId), fetchFollowersUsers(userId)])
    } catch (err) {
      console.error('Error fetching follow data:', err)
    } finally {
      isLoadingUsers.value = false
    }
  }

  return {
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    followingUsers: computed(() => followingUsers.value),
    followersUsers: computed(() => followersUsers.value),
    isLoadingUsers: computed(() => isLoadingUsers.value),
    followUser,
    unfollowUser,
    isFollowing,
    toggleFollow,
    fetchFollowingUsers,
    fetchFollowersUsers,
    fetchFollowData
  }
}
