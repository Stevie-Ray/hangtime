import { BaseModel } from '@/models/base.model'
import { Levels } from '@/interfaces/workout.interface'
import type { IWorkout, IExercise } from '@/interfaces/workout.interface'
import i18n from '@/plugins/i18n'

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

  constructor(workout: Partial<IWorkout>) {
    super(workout)

    this.name = workout.name || i18n.global.t('New workout')
    this.description = workout.description || ''
    this.level = workout.level || Levels.Normal
    this.hangboard = workout.hangboard || 0
    this.company = workout.company || 0
    this.exercises = workout.exercises || []
    this.time = workout.time || 0
    this.share = workout.share || false
    this.video = workout.video || ''
    this.subscribers = workout.subscribers || []
    this.subscribers_count = workout.subscribers_count || 0
    this.user = workout.user || { displayName: '', grade: 0, id: '', photoURL: '' }
  }
}
