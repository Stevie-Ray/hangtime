import { Theme } from '@/enums/theme'
import { Unit } from '@/enums/unit'

/**
 * Represents the settings configured by a user.
 */
export interface UserSettings {
  /**
   * IRCRA climbing grade as number (1-32) of the user.
   * Represents the user's climbing proficiency level.
   * More info: https://www.ircra.rocks/single-post/2016/09/12/reporting-grades-in-climbing-research
   */
  grade: number

  /**
   * The selected hangboard ID.
   * Optional, may not be set if no hangboard is selected.
   */
  hangboard?: number

  /**
   * List of hangboards owned by the user.
   * Each hangboard is identified by a company ID and a hangboard ID.
   */
  hangboards: Array<{ company: number; hangboard: number }>

  /**
   * User's locale/language setting.
   * Example values: 'en-US', 'de-DE', 'nl-NL'.
   * Optional, may not be set if the user has not chosen a language.
   */
  locale?: string

  /**
   * IRCRA grade system selected by the user.
   * More info: https://github.com/wulfmann/ircra
   */
  scale:
    | 'male'
    | 'female'
    | 'vermin'
    | 'font'
    | 'ircra'
    | 'yds'
    | 'sport'
    | 'british'
    | 'tech'
    | 'ewbank'
    | 'brz'
    | 'uiaa'
    | 'uiaa_metric'
    | 'watts'

  /**
   * Index of the selected hangboard within the hangboards array.
   * Helps identify which hangboard the user is currently using.
   */
  selected: number

  /**
   * Indicates if sound is enabled.
   * True if sound effects are active during workouts.
   */
  sound: boolean

  /**
   * Indicates if voice guidance is enabled.
   * True if voice prompts are active during workouts.
   */
  speak: boolean

  /**
   * Theme ID representing the UI theme preference.
   * 0: System theme, 1: Light theme, 2: Dark theme.
   * Optional, defaults to system theme if not set.
   */
  theme?: Theme

  /**
   * Firebase Cloud Messaging token.
   * Optional, used for push notifications.
   */
  token?: string

  /**
   * Indicates if vibration feedback is enabled.
   * True if the device vibrates for notifications or feedback.
   */
  vibrate: boolean

  /**
   * Voice profile number for voice guidance.
   * Determines the voice used for spoken instructions.
   */
  voice: number

  /**
   * Indicates if the walkthrough/tutorial has been seen.
   * True if the user has completed the initial app walkthrough.
   */
  walkthrough: boolean

  /**
   * Weight system used by the user.
   * Optional, defaults to metric if not set.
   */
  weight?: Unit
}

/**
 * Represents the country configured by a user.
 */
export interface Country {
  /**
   * ISO 3166-1 alpha-2 code.
   * Example: 'US' for the United States.
   */
  alpha2: string

  /**
   * ISO 3166-1 alpha-3 code.
   * Example: 'USA' for the United States.
   */
  alpha3: string

  /**
   * International dialing codes for the country.
   * Example: ['+1'] for the United States.
   */
  countryCallingCodes: string[]

  /**
   * Currency codes used in the country.
   * Example: ['USD'] for the United States Dollar.
   */
  currencies: string[]

  /**
   * Emoji flag representing the country.
   * Optional, might not be set for all countries.
   */
  emoji?: string

  /**
   * International Olympic Committee (IOC) code.
   * Example: 'USA' for the United States.
   */
  ioc: string

  /**
   * List of language codes spoken in the country.
   * Example: ['eng'] for English.
   */
  languages: string[]

  /**
   * Full name of the country.
   * Example: 'United States'.
   */
  name: string

  /**
   * Status of the country.
   * Example: 'assigned', 'deleted', 'reserved
   */
  status: string
}

/**
 * Represents a user profile.
 */
export interface IUser {
  /**
   * Details about workouts completed by the user.
   * Optional, present only if the user has completed workouts.
   */
  completed?: {
    /**
     * Number of workouts completed by the user.
     * Represents the total count of finished workouts.
     */
    amount: number

    /**
     * Total time spent working out in seconds.
     * Includes all workouts the user has completed.
     */
    time: number

    /**
     * Total time spent on hangboard exercises in seconds.
     * Measures time specifically on hangboard workouts.
     */
    hold: number
  }

  /**
   * Details about the user's country.
   * Optional, present only if the user has set a country.
   */
  country?: Country

  /**
   * Display name of the user.
   * Can be null if the user has not set a display name.
   */
  displayName: string | null

  /**
   * Email address of the user.
   * Can be null if the user has not set an email address.
   */
  email: string | null

  /**
   * Gender of the user.
   * Optional, may not be set if the user has not specified gender.
   */
  gender?: 'male' | 'female' | 'other'

  /**
   * URL to the user's profile photo.
   * Can be null if the user has not set a profile picture.
   */
  photoURL: string | null

  /**
   * URL to the user's profile photo.
   * Optional, used when a secondary profile picture is available.
   * @deprecated
   */
  pictureURL?: string

  /**
   * Settings configured by the user.
   * Includes preferences like locale, theme, and notifications.
   */
  settings: UserSettings

  /**
   * Unique identifier for the user.
   * Optional, generated by the Firebase authentication system.
   */
  id?: string

  /**
   * Status of the user.
   * Optional, can represent various states like active, inactive, etc.
   */
  status?: string

  /**
   * Indicates if the user is subscribed to a service.
   * Optional, true if the user has an active subscription.
   */
  subscribed?: boolean

  /**
   * User's weight.
   * Optional, can be used for personalized exercise calculations.
   */
  weight?: number
}
