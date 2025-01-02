import { defineStore, storeToRefs } from 'pinia'
import { ref, Ref } from 'vue'
import UserActivitiesDB from '@/plugins/firebase/user-activities-db'
import { useAuthenticationStore } from '@/stores/authentication'
import { IActivity } from '@/interfaces/activity.interface'
import { Activity } from '@/models/activity.model'
import { IWorkout } from '@/interfaces/workout.interface'

export const useActivitiesStore = defineStore('activities', () => {
  const activities: Ref<IActivity[]> = ref([])
  const { user } = storeToRefs(useAuthenticationStore())
  let activitiesDB: UserActivitiesDB | null = null

  if (user.value?.id) {
    activitiesDB = new UserActivitiesDB(user.value.id)
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
   * @param activity IActivity
   * @return {Promise<void>}
   */
  async function createUserActivity(
    timeTotal: number,
    timeHanging: number,
    workout: IWorkout
  ): Promise<void> {
    if (activitiesDB) {
      const activity = new Activity(timeTotal, timeHanging, workout)
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
