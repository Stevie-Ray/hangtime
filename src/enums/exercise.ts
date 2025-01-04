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

/**
 * Enum for the various exercises.
 */
export enum Exercises {
  /**
   * Pull-up
   */
  PULLUP = 1,

  /**
   * Scap Pull
   */
  SCAP_PULL,

  /**
   * Negative Pull
   */
  NEGATIVE_PULL,

  /**
   * Typewriter
   */
  TYPEWRITER,

  /**
   * L-Hang
   */
  L_HANG,

  /**
   * Knees Raise
   */
  KNEES_RAISE
}

/**
 * Enum for the various grips.
 */
export enum Grip {
  /**
   * Dead Hang
   */
  DEAD_HANG,

  /**
   * Lock-off 45
   */
  LOCK_OFF_45,

  /**
   * Lock-off 90
   */
  LOCK_OFF_90,

  /**
   * Lock-off Full
   */
  LOCK_OFF_FULL,

  /**
   * Front Lever
   */
  FRONT_LEVER,

  /**
   * No Hang
   */
  NO_HANG
}
