import { ref, computed, reactive } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { FieldPath, WhereFilterOp } from 'firebase/firestore/lite'
import { useAuthenticationStore } from '@/stores/authentication.store'
import { useUserStore } from '@/stores/user.store'
import { CommunityWorkoutsDB, UserSubscribedDB } from '@/plugins/firebase/users-workouts-db'
import UserWorkoutsDB from '@/plugins/firebase/user-workouts-db'
import UsersDB from '@/plugins/firebase/users-db'
import { Leaderboard, IWorkout } from '@/interfaces/workout.interface'
import { IUser } from '@/interfaces/user.interface'
import { Workout } from '@/models/workout.model'

const userSubscribedDB = new UserSubscribedDB()
const communityWorkoutsDB = new CommunityWorkoutsDB()
const usersDB = new UsersDB()

export const useWorkoutsStore = defineStore('workouts', () => {
  const workouts = ref<IWorkout[]>([])
  const workoutsCommunity = ref<IWorkout[]>([])
  const workoutsCommunityFilter = ref({ filter: 'Last Modified', value: 'updateTimestamp' })
  const workoutsCommunityFilterDirection = ref<'desc' | 'asc'>('desc')
  const leaderboards = ref<Leaderboard[]>([])
  let workoutDB: UserWorkoutsDB | null = null

  const { user } = storeToRefs(useAuthenticationStore())

  if (user.value?.id) {
    workoutDB = new UserWorkoutsDB(user.value.id)
  }

  const fetchUserWorkouts = async () => {
    const newWorkouts = await userSubscribedDB.readAll(
      [['subscribers', 'array-contains', user.value?.id]],
      'updateTimestamp',
      'desc',
      20
    )
    workouts.value.push(...newWorkouts)
  }

  const reachedLastUserWorkouts = computed(() => {
    return userSubscribedDB.lastResult.value
  })

  const reachedLastCommunityWorkouts = computed(() => {
    return communityWorkoutsDB.lastResult.value
  })

  const resetUserWorkouts = () => {
    userSubscribedDB.resetLastVisible()
  }

  const resetCommunityWorkouts = () => {
    communityWorkoutsDB.resetLastVisible()
  }

  const fetchCommunityWorkouts = async () => {
    const userStore = useUserStore()
    const constraints: [string | FieldPath, WhereFilterOp, unknown][] = [['share', '==', true]]

    if (userStore?.getUserHangboardCompany) {
      constraints.push(['company', '==', userStore.getUserHangboardCompany.id])
    }
    if (userStore?.getUserHangboard) {
      constraints.push(['hangboard', '==', userStore.getUserHangboard.id])
    }

    const newWorkouts = await communityWorkoutsDB.readAll(
      constraints,
      workoutsCommunityFilter.value.value,
      workoutsCommunityFilterDirection.value,
      20
    )
    workoutsCommunity.value.push(...newWorkouts)
  }

  const fetchLeaderboard = async (
    rank: 'completed.amount' | 'completed.time' | 'completed.hold' = 'completed.amount'
  ) => {
    if (leaderboards.value.some((leaderboard) => leaderboard.rank === rank)) return

    const leaderboard: IUser[] = await usersDB.readAll([[rank, '>', 0]], rank, 'desc', 15)
    leaderboards.value.push({ rank, leaderboard })
  }

  const createUserWorkout = async (workout: IWorkout) => {
    if (workoutDB) {
      // remove id if it is not set
      if (workout.id === undefined || workout.id === null) {
        delete workout.id
      }
      const createdWorkout = await workoutDB.create(workout)

      workouts.value.unshift(createdWorkout)

      if (createdWorkout.share) {
        workoutsCommunity.value.unshift(createdWorkout)
      }
    }
  }

  const updateUserWorkout = async (workout: IWorkout) => {
    if (workoutDB) {
      await workoutDB.update(workout as IWorkout & { id: string })
    }
  }

  const removeUserWorkoutById = async (id: string) => {
    if (workoutDB) {
      await workoutDB.delete(id)

      const index = workouts.value.findIndex((workout) => workout.id === id)
      if (index !== -1) {
        workouts.value.splice(index, 1)
      }
    }
  }

  /**
   * Updates a workout of a gven user.
   */
  const updateWorkout = async ({ userId, workout }: { userId: string; workout: IWorkout }) => {
    const userWorkoutsDb = new UserWorkoutsDB(userId)
    await userWorkoutsDb.update(workout as IWorkout & { id: string })
  }

  const getWorkoutById = computed(() => (id: string | string[]): Workout | undefined => {
    if (id === 'new') {
      const newWorkout = new Workout()
      newWorkout.addExercise()
      return reactive(newWorkout)
    }

    if (workouts.value.find((workout) => workout.id === id)) {
      return reactive(new Workout(workouts.value.find((workout) => workout.id === id)))
    }

    if (workoutsCommunity.value.find((workout) => workout.id === id)) {
      return reactive(new Workout(workoutsCommunity.value.find((workout) => workout.id === id)))
    }
  })

  /**
   * Get the Users hangboards of a certain hangboard / company.
   */
  const getWorkoutsBySelectedHangboard = computed(() => {
    const { getUserHangboard, getUserHangboardCompany } = useUserStore()

    return workouts.value.filter(
      (workout) =>
        workout?.company === getUserHangboardCompany?.id &&
        workout?.hangboard === getUserHangboard?.id
    )
  })

  const getLeaderboard = computed(
    () => (rank: 'completed.amount' | 'completed.time' | 'completed.hold') =>
      leaderboards.value.find((leaderboard) => leaderboard.rank === rank)
  )

  return {
    workouts,
    workoutsCommunity,
    workoutsCommunityFilter,
    workoutsCommunityFilterDirection,
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
    getLeaderboard,
    resetUserWorkouts,
    resetCommunityWorkouts,
    reachedLastUserWorkouts,
    reachedLastCommunityWorkouts
  }
})
