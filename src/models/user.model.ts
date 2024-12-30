import { Country, IUser, UserSettings } from '@/interfaces/authentication.interface'
import { BaseModel } from './base.model'

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
  gender?: string
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

    // Initialize optional properties
    if (user.completed) this.completed = user.completed
    if (user.country) this.country = user.country
    if (user.gender) this.gender = user.gender
    if (user.pictureURL) this.pictureURL = user.pictureURL
    if (user.status) this.status = user.status
    if (user.subscribed) this.subscribed = user.subscribed
    if (user.weight) this.weight = user.weight
  }
}
