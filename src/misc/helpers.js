import UsersDB from '@/firebase/users-db'

/**
 * Create new user from firebase auth user infos
 */
// eslint-disable-next-line
export const createNewUserFromFirebaseAuthUser = async firebaseAuthUser => {
  const providerData = firebaseAuthUser.providerData[0]
  const { displayName, photoURL, email } = providerData
  const userDb = new UsersDB()
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
    vibrate: false
  }

  const user = {
    displayName,
    photoURL,
    email,
    settings
  }

  const userData = await userDb.create(user, firebaseAuthUser.uid)

  return userData
}
export function getImg(path) {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  return require(`@/assets/${path}`)
}
function padTime(time) {
  return (time < 10 ? '0' : '') + time
}
export function count(item) {
  let minutes = '00'
  let seconds = '00'

  if (item) {
    minutes = padTime(Math.floor(item / 60))
    seconds = padTime(item - minutes * 60)
  }

  return `${minutes}:${seconds}`
}

export function speak(text) {
  const utterance = new window.SpeechSynthesisUtterance(text)
  // utterance.voice = this.voiceList[this.settings.voice];
  try {
    window.speechSynthesis.speak(utterance)
  } catch (ex) {
    console.log('speechSynthesis not available', ex)
  }
}

export function sound(audio) {
  if (audio) {
    // eslint-disable-next-line global-require
    const file = require(`@/assets/${audio}`) // eslint-disable-line import/no-dynamic-require
    const audioPlayer = new Audio(file)
    audioPlayer.play()
  }
}

export function shortDate(string) {
  const date = new Date(string)
  const day = date.getDate()
  const month = date.toLocaleString('en-us', { month: 'short' })

  return `${day} ${month}`
}
