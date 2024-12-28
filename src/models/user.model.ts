import { Country, IUser, UserSettings } from '@/interfaces/authentication.interface'
import { BaseModel } from './base.model'

export class User extends BaseModel implements IUser {
  displayName: string
  email: string
  photoURL: string
  settings: UserSettings
  id: string
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

    this.displayName = user.displayName || ''
    this.email = user.email || ''
    this.photoURL = user.photoURL || ''
    this.settings = user.settings || {
      grade: 0,
      hangboards: [],
      scale: 'font',
      selected: 0,
      sound: true,
      speak: false,
      vibrate: true,
      voice: 0,
      walkthrough: false
    }
    this.id = user.id || ''

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
