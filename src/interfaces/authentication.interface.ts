/**
 * Represents the settings configured by a user.
 */
interface UserSettings {
  /** Index of the selected hangboard */
  selected: number;
  /** List of hangboards, each defined by a company and hangboard number */
  hangboards: Array<{ company: number; hangboard: number }>;
  /** Scale used for measurement (e.g., metric or imperial) */
  scale: string;
  /** Climbing grade of the user */
  grade: number;
  /** Indicates if sound is enabled */
  sound: boolean;
  /** Indicates if voice guidance is enabled */
  speak: boolean;
  /** Voice profile number for voice guidance */
  voice: number;
  /** Indicates if vibration feedback is enabled */
  vibrate: boolean;
  /** Indicates if the walkthrough/tutorial is enabled */
  walkthrough: boolean;
  /** User's locale/language setting (optional) */
  locale?: string;
  /** User's weight (optional) */
  weight?: number;
}

/**
 * Represents a user profile.
 */
interface User {
  /** Display name of the user (nullable) */
  displayName: string | null;
  /** URL to the user's profile photo (nullable) */
  photoURL: string | null;
  /** Email address of the user (nullable) */
  email: string | null;
  /** Settings configured by the user */
  settings: UserSettings;
  /** Unique identifier for the user (optional) */
  id?: string;
}