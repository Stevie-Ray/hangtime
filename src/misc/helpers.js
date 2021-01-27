import UsersWorkoutsDB from '@/firebase/users-workouts-db'

/**
 * Create new user from firebase auth user infos
 */
// eslint-disable-next-line
export const createNewUserFromFirebaseAuthUser = async (firebaseAuthUser) => {
  let providerData = firebaseAuthUser
  if (!firebaseAuthUser.isAnonymous) {
    // eslint-disable-next-line prefer-destructuring
    providerData = firebaseAuthUser.providerData[0]
  }
  const { displayName, photoURL, email } = providerData
  const userDb = new UsersWorkoutsDB()
  const settings = {
    selected: 0,
    hangboards: [
      {
        company: 1,
        hangboard: 0
      }
    ],
    scale: 'font',
    grade: 12,
    sound: true,
    speak: false,
    voice: 0,
    vibrate: false,
    walkthrough: false
  }

  const user = {
    displayName,
    photoURL,
    email,
    settings
  }

  // eslint-disable-next-line no-return-await
  return await userDb.create(user, firebaseAuthUser.uid)
}
export function getImg(path) {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  return require(`@/assets/${path}`)
}
function padTime(time) {
  return (time < 10 ? '0' : '') + time
}
export function count(item) {
  let hours
  let minutes = '00'
  let seconds = '00'

  if (item) {
    hours = padTime(Math.floor(item / 3600))
    minutes = padTime(Math.floor((item % 3600) / 60))
    seconds = padTime(item % 60)
  }

  if (hours > 0) {
    return `${hours}:${minutes}:${seconds}`
  }

  return `${minutes}:${seconds}`
}

export function speak(text) {
  try {
    window.speechSynthesis.speak(text)
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.log('speechSynthesis not available', ex)
  }
}

export function sound(audio) {
  if (audio) {
    // eslint-disable-next-line global-require
    const file = require(`@/assets/sound/${audio}`) // eslint-disable-line import/no-dynamic-require
    const audioPlayer = new Audio(file)
    audioPlayer.play()
  }
}

export function shortDate(string) {
  const date = new Date(string)
  const day = date.getDate()
  const year = date.getFullYear().toString().substr(-2)
  const month = date.toLocaleString('default', { month: 'short' })

  return `${day} ${month}, ${year}`
}

export function weightConverter(weight, user) {
  if (user && user.settings.weight === 1) {
    return Math.round(weight * 2.2046)
  }
  return weight
}
