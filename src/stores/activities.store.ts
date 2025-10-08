import { defineStore, storeToRefs } from 'pinia'
import { ref, computed, type Ref } from 'vue'
import UserActivitiesDB from '@/plugins/firebase/user-activities-db'
import { useAuthenticationStore } from '@/stores/authentication.store'
import type { IActivity } from '@/interfaces/activity.interface'
import { Activity } from '@/models/activity.model'
import type { IWorkout } from '@/interfaces/workout.interface'

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

  /**
   * Calculate the current week streak based on activities
   * @return {number} The current week streak count
   */
  const weekStreak = computed((): number => {
    if (!activities.value.length) return 0

    // Sort activities by date (most recent first)
    const sortedActivities = [...activities.value].sort(
      (a, b) => new Date(b.start_date_local).getTime() - new Date(a.start_date_local).getTime()
    )

    let streak = 0
    const today = new Date()
    const currentWeekStart = getWeekStart(today)

    // Check if there's an activity this week
    const hasActivityThisWeek = sortedActivities.some((activity) => {
      const activityDate = new Date(activity.start_date_local)
      return activityDate >= currentWeekStart
    })

    if (!hasActivityThisWeek) return 0

    streak = 1 // Count current week

    // Check previous weeks
    let checkDate = new Date(currentWeekStart)
    checkDate.setDate(checkDate.getDate() - 7) // Go back one week

    const lastActivity = sortedActivities[sortedActivities.length - 1]
    const lastActivityDate = lastActivity ? new Date(lastActivity.start_date_local) : new Date()

    while (checkDate >= lastActivityDate) {
      const weekStart = getWeekStart(checkDate)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)

      const hasActivityInWeek = sortedActivities.some((activity) => {
        const activityDate = new Date(activity.start_date_local)
        return activityDate >= weekStart && activityDate <= weekEnd
      })

      if (hasActivityInWeek) {
        streak++
        checkDate = new Date(checkDate.getTime() - 7 * 24 * 60 * 60 * 1000) // Go back another week
      } else {
        break
      }
    }

    return streak
  })

  /**
   * Get the start of the week (Monday) for a given date
   * @param date The date to get the week start for
   * @return {Date} The start of the week
   */
  function getWeekStart(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    return new Date(d.setDate(diff))
  }

  return {
    activities,
    createUserActivity,
    fetchUserActivity,
    weekStreak
  }
})
