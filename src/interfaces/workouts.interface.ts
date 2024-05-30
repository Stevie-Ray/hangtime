export interface Workout {
  id?: string
  name: string
  description: string
  level: number
  hangboard: string
  company: string
  exercises: Array<any>
  time: number
  share: boolean
  video: string
  subscribers: Array<string>
  user: {
    displayName: string
    grade: number
    id: string
    photoURL: string
  }
  updateTimestamp?: any
}

export interface Leaderboard {
  rank: string
  leaderboard: Array<any>
}
