/**
 * Represents an activity done by a user.
 */
export interface Activity {
  id?: string
  /** The name of the activity */
  name: string
  /** The local start date and time of the activity */
  start_date_local: Date
  /** The type of sport associated with the activity */
  sport_type: string
  /** The total elapsed time of the activity in seconds */
  elapsed_time: number
  /** The elapsed time spent hanging during the activity in seconds */
  elapsed_time_hanging: number
  /** A description of the activity */
  description: string
  /** The difficulty level of the activity, can be null */
  difficulty: number | null
  /** The type of the activity (e.g., "Hangboarding") */
  type: string
  /** The company associated with the activity, can be null */
  company: number | null
  /** The hangboard used in the activity, can be null */
  hangboard: number | null
  /** The ID of the user who performed the activity */
  user: string
  /** The ID of the workout associated with the activity */
  workout: string
}
