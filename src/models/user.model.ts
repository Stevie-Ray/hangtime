import type { Country, IUser, UserSettings } from '@/interfaces/user.interface'
import { BaseModel } from './base.model'

/**
 * User model
 * @class User
 * @extends BaseModel
 * @implements IUser
 * @description Represents a user in the system with their profile information and settings
 */
export class User extends BaseModel implements IUser {
  displayName: string | null
  email: string | null
  photoURL: string | null
  settings: UserSettings
  completed?: {
    amount: number
    time: number
    hold: number
  }
  country?: Country
  gender?: 'male' | 'female' | 'other'
  pictureURL?: string
  status?: string
  subscribed?: boolean
  weight?: number

  constructor(user: Partial<IUser>) {
    super(user)

    this.displayName = user.displayName || null
    this.email = user.email || null
    this.photoURL = user.photoURL || null
    this.settings = {
      grade: user.settings?.grade || 12,
      hangboards: user.settings?.hangboards || [
        // default hangboard: Beastmaker 1000 Series
        {
          company: 1,
          hangboard: 0
        }
      ],
      scale: user.settings?.scale || 'font',
      selected: user.settings?.selected || 0,
      sound: user.settings?.sound || true,
      speak: user.settings?.speak || false,
      vibrate: user.settings?.vibrate || false,
      voice: user.settings?.voice || 0,
      walkthrough: user.settings?.walkthrough || false
    }
    // Initialize optional properties, deleteing is required for Firebase
    if (user.completed !== undefined) this.completed = user.completed
    else delete this.completed
    if (user.country !== undefined) this.country = user.country
    else delete this.country
    if (user.gender !== undefined) this.gender = user.gender
    else delete this.gender
    if (user.pictureURL) this.pictureURL = user.pictureURL
    else delete this.pictureURL
    if (user.status !== undefined) this.status = user.status
    else delete this.status
    if (user.subscribed !== undefined) this.subscribed = user.subscribed
    else delete this.subscribed
    if (user.weight !== undefined) this.weight = user.weight
    else delete this.weight
    // Initialize optional setting properties, deleteing is required for Firebase
    if (user.settings?.hangboard !== undefined) this.settings.hangboard = user.settings.hangboard
    else delete this.settings.hangboard
    if (user.settings?.locale !== undefined) this.settings.locale = user.settings.locale
    else delete this.settings.locale
    if (user.settings?.theme !== undefined) this.settings.theme = user.settings.theme
    else delete this.settings.theme
    if (user.settings?.token !== undefined) this.settings.token = user.settings.token
    else delete this.settings.token
    if (user.settings?.weight !== undefined) this.settings.weight = user.settings.weight
    else delete this.settings.weight
  }
}
