import { Levels } from '@/enums/levels'
import type { IUser } from './user.interface'

/**
 * Represents an exercise in a hangboard workout.
 */
export interface IExercise {
  /**
   * Number representing the exercise.
   * Unique identifier within the workout for this specific exercise.
   */
  exercise: number

  /**
   * Number representing the grip used in the exercise.
   * Refers to a specific type of grip or hold used during the exercise.
   */
  grip: number

  /**
   * Grip position on the holds (open handed, half crimp, full crimp).
   * Optional field to specify the specific grip position for the exercise.
   */
  gripPosition?: number

  /**
   * Difficulty level of the exercise.
   * Typically a numeric scale where a higher number indicates greater difficulty.
   */
  level: number

  /**
   * Number of repetitions for the left side.
   * Can be null if the exercise doesn't involve side-specific repetitions.
   */
  left: number | null

  /**
   * Number of repetitions for the right side.
   * Can be null if the exercise doesn't involve side-specific repetitions.
   */
  right: number | null

  /**
   * Array representing the fingers used on the left hand.
   * Typically an array of indexes indicating which fingers are involved.
   */
  leftHand?: Array<1 | 2 | 3 | 4 | 5>

  /**
   * Array representing the fingers used on the right hand.
   * Typically an array of indexes indicating which fingers are involved.
   */
  rightHand?: Array<1 | 2 | 3 | 4 | 5>

  /**
   * Rotation angle applied during the exercise.
   * Represents any rotation required in the exercise, in degrees.
   */
  rotate?: number

  /**
   * Pause duration between repetitions, in seconds.
   * Defines the rest time between each repetition within the exercise.
   */
  pause: number

  /**
   * Duration of the hold, in seconds.
   * Indicates how long the user should hold the position during the exercise.
   */
  hold: number

  /**
   * Number of pull-ups performed during the exercise.
   * Specific to exercises that involve pull-ups as part of the routine.
   */
  pullups: number

  /**
   * Number of repetitions for the exercise.
   * Total number of times the exercise is repeated in a set.
   */
  repeat: number

  /**
   * Rest duration between sets, in seconds.
   * Defines the time to rest between different sets of the exercise.
   */
  rest: number

  /**
   * Additional weight used in the exercise, in kilograms.
   * Represents any extra weight added during the exercise.
   */
  weight: number

  /**
   * Optional: Duration of the entire exercise in seconds.
   * Can be used if the exercise has a set total time rather than counting reps.
   */
  time?: number

  /**
   * Optional: Indicates if this exercise is the maximum effort exercise.
   * A boolean flag to denote if the exercise represents a peak or max effort.
   */
  max?: boolean

  /**
   * Notes or additional information about the exercise.
   * Can include tips, warnings, or any other relevant information.
   */
  notes: string
}

/**
 * Represents a hangboard workout.
 */
export interface IWorkout {
  /**
   * Unique identifier for the workout.
   * Optional, may not be present if the workout is not yet saved.
   */
  id?: string

  /**
   * Name of the workout.
   * Example: "Beginner Hangboard Routine", "Advanced Power Workout".
   */
  name: string

  /**
   * Description of the workout.
   * Provides an overview of what the workout entails.
   */
  description: string

  /**
   * Difficulty level of the workout.
   * The level is represented by the `Levels` enum.
   */
  level: Levels

  /**
   * The hangboard used in the workout.
   * Refers to the unique identifier of the hangboard used.
   */
  hangboard: number

  /**
   * Company that created the workout.
   * Refers to the unique identifier of the company that designed the workout.
   */
  company: number

  /**
   * List of exercises included in the workout.
   * An array of Exercise objects, detailing each step of the workout.
   */
  exercises: IExercise[]

  /**
   * Duration of the workout in minutes.
   * Total time required to complete the workout.
   */
  time: number

  /**
   * Indicates if the workout is shared publicly.
   * A boolean flag that determines if the workout is visible to others.
   */
  share: boolean

  /**
   * URL to a video demonstrating the workout.
   * Optional link to a video for visual guidance.
   */
  video: string

  /**
   * List of subscriber IDs who follow the workout.
   * An array of user IDs who have subscribed to this workout.
   */
  subscribers: Array<string>

  /**
   * Number of subscribers who follow the workout.
   * Optional field that counts how many users are following the workout.
   */
  subscribers_count?: number

  /**
   * Denormalised user information of the workout creator used to prevent Firebase queries.
   * An object containing details about the user who created the workout.
   */
  user: {
    /**
     * Display name of the user.
     * Can be null if the user has not set a display name.
     */
    displayName: string

    /**
     * IRCRA climbing grade as number (1-32) of the user.
     * Represents the user's climbing proficiency level.
     * More info: https://www.ircra.rocks/single-post/2016/09/12/reporting-grades-in-climbing-research
     */
    grade: number

    /**
     * Unique identifier for the user.
     * Generated by the Firebase authentication system.
     */
    id: string

    /**
     * URL to the user's profile photo.
     * Used for displaying the user's profile picture.
     */
    photoURL: string
  }

  /**
   * Timestamp of the last update.
   * Optional field indicating when the workout was last modified.
   */
  updateTimestamp?: Date

  /**
   * Add an exercise to the workout.
   * @param exercise
   */
  addExercise(exercise?: Partial<IExercise>): void

  /**
   * Remove an exercise from the workout.
   * @param index
   */
  removeExercise(index: number): void

  /**
   * Copy an exercise from the workout.
   * @param index
   */
  copyExercise(index: number): void
}

/**
 * Represents a the leaderbord for a specific "rank" constraint.
 */
export interface Leaderboard {
  /**
   * Rank or constraint for fetching a leaderboard query
   *
   * @example
   * 'completed.amount' - Fetch leaderboard by amount of workouts completed
   * 'completed.time' - Fetch leaderboard by time spent in workouts
   * 'completed.hold' - Fetch leaderboard by time spent holding the hangboard
   */
  rank: 'completed.amount' | 'completed.time' | 'completed.hold'

  /**
   * List of user entries in the leaderboard.
   * An array of objects representing the participants and their scores.
   */
  leaderboard: IUser[]
}
