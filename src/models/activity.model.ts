import { IActivity } from '@/interfaces/activity.interface'
import { BaseModel } from './base.model'

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

  constructor(activity: Partial<IActivity>) {
    super(activity)

    this.name = activity.name || ''
    this.start_date_local = activity.start_date_local || new Date()
    this.sport_type = activity.sport_type || ''
    this.elapsed_time = activity.elapsed_time || 0
    this.elapsed_time_hanging = activity.elapsed_time_hanging || 0
    this.description = activity.description || ''
    this.difficulty = activity.difficulty || null
    this.type = activity.type || ''
    this.company = activity.company || null
    this.hangboard = activity.hangboard || null
    this.user = activity.user || ''
    this.workout = activity.workout || ''
  }
}
