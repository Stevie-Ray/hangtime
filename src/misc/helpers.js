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

  return await userDb.create(user, firebaseAuthUser.uid)
}
export function getImg(path) {
  return require(`@/assets/${path}`) // eslint-disable-line import/no-dynamic-require
}
function padTime(time) {
  return (time < 10 ? '0' : '') + time
}
export function count(item) {
  // const total = []
  // let x = 0
  // if (item.time) {
  //   total.push(item.time)
  // } else {
  //   // single exercise
  //   let time = item.pause + item.hold + item.rest
  //   if (item.repeat > 0) {
  //     time = item.pause + (item.hold + item.rest) * item.repeat
  //   }
  //   total.push(time) // the value of the current key.
  // }
  //
  // x = total.reduce((total, num) => total + num, 0)

  let minutes = '00',
    seconds = '00'

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

export function sound(sound) {
  if (sound) {
    const file = require(`@/assets/${sound}`) // eslint-disable-line import/no-dynamic-require
    const audio = new Audio(file)
    audio.play()
  }
}

export function shortDate(string) {
  const date = new Date(string)
  const day = date.getDate()
  const month = date.toLocaleString('en-us', { month: 'short' })

  return `${day} ${month}`
}
