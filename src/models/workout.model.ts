import { BaseModel } from '@/models/base.model'
import { Levels } from '@/interfaces/workout.interface'
import type { IWorkout, IExercise } from '@/interfaces/workout.interface'
import i18n from '@/plugins/i18n'
import { useUserStore } from '@/stores/user'
import { useAuthenticationStore } from '@/stores/authentication'

export class Workout extends BaseModel implements IWorkout {
  name: string
  description: string
  level: Levels
  hangboard: number
  company: number
  exercises: IExercise[]
  time: number
  share: boolean
  video: string
  subscribers: string[]
  subscribers_count?: number | undefined
  user: { displayName: string; grade: number; id: string; photoURL: string }

  constructor(workout?: Partial<IWorkout>) {
    super(workout || {})

    const { user } = useAuthenticationStore()
    const userStore = useUserStore()
    const { getUserHangboard, getUserHangboardCompany } = userStore

    this.name = workout?.name || i18n.global.t('New workout')
    this.description = workout?.description || ''
    this.level = workout?.level || Levels.Normal
    this.hangboard = workout?.hangboard || getUserHangboard?.id || 0
    this.company = workout?.company || getUserHangboardCompany?.id || 0
    this.exercises = workout?.exercises || []
    this.time = workout?.time || 0
    this.share = workout?.share || false
    this.video = workout?.video || ''
    this.subscribers = workout?.subscribers || (user?.id ? [user?.id] : [])
    this.subscribers_count = workout?.subscribers_count || this.subscribers.length - 1 || 0
    this.user = {
      displayName: workout?.user?.displayName || user?.displayName || '',
      grade: workout?.user?.grade || user?.settings?.grade || 0,
      id: workout?.user?.id || user?.id || '',
      photoURL: workout?.user?.photoURL || user?.photoURL || ''
    }
  }

  /**
   * Add an exercise to the workout.
   * @param exercise
   */
  addExercise(exercise?: IExercise) {
    const exerciseNew: IExercise = exercise || {
      exercise: 0,
      grip: 0,
      level: 0,
      left: 0,
      right: 0,
      pause: 10,
      hold: 7,
      pullups: 1,
      repeat: 0,
      rest: 3,
      weight: 0,
      notes: ''
    }

    // Remove pause for first exercise
    if (this.exercises.length === 0) {
      exerciseNew.pause = 0
    }

    // Calculate total time for exercise
    exerciseNew.time =
      (exerciseNew.hold + exerciseNew.rest) * (exerciseNew.repeat + 1) -
      exerciseNew.rest +
      exerciseNew.pause

    // Add exercise time to total workout time
    this.time += exerciseNew.time

    // Add exercise to workout
    this.exercises.push(exerciseNew)
  }

  /**
   * Remove an exercise from the workout.
   * @param index
   */
  removeExercise(index: number) {
    if (this.exercises[index].time) {
      this.time -= this.exercises[index].time
    }
    this.exercises.splice(index, 1)
  }

  /**
   * Copy an exercise to the workout.
   * @param index
   */
  copyExercise(index: number) {
    if (this.exercises[index].time) {
      this.time += this.exercises[index].time
    }
    // if the first exercise is removed, add a pause of 10 seconds to the new exercise
    if (index === 0) {
      this.exercises[index].pause = 10
    }
    this.exercises.splice(index, 0, JSON.parse(JSON.stringify(this.exercises[index])))
  }
}
