export interface Excercise {
  exercise: number;
  grip: number;
  level: number;
  left: number;
  right: number;
  pause: number;
  hold: number;
  pullups: number;
  repeat: number;
  rest: number;
  weight: number;
  time?: number;
  max?: boolean
  notes: string;
}
/**
 * Represents a hangboard workout
 */
export interface Workout {
  /** Unique identifier for the workout (optional) */
  id?: string;
  /** Name of the workout */
  name: string;
  /** Description of the workout */
  description: string;
  /** Difficulty level of the workout */
  level: number;
  /** The hangboard used in the workout */
  hangboard: string;
  /** Company that created the workout */
  company: string;
  /** List of exercises included in the workout */
  exercises: Excercise[];
  /** Duration of the workout in minutes */
  time: number;
  /** Indicates if the workout is shared publicly */
  share: boolean;
  /** URL to a video demonstrating the workout */
  video: string;
  /** List of subscriber IDs who follow the workout */
  subscribers: Array<string>;
  /** User information of the workout creator */
  user: {
    /** Display name of the user */
    displayName: string;
    /** Climbing grade of the user */
    grade: number;
    /** Unique identifier for the user */
    id: string;
    /** URL to the user's profile photo */
    photoURL: string;
  };
  /** Timestamp of the last update (optional) */
  updateTimestamp?: any;
}

/**
 * Represents a leaderboard for workouts.
 */
export interface Leaderboard {
  /** Rank of the leaderboard entry */
  rank: string;
  /** List of entries in the leaderboard */
  leaderboard: Array<any>;
}