/**
 * Represents the various states of an exercise within a workout.
 * Each workout consists of multiple exercises that involve sequences
 * of holding, resting, and optionally repeating, with pauses in between.
 * Use these states to track and manage the user's progress until
 * the workout is complete.
 */
export enum ExerciseState {
  /**
   * The transitional period between exercises.
   */
  PAUSE,

  /**
   * The period during which the user actively holds the hangboard.
   */
  HOLD,

  /**
   * The rest period following a hold, typically before a potential repeat.
   */
  REST,

  /**
   * A directive to repeat the hold-rest sequence.
   */
  REPEAT,

  /**
   * Indicates that the entire workout is finished.
   */
  DONE
}
