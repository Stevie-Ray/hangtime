interface UserSettings {
  selected: number
  hangboards: Array<{ company: number; hangboard: number }>
  scale: string
  grade: number
  sound: boolean
  speak: boolean
  voice: number
  vibrate: boolean
  walkthrough: boolean
  locale?: string
  weight?: number
}

interface User {
  displayName: string | null
  photoURL: string | null
  email: string | null
  settings: UserSettings
  id?: string
}
