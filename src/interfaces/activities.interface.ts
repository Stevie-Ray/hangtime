/**
 * Represents an activity done by a user.
 */
export interface Activity extends Record<string, unknown> {
  /**
   * Unique identifier for the activity.
   * Optional, may not be set if the activity has not been persisted.
   */
  id?: string

  /**
   * The name of the activity.
   * Example: "Morning Workout", "Evening Hangboard Session".
   */
  name: string

  /**
   * The local start date and time of the activity.
   * Represents when the activity began in the user's local time zone.
   */
  start_date_local: Date

  /**
   * The type of sport associated with the activity.
   * Example: "Climbing", "Running", "Cycling".
   */
  sport_type: string

  /**
   * The total elapsed time of the activity in seconds.
   * Includes all time spent on the activity from start to finish.
   */
  elapsed_time: number

  /**
   * The elapsed time spent hanging during the activity in seconds.
   * Measures the time specifically spent on hanging exercises.
   */
  elapsed_time_hanging: number

  /**
   * A description of the activity.
   * Provides additional context or details about the activity.
   * Example: "Hangboard session focusing on crimps", "Endurance training".
   */
  description: string

  /**
   * The difficulty level of the activity.
   * Can be null if not rated by the user.
   * Example values: 1 (easy) to 5 (hard).
   */
  difficulty: number | null

  /**
   * The type of the activity.
   * Example: "Hangboarding", "Bouldering", "Lead Climbing".
   */
  type: string

  /**
   * The company associated with the activity.
   * Can be null if no company is linked.
   * Represents the manufacturer of the equipment used.
   */
  company: number | null

  /**
   * The hangboard used in the activity.
   * Can be null if no hangboard was used.
   * References the specific hangboard equipment.
   */
  hangboard: number | null

  /**
   * The ID of the user who performed the activity.
   * Identifies the user in the system who completed the activity.
   */
  user: string

  /**
   * The ID of the workout associated with the activity.
   * Links the activity to a specific workout routine or plan.
   */
  workout: string
}
