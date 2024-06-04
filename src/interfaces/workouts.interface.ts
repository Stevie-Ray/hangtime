/**
 * Represents an exercise in a hangboard workout.
 */
export interface Exercise {
  /** Number representing the exercise. */
  exercise: number
  /** Number representing the grip used in the exercise. */
  grip: number
  /** Difficulty level of the exercise. */
  level: number
  /** Number of repetitions for the left side. */
  left: number | null
  /** Number of repetitions for the right side. */
  right: number | null
  /** Array with finger indexes */
  leftHand?: Array<any>
  /** Array with finger indexes */
  rightHand?: Array<any>
  /** Rotate */
  rotate?: number
  /** Pause duration between repetitions. */
  pause: number
  /** Duration of the hold. */
  hold: number
  /** Number of pull-ups performed during the exercise. */
  pullups: number
  /** Number of repetitions. */
  repeat: number
  /** Rest duration between sets. */
  rest: number
  /** Additional weight used in the exercise (if any). */
  weight: number
  /** Optional: Duration of the exercise in seconds. */
  time?: number
  /** Optional: Indicates if it's the maximum effort exercise. */
  max?: boolean
  /** Notes or additional information about the exercise. */
  notes: string
}

/**
 * Represents a hangboard workout.
 */
export interface Workout {
  /** Unique identifier for the workout (optional). */
  id?: string
  /** Name of the workout. */
  name: string
  /** Description of the workout. */
  description: string
  /** Difficulty level of the workout. */
  level: 1 | 2 | 3
  /** The hangboard used in the workout. */
  hangboard: number
  /** Company that created the workout. */
  company: number
  /** List of exercises included in the workout. */
  exercises: Exercise[]
  /** Duration of the workout in minutes. */
  time: number
  /** Indicates if the workout is shared publicly. */
  share: boolean
  /** URL to a video demonstrating the workout. */
  video: string
  /** List of subscriber IDs who follow the workout. */
  subscribers: Array<string>
  /** User information of the workout creator. */
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
  /** Timestamp of the last update (optional). */
  updateTimestamp?: any
}

/**
 * Represents a leaderboard for workouts.
 */
export interface Leaderboard {
  /** Rank of the leaderboard entry. */
  rank: string
  /** List of entries in the leaderboard. */
  leaderboard: Array<any>
}
