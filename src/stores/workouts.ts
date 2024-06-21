import { ref, computed, reactive } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { WhereFilterOp } from 'firebase/firestore/lite'
import { useAuthenticationStore } from '@/stores/authentication'
import { useUserStore } from '@/stores/user'
import i18n from '@/plugins/i18n'
import { CommunityWorkoutsDB, UserSubscribedDB } from '@/plugins/firebase/users-workouts-db'
import UserWorkoutsDB from '@/plugins/firebase/user-workouts-db'
import UsersDB from '@/plugins/firebase/users-db'
import { Leaderboard, Workout } from '@/interfaces/workouts.interface'

const userSubscribedDB = new UserSubscribedDB()
const communityWorkoutsDB = new CommunityWorkoutsDB()
const usersDB = new UsersDB()

export const useWorkoutsStore = defineStore('workouts', () => {
  const workouts = ref<Workout[]>([])
  const workoutsCommunity = ref<Workout[]>([])
  const workoutsCommunityFilter = ref({ filter: 'Last Modified', value: 'updateTimestamp' })
  const workoutsCommunityFilterDirection = ref<'desc' | 'asc'>('desc')
  const leaderboards = ref<Leaderboard[]>([])

  const { user } = storeToRefs(useAuthenticationStore())

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
    return userSubscribedDB.lastResult
  })

  const resetUserWorkouts = () => {
    userSubscribedDB.resetLastVisible()
  }

  const resetCommunityWorkouts = () => {
    communityWorkoutsDB.resetLastVisible()
  }

  const reachedLastCommunityWorkouts = computed(() => {
    return communityWorkoutsDB.lastResult
  })

  const fetchCommunityWorkouts = async () => {
    const userStore = useUserStore()
    const constraints: [string, WhereFilterOp, any][] = [['share', '==', true]]

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

  const fetchLeaderboard = async (rank = 'completed.amount') => {
    if (leaderboards.value.some((leaderboard) => leaderboard.rank === rank)) return

    const leaderboard = await usersDB.readAll([[rank, '>', 0]], rank, 'desc', 15)
    leaderboards.value.push({ rank, leaderboard })
  }

  const createUserWorkout = async (workout: Workout) => {
    if (user.value) {
      const userWorkoutDb = new UserWorkoutsDB(user.value.id)
      const createdWorkout = await userWorkoutDb.create(workout)

      workouts.value.unshift(createdWorkout)

      if (createdWorkout.share) {
        workoutsCommunity.value.unshift(createdWorkout)
      }
    }
  }

  const updateUserWorkout = async (workout: Workout) => {
    if (user.value) {
      const userWorkoutsDb = new UserWorkoutsDB(user.value.id)
      await userWorkoutsDb.update(workout)
    }
  }

  const removeUserWorkoutById = async (id: string) => {
    if (user.value) {
      const userWorkoutsDb = new UserWorkoutsDB(user.value.id)
      await userWorkoutsDb.delete(id)

      const index = workouts.value.findIndex((workout) => workout.id === id)
      if (index !== -1) {
        workouts.value.splice(index, 1)
      }
    }
  }

  const updateWorkout = async ({ userId, workout }: { userId: string; workout: Workout }) => {
    const userWorkoutsDb = new UserWorkoutsDB(userId)
    await userWorkoutsDb.update(workout)
  }

  const getWorkoutById = computed(() => (id: string | string[]): Workout | undefined => {
    let workout = workouts.value.find((workout) => workout.id === id)
    if (!workout) {
      workout = workoutsCommunity.value.find((workout) => workout.id === id)
    }
    if (id === 'new') {
      const { getUserHangboard, getUserHangboardCompany } = useUserStore()

      if (user.value && getUserHangboard && getUserHangboardCompany) {
        workout = reactive<Workout>({
          name: i18n.global.t('New workout'),
          description: '',
          level: 1,
          hangboard: getUserHangboard.id,
          company: getUserHangboardCompany.id,
          exercises: [],
          time: 0,
          share: false,
          video: '',
          subscribers: [user.value.id],
          user: {
            displayName: user.value.displayName,
            grade: user.value.settings?.grade,
            id: user.value.id,
            photoURL: user.value.photoURL
          }
        })
      }
    }
    return workout
  })

  const getWorkoutsBySelectedHangboard = computed(() => {
    const { getUserHangboard, getUserHangboardCompany } = useUserStore()
    if (!workouts.value) return []

    const limit = 999
    const items = Math.min(workouts.value.length, limit)

    return workouts.value
      .filter(
        (workout) =>
          workout?.company === getUserHangboardCompany?.id &&
          workout?.hangboard === getUserHangboard?.id
      )
      .sort((a, b) => b.updateTimestamp - a.updateTimestamp)
      .slice(0, items)
  })

  const getWorkoutsByCommunity = computed(() => {
    if (!workoutsCommunity.value) return []

    const limit = 999
    const items = Math.min(workoutsCommunity.value.length, limit)

    return workoutsCommunity.value
      .sort((a, b) => b.updateTimestamp - a.updateTimestamp)
      .slice(0, items)
  })

  const getLeaderboard = computed(
    () => (rank: string) => leaderboards.value.find((leaderboard) => leaderboard.rank === rank)
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
    getWorkoutsByCommunity,
    getLeaderboard,
    resetUserWorkouts,
    resetCommunityWorkouts,
    reachedLastUserWorkouts,
    reachedLastCommunityWorkouts 
  }
})
