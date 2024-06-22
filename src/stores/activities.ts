import { defineStore, storeToRefs } from 'pinia'
import { ref, Ref } from 'vue'
import UserActivitiesDB from '@/plugins/firebase/user-activities-db'
import { useAuthenticationStore } from '@/stores/authentication'
import { Activity } from '@/interfaces/activities.interface'

export const useActivitiesStore = defineStore('activities', () => {
  const activities: Ref<Activity[]> = ref([])
  const { user } = storeToRefs(useAuthenticationStore())
  let activitiesDB: UserActivitiesDB | null = null

  if (user.value) {
    activitiesDB = new UserActivitiesDB(user.value?.id)
  }
  // action
  /**
   * Fetch user activity
   * @return Array
   */
  async function fetchUserActivity() {
    if (activities.value.length) return
    if (activitiesDB) {
      activities.value = await activitiesDB.readAll(null, 'createTimestamp', 'desc', 20)
    }
  }
  /**
   * Add a new workout for the user
   * @param workout
   * @return {Promise<void>}
   */
  async function createUserActivity(activity: Activity) {
    if (activitiesDB) {
      const createdActivity = await activitiesDB.create(activity)
      // push to beginning of  workouts
      activities.value.unshift(createdActivity)
    }
  }

  return {
    activities,
    createUserActivity,
    fetchUserActivity
  }
})
