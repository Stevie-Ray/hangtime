/**
 * Represents an exercise in a hangboard workout.
 */
export interface Exercise {
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
  leftHand?: Array<any>

  /**
   * Array representing the fingers used on the right hand.
   * Typically an array of indexes indicating which fingers are involved.
   */
  rightHand?: Array<any>

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
export interface Workout {
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
  exercises: Exercise[]

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
   * User information of the workout creator.
   * An object containing details about the user who created the workout.
   */
  user: {
    /** Display name of the user. */
    displayName: string
    /** Climbing grade of the user. */
    grade: number
    /** Unique identifier for the user. */
    id: string
    /** URL to the user's profile photo. */
    photoURL: string
  }

  /**
   * Timestamp of the last update.
   * Optional field indicating when the workout was last modified.
   */
  updateTimestamp?: any
}

/**
 * Represents a leaderboard for workouts.
 */
export interface Leaderboard {
  /**
   * Rank of the leaderboard entry.
   * A string that represents the rank, such as "1st", "2nd", etc.
   */
  rank: string

  /**
   * List of entries in the leaderboard.
   * An array of objects representing the participants and their scores.
   */
  leaderboard: Array<any>
}

/**
 * Levels of difficulty available for the workout.
 * This enum is used to categorize the workout by difficulty.
 */
export enum Levels {
  /** Easy level: Suitable for beginners or warm-up routines. */
  Easy = 1,

  /** Normal level: Intermediate difficulty for regular training. */
  Normal,

  /** Hard level: Advanced difficulty for intense training sessions. */
  Hard
}
