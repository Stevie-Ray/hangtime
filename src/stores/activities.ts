import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import UserActivitiesDB from '@/plugins/firebase/user-activities-db'
import { useAuthentication } from '@/stores/authentication'

export const useActivities = defineStore('activities', () => {
  const activities = ref([])
  // action
  /**
   * Fetch user activity
   * @return Array
   */
  async function fetchUserActivity() {
    if (activities.value.length) return
    const { user } = storeToRefs(useAuthentication())
    const userActivitiesDb = new UserActivitiesDB(user.value.id)
    activities.value = await userActivitiesDb.readAll(null, 'createTimestamp', 20)
  }
  /**
   * Add a new workout for the user
   * @param workout
   * @return {Promise<void>}
   */
  async function createUserActivity(activity) {
    const { user } = storeToRefs(useAuthentication())
    const userActivitiesDb = new UserActivitiesDB(user.value.id)

    const createdActivity = await userActivitiesDb.create(activity)

    // push to beginning of  workouts
    activities.value.unshift(createdActivity)
  }

  return {
    activities,
    createUserActivity,
    fetchUserActivity
  }
})