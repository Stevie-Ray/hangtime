/**
 * Represents the settings configured by a user.
 */
interface UserSettings {
  /** Climbing grade of the user */
  grade: number
  /** the selected hangboard */
  hangboard?: number
  /** List of hangboards, each defined by a company and hangboard number */
  hangboards: Array<{ company: number; hangboard: number }>
  /** User's locale/language setting (optional) */
  locale?: string
  /** Scale used for measurement (e.g., metric or imperial) */
  scale: string
  /** */
  scheme?: boolean
  /** Index of the selected hangboard */
  selected: number
  /** Indicates if sound is enabled */
  sound: boolean
  /** Indicates if voice guidance is enabled */
  speak: boolean
  /** Theme ID for the app (optional) */
  theme?: number
  /** Firebase Cloud Messaging Token (optional) */
  token?: string
  /** Indicates if vibration feedback is enabled */
  vibrate: boolean
  /** Voice profile number for voice guidance */
  voice: number
  /** Indicates if the walkthrough/tutorial is enabled */
  walkthrough: boolean
}
/**
 * Represents the country configured by a user.
 */
export interface Country {
  /** ISO 3166-1 alpha-2 code */
  alpha2: string
  /** ISO 3166-1 alpha-3 code */
  alpha3: string
  /** International dialing codes */
  countryCallingCodes: string[]
  /** Currency codes */
  currencies: string[]
  /** Emoji flag */
  emoji?: string
  /** International Olympic Committee code */
  ioc: string
  /** Language codes */
  languages: string[]
  /** Country name */
  name: string
  /** Status of the country */
  status: string
}
/**
 * Represents a user profile.
 */
export interface User {
  /** Set if the user has completed a workout (optional) */
  completed?: {
    /** Number of workouts done */
    amount: number
    /** Time spent working out in seconds */
    time: number
    /** Time spent on hangboard in seconds */
    hold: number
  }
  /** Country details */
  country?: Country
  /** Display name of the user (nullable) */
  displayName: string
  /** Email address of the user (nullable) */
  email: string
  /** Gender */
  gender?: string
  /** URL to the user's profile photo */
  photoURL: string
  /** URL to the user's profile photo (nullable) */
  pictureURL?: string
  /** Settings configured by the user */
  settings: UserSettings
  /** Unique identifier for the user (optional) */
  id: string
  /** User's status (optional) */
  status?: string
  /** Set if the user has paid (optional) */
  subscribed?: boolean
  /** User's weight (optional) */
  weight?: number
}
