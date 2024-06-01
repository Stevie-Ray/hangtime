import { reactive } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useAuthentication } from '@/stores/authentication'
import { useUser } from '@/stores/user'
import i18n from '@/plugins/i18n'
import UsersWorkoutsDB from '@/plugins/firebase/users-workouts-db'
import UserWorkoutsDB from '@/plugins/firebase/user-workouts-db'
import UsersDB from '@/plugins/firebase/users-db'
import { Leaderboard, Workout } from '@/interfaces/workouts.interface'

export const useWorkouts = defineStore('workouts', {
  state: () => ({
    workouts: [] as Workout[],
    workoutsCommunity: [] as Workout[],
    leaderboards: [] as Leaderboard[]
  }),
  actions: {
    /**
     * Fetch user workouts
     * @return Array
     */
    async fetchUserWorkouts() {
      const authentication = useAuthentication()
      const usersWorkoutsDb = new UsersWorkoutsDB(authentication.user.id)
      const lastVisible = this.workouts.length > 0 ? this.workouts[this.workouts.length - 1] : null
      const newWorkouts = await usersWorkoutsDb.readAll(
        [['subscribers', 'array-contains', authentication.user.id]],
        'updateTimestamp',
        lastVisible,
        20
      )
      this.workouts.push(...newWorkouts)
    },
    /**
     * Fetch community workouts
     * @return Array
     */
    async fetchCommunityWorkouts() {
      const authentication = useAuthentication()
      const user = useUser()
      const usersWorkoutsDb = new UsersWorkoutsDB(authentication.user.id)
      const lastVisible =
        this.workoutsCommunity.length > 0
          ? this.workoutsCommunity[this.workoutsCommunity.length - 1]
          : null
      const constraints = [['share', '==', true]]
      if (user?.getUserHangboardCompany) {
        constraints.push(['company', '==', user.getUserHangboardCompany.id])
      }
      if (user?.getUserHangboard) {
        constraints.push(['hangboard', '==', user.getUserHangboard.id])
      }
      const newWorkouts = await usersWorkoutsDb.readAll(
        constraints,
        'updateTimestamp',
        lastVisible,
        20
      )
      this.workoutsCommunity.push(...newWorkouts)
    },
    /**
     * Fetch leaderboard
     * @param rank
     * @return {Promise<void>}
     */
    async fetchLeaderboard(rank = 'completed.amount') {
      if (this.leaderboards.find((leaderboard) => leaderboard.rank === rank)) return
      const usersDb = new UsersDB()
      const leaderboard = await usersDb.readAll([[rank, '>', 0]], rank, 15)
      this.leaderboards.push({ rank, leaderboard })
    },
    /**
     * Add a new workout for the user
     * @param workout
     * @return {Promise<void>}
     */
    async createUserWorkout(workout) {
      const { user } = storeToRefs(useAuthentication())
      const userWorkoutDb = new UserWorkoutsDB(user.value.id)

      const createdWorkout = await userWorkoutDb.create(workout)

      // push to beginning of  workouts
      this.workouts.unshift(createdWorkout)

      // also add the workout as a community workout
      if (createdWorkout.share === true) {
        this.workoutsCommunity.unshift(createdWorkout)
      }
    },
    /**
     * Update the users workout
     * @param payload
     * @return {Promise<void>}
     */
    async updateUserWorkout(payload) {
      const { user } = storeToRefs(useAuthentication())
      const userWorkoutsDb = new UserWorkoutsDB(user.value.id)
      await userWorkoutsDb.update(payload)
    },
    /**
     * Delete a user workout by ID
     * @param id
     * @return {Promise<void>}
     */
    async removeUserWorkoutById(id) {
      const { user } = storeToRefs(useAuthentication())
      const userWorkoutsDb = new UserWorkoutsDB(user.value.id)

      await userWorkoutsDb.delete(id)

      const index = this.workouts.findIndex((workout) => workout.id === id)

      this.workouts.splice(index, 1)
    },
    /**
     * Update another users workout
     * @param payload
     * @return {Promise<void>}
     */
    async updateWorkout(payload) {
      const userWorkoutsDb = new UserWorkoutsDB(payload.userId)
      await userWorkoutsDb.update(payload.workout)
    }
  },
  getters: {
    /**
     * Get workout Id
     * @return Object
     */
    getWorkoutById:
      (state) =>
      (id: string | string[]): Workout => {
        // eslint-disable-next-line no-shadow
        let workout = state.workouts?.find((workout: Workout) => workout.id === id)
        if (!workout)
          // eslint-disable-next-line no-shadow
          workout = state.workoutsCommunity?.find((workout: Workout) => workout.id === id)
        if (id === 'new') {
          const authentication = useAuthentication()
          const user = useUser()
          workout = reactive({
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
              grade: authentication.user.settings.grade,
              id: authentication.user.id,
              photoURL: authentication.user.photoURL
            }
          })
        }
        return workout
      },
    /**
     * Get workouts for the currently selected hangboard
     */
    getWorkoutsBySelectedHangboard(state) {
      const user = useUser()
      if (state.workouts === null) return []
      const limit = 999
      const items = state.workouts.length > limit ? limit : state.workouts.length
      return state.workouts
        ?.filter(
          (workout) =>
            workout?.company === user.getUserHangboardCompany?.id &&
            workout?.hangboard === user.getUserHangboard?.id
        )
        ?.sort((a: Workout, b: Workout) => (a.updateTimestamp > b.updateTimestamp ? -1 : 1))
        ?.slice(0, items)
    },
    getWorkoutsByCommunity(state) {
      if (state.workoutsCommunity === null) return []
      const limit = 999
      const items = state.workoutsCommunity.length > limit ? limit : state.workoutsCommunity.length
      return state.workoutsCommunity
        ?.sort((a: Workout, b: Workout) => (a.updateTimestamp > b.updateTimestamp ? -1 : 1))
        ?.slice(0, items)
    },
    getLeaderboard: (state) => (rank: string) =>
      state.leaderboards.find((leaderboard: Leaderboard) => leaderboard.rank === rank)
  }
})
