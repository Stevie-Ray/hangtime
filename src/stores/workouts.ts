import { ref, computed, reactive } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { WhereFilterOp } from 'firebase/firestore/lite'
import { useAuthenticationStore } from '@/stores/authentication'
import { useUserStore } from '@/stores/user'
import i18n from '@/plugins/i18n'
import UsersWorkoutsDB from '@/plugins/firebase/users-workouts-db'
import UserWorkoutsDB from '@/plugins/firebase/user-workouts-db'
import UsersDB from '@/plugins/firebase/users-db'
import { Leaderboard, Workout } from '@/interfaces/workouts.interface'

export const useWorkoutsStore = defineStore('workouts', () => {
  const workouts = ref<Workout[]>([])
  const workoutsCommunity = ref<Workout[]>([])
  const workoutsCommunityFilter = ref<{ filter: string; value: string }>({
    filter: 'Last Modified',
    value: 'updateTimestamp'
  })
  const leaderboards = ref<Leaderboard[]>([])

  // Actions
  /**
   * Fetch user workouts
   * @return Array
   */
  async function fetchUserWorkouts() {
    const authentication = useAuthenticationStore()
    const usersWorkoutsDb = new UsersWorkoutsDB()
    const lastVisible = workouts.value.length > 0 ? workouts.value[workouts.value.length - 1] : null
    const newWorkouts = await usersWorkoutsDb.readAll(
      [['subscribers', 'array-contains', authentication.user?.id]],
      'updateTimestamp',
      'desc',
      20,
      // @ts-expect-error DocumentSnapshot
      lastVisible
    )
    workouts.value.push(...newWorkouts)
  }

  /**
   * Fetch community workouts
   * @return Array
   */
  async function fetchCommunityWorkouts() {
    const user = useUserStore()
    const usersWorkoutsDb = new UsersWorkoutsDB()
    const lastVisible =
      workoutsCommunity.value.length > 0
        ? workoutsCommunity.value[workoutsCommunity.value.length - 1]
        : null
    const constraints: [string, WhereFilterOp, any][] = [['share', '==', true]]
    if (user?.getUserHangboardCompany) {
      constraints.push(['company', '==', user.getUserHangboardCompany.id])
    }
    if (user?.getUserHangboard) {
      constraints.push(['hangboard', '==', user.getUserHangboard.id])
    }
    const newWorkouts = await usersWorkoutsDb.readAll(
      constraints,
      workoutsCommunityFilter.value.value,
      'desc',
      20,
      // @ts-expect-error DocumentSnapshot
      lastVisible
    )
    workoutsCommunity.value.push(...newWorkouts)
  }

  /**
   * Fetch leaderboard
   * @param rank
   * @return {Promise<void>}
   */
  async function fetchLeaderboard(rank = 'completed.amount') {
    if (leaderboards.value.find((leaderboard) => leaderboard.rank === rank)) return
    const usersDb = new UsersDB()
    const leaderboard = await usersDb.readAll([[rank, '>', 0]], rank, 'desc', 15)
    leaderboards.value.push({ rank, leaderboard })
  }

  /**
   * Add a new workout for the user
   * @param workout
   * @return {Promise<void>}
   */
  async function createUserWorkout(workout: Workout) {
    const { user } = storeToRefs(useAuthenticationStore())
    if (user.value) {
      const userWorkoutDb = new UserWorkoutsDB(user.value.id)

      const createdWorkout = await userWorkoutDb.create(workout)

      // push to beginning of workouts
      workouts.value.unshift(createdWorkout)

      // also add the workout as a community workout
      if (createdWorkout.share === true) {
        workoutsCommunity.value.unshift(createdWorkout)
      }
    }
  }

  /**
   * Update the users workout
   * @param payload
   * @return {Promise<void>}
   */
  async function updateUserWorkout(payload: Workout) {
    const { user } = storeToRefs(useAuthenticationStore())
    if (user.value) {
      const userWorkoutsDb = new UserWorkoutsDB(user.value.id)
      await userWorkoutsDb.update(payload)
    }
  }

  /**
   * Delete a user workout by ID
   * @param id
   * @return {Promise<void>}
   */
  async function removeUserWorkoutById(id: string) {
    const { user } = storeToRefs(useAuthenticationStore())
    if (user.value) {
      const userWorkoutsDb = new UserWorkoutsDB(user.value.id)

      await userWorkoutsDb.delete(id)

      const index = workouts.value.findIndex((workout) => workout.id === id)

      workouts.value.splice(index, 1)
    }
  }

  /**
   * Update another users workout
   * @param payload
   * @return {Promise<void>}
   */
  async function updateWorkout(payload: { userId: string; workout: Workout }) {
    const userWorkoutsDb = new UserWorkoutsDB(payload.userId)
    await userWorkoutsDb.update(payload.workout)
  }

  /**
   * Get workout by ID
   * @return Object
   */
  const getWorkoutById = computed(() => (id: string | string[]): Workout | undefined => {
    // eslint-disable-next-line no-shadow
    let workout = workouts.value?.find((workout: Workout) => workout.id === id)
    if (!workout)
      // eslint-disable-next-line no-shadow
      workout = workoutsCommunity.value?.find((workout: Workout) => workout.id === id)
    if (id === 'new') {
      const authentication = useAuthenticationStore()
      const user = useUserStore()
      if (authentication.user && user.getUserHangboard && user.getUserHangboardCompany) {
        workout = reactive<Workout>({
          name: i18n.global.t('New workout'),
          description: '',
          level: 1,
          hangboard: user.getUserHangboard.id,
          company: user.getUserHangboardCompany.id,
          exercises: [],
          time: 0,
          share: false,
          video: '',
          subscribers: [authentication.user.id],
          user: {
            displayName: authentication.user.displayName,
            grade: authentication.user?.settings.grade,
            id: authentication.user.id,
            photoURL: authentication.user.photoURL
          }
        })
      }
    }
    return workout
  })

  /**
   * Get workouts for the currently selected hangboard
   */
  const getWorkoutsBySelectedHangboard = computed(() => {
    const user = useUserStore()
    if (workouts.value === null) return []
    const limit = 999
    const items = workouts.value.length > limit ? limit : workouts.value.length
    return workouts.value
      ?.filter(
        (workout) =>
          workout?.company === user.getUserHangboardCompany?.id &&
          workout?.hangboard === user.getUserHangboard?.id
      )
      ?.sort((a: Workout, b: Workout) => (a.updateTimestamp > b.updateTimestamp ? -1 : 1))
      ?.slice(0, items)
  })

  const getWorkoutsByCommunity = computed(() => {
    if (workoutsCommunity.value === null) return []
    const limit = 999
    const items = workoutsCommunity.value.length > limit ? limit : workoutsCommunity.value.length
    return workoutsCommunity.value
      ?.sort((a: Workout, b: Workout) => (a.updateTimestamp > b.updateTimestamp ? -1 : 1))
      ?.slice(0, items)
  })

  const getLeaderboard = computed(
    () => (rank: string) =>
      leaderboards.value.find((leaderboard: Leaderboard) => leaderboard.rank === rank)
  )

  return {
    workouts,
    workoutsCommunity,
    workoutsCommunityFilter,
    leaderboards,
    fetchUserWorkouts,
    fetchCommunityWorkouts,
    fetchLeaderboard,
    createUserWorkout,
    updateUserWorkout,
    removeUserWorkoutById,
    updateWorkout,
    getWorkoutById,
    getWorkoutsBySelectedHangboard,
    getWorkoutsByCommunity,
    getLeaderboard
  }
})
