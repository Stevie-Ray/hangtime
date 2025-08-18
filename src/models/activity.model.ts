import type { IActivity } from '@/interfaces/activity.interface'
import { BaseModel } from './base.model'
import { useAuthenticationStore } from '@/stores/authentication.store'
import type { IWorkout } from '@/interfaces/workout.interface'

/**
 * Activity model
 * @class Activity
 * @extends BaseModel
 * @implements IActivity
 * @description Represents an activity in the system with its properties
 */
export class Activity extends BaseModel implements IActivity {
  name: string
  start_date_local: Date
  sport_type: string
  elapsed_time: number
  elapsed_time_hanging: number
  description: string
  difficulty: number | null
  type: string
  company: number | null
  hangboard: number | null
  user: string
  workout: string

  constructor(timeTotal: number, timeHanging: number, workout?: Partial<IWorkout>) {
    super(workout || {})

    const { user } = useAuthenticationStore()

    this.name = workout?.name || ''
    this.start_date_local = new Date()
    this.sport_type = 'Workout'
    this.elapsed_time = timeTotal || 0
    this.elapsed_time_hanging = timeHanging || 0
    this.description = workout?.description || ''
    this.difficulty = workout?.level !== undefined ? workout.level : null
    this.type = 'Hangboarding'
    this.company = workout?.company || null
    this.hangboard = workout?.hangboard || null
    this.user = workout?.user?.id || user?.id || ''
    this.workout = workout?.id || ''
  }
}
