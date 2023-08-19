/**
 *
 * @param time
 * @return {*}
 */
// eslint-disable-next-line no-shadow
function padTime(time) {
  return (time < 10 ? '0' : '') + time
}

/**
 *
 * @param item
 * @return {string}
 */
export function time(item) {
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

/**
 *
 * @return {[{image: string, name: string, short: string, description: string, id: number},{image: string, name: string, short: string, description: string, id: number},{image: string, name: string, short: string, description: string, id: number},{disabledExercises: number[], image: string, name: string, short: string, description: string, id: number},{image: string, name: string, short: string, description: string, id: number},null]}
 */
export function useGrip() {
  return [
    {
      name: 'Dead Hang',
      short: 'Dead Hang',
      id: 0,
      image: 'exercises/deadhang.svg',
      description: 'Arms are fully extended'
    },
    {
      name: 'Lock off - 45°',
      short: '45°',
      id: 1,
      image: 'exercises/bentarmhang.svg',
      description: 'Arms in a 45° bent position'
    },
    {
      name: 'Lock off - 90°',
      short: '90°',
      id: 2,
      image: 'exercises/lhang.svg',
      description: 'Arms in a 90° bent position'
    },
    {
      name: 'Lock off - Full',
      short: 'Full',
      id: 3,
      image: 'exercises/pullup.svg',
      description: 'Arms in a full bent position',
      disabledExercises: [1, 2, 4]
    },
    {
      name: 'Front Lever',
      short: 'Front Lever',
      id: 4,
      image: 'exercises/frontlever.svg',
      description: 'Body completely horizontal, facing upwards'
    },
    {
      name: 'No Hang',
      short: 'No Hang',
      id: 5,
      image: 'exercises/nohang.svg',
      description: 'Feet on the ground, pull with your fingers',
      disabledExercises: [1, 2, 3, 4, 5, 6]
    }
  ]
}

/**
 *
 * @return {[{name: string, description: string, id: number, type: string},{name: string, description: string, id: number, type: string},{name: string, description: string, id: number, type: string},{name: string, description: string, id: number, type: string},{name: string, description: string, id: number, type: string},null]}
 */
export function useExercises() {
  return [
    {
      name: 'Pull-up',
      description: 'Pull yourself up towards the hangboard',
      id: 1,
      type: 'arms'
    },
    {
      name: 'Scrap Pull',
      description: 'Pull up with shoulders only, without bending arms',
      id: 2,
      type: 'arms'
    },
    {
      name: 'Negative Pull',
      description: 'Downward section of a Pull-up',
      id: 3,
      type: 'arms'
    },
    {
      name: 'Typewriter',
      description: 'Full lock off, go from side to side',
      id: 4,
      type: 'arms'
    },
    {
      name: 'L-Hang',
      description: 'Legs are in a 90° bent position',
      id: 5,
      type: 'legs'
    },
    {
      name: 'Knee raise',
      description: 'Raise your knee upwards ',
      id: 6,
      type: 'legs'
    }
  ]
}

/**
 *
 * @param dark
 * @return {string}
 */
export function useRandomImage(dark = false) {
  let images = [
    'https://lh3.googleusercontent.com/vU7FQyNNQ8RA-9zCbZBkQKRRwXMPgfAsUH8HacOAiwdL_aK1hgH6pVhA5VWfgebB0iiImRLDNf8kg9PkBpJzhkKYOA0W4Vw6WurASXV6voDw23GJLg=w960',
    'https://lh3.googleusercontent.com/ahLnUnZO52ILvV6bYIXlSKqv_DIG_uC22fCqODUSDyD4GXyECt4_Tsx-RrhAtpYihrw4xYakIOZs5NG9H_b_0SijEUdbWEtf20cspN-qTCiLSghXCUo=w960',
    // 'https://lh3.googleusercontent.com/zQXC4ZwVUA3GFP6oWjRrrBmQXGUF4ivC5Te-AqK9NPihA5oLEkLbVyQiW3Wi3gIbOl4xjqWP1GpTG6GSdi1FYRFFwJyJO3_JLMaFSOiLyJaHk5knWJfq=w960',
    'https://lh3.googleusercontent.com/1qunnpRZ_uridw9L8XI8RRKyRMHQ5npx4F4fFywzZpneckwd8T_t1WDhDu2ZbPlIV0XmauzfANMGJSb3VDBiB7sFxiFhiU7rSX3BQQhC5KY1UYjXPD8=w960',
    'https://lh3.googleusercontent.com/xA-uPF7vBzResUgmqwRGdzQfpLI7THZNLhC5wrEe5d_4H_zLYR3FeO1A_ADSCefvvtvoM9QMB4Jt6pr3x0gqs2QuXN1Xd_iIz38qDPvd3jlkSlfZCA=w960',
    'https://lh3.googleusercontent.com/gK__LLaM4jqISqweP0_fxKpBhJuJgSJPqb7wuwRyqMwSBRnj1RJtgXrw69gdLsy2lyH33idBUO5whDJl1TYaHT50hMZc-tj1L49Iq0ctbynuU-0FbFk=w960',
    // 'https://lh3.googleusercontent.com/aLTg-FT4Ocgvjw1B_i3fOVK-rWoV3C7XCHyBkKwSbJFzIZtJjo-5atBHcSs9aZdHxiMw8-nP3lCnULJtFG_KdIVg7Gk-NV8sc1DJkeMRsTtir9pIu6IY=w960',
    'https://lh3.googleusercontent.com/3qHtqBY1lR0fp4IxXE72CAKXIv2VRSaYaAxYv7AmbLieFpnFw8_sBAxOoG8RwSWGJE7ErO6kIVrkZ_UrJMh86vxAmYkiF-ug6jmqKGM4UOsQTVga2w=w960'
    // 'https://lh3.googleusercontent.com/yBhP9OrxZ2HPRQ8jpeKb_gTQe8WmPkGLpjqljZcE1d-ywrTRSv-TepWeIaWYU_XnmIlQYGXekQXpWa7m6D6Ip2co8XjP9vbM_uvYGufwbgLKHAo31W-Y=w960'
  ]

  if (dark) {
    images = [
      'https://lh3.googleusercontent.com/U8dSUmCjiqUZmZoCxzBZ5oGBCqCVipJvghZZDUfRgErjMa_UKYWEAU4TwlArCrW_TLDzfuIE08tirIROhJ8OZDsFZf8DK4p7pam74PGvtqBiE0ES2gI=w960',
      'https://lh3.googleusercontent.com/1g_8dMsxYAfoZ_VS338syoSlyVpl5yD9Ho5eV7clDTqPGwaKElIciZTvzvxZeaM_-dE3vYWh6oZ4FyuUg3bRo21f6Ue56_ADwSBmh6kasSKS3EA5gQE=w960',
      'https://lh3.googleusercontent.com/BvKj8kuRZqLpqPuuZxOl4IeHv5jaD5kT1jhn3P8EMBcmzyoHRAFXsCxNH6ZeHhQG4V1F_AegXIw2cJIBmETy7eHM27IdLQe7FqEgz6NLaXflHiHM4xyh=w960',
      'https://lh3.googleusercontent.com/7ZPknFvHO9vgAdvojuxlJN9n0AbV3o6ANS6kATRMVK-fqZpwVGKjW7wCDhu1ZS7cDhE5Cjshx1djXctkFcSFtwDZQc-bD3b5ghihe4qc3u1fPbL7ii46=w960',
      'https://lh3.googleusercontent.com/NRDBavB-Et9GCaCEITN0NahQVdeTIphZvP8ud3MDl9JTCLfMqJgqT8ZQrVuQY_8uhqk2E4ZgmWLlR8MsPtIJHyc0R9cPjQlORl-p08tBzsMfWonJlw=w960',
      'https://lh3.googleusercontent.com/m8am03OY7pwMPiYPLQ4K1PimDBzWIv49tLkS5ilqBfI4GadhofpAikaOP7bfmxeLWQHIL1dan7DU8wW0ob5w1s2NKf9CXJqkkehN--SM8ROC-ZzgKA=w960',
      'https://lh3.googleusercontent.com/EhHSqOHkNmcLEZigJr37o1cA1W9JS--miJxKacOFAQZAYVEH-TtViAtiyGzfyPjmceyCSUp43W84R7liQx4std_QkbOHNTLCQHgjzxIB_LtWMnCd6fM=w960'
    ]
  }

  return images[Math.floor(Math.random() * images.length)]
}

// export function sound(audio) {
//     if (audio) {
//         // eslint-disable-next-line global-require
//         const file = require(`@/assets/sound/${audio}`) // eslint-disable-line import/no-dynamic-require
//         const audioPlayer = new Audio(file)
//         audioPlayer.play()
//     }
// }
//
// export function shortDate(string) {
//     const date = new Date(string)
//     const day = date.getDate()
//     const year = date.getFullYear().toString().substr(-2)
//     const month = date.toLocaleString('default', { month: 'short' })
//
//     return `${day} ${month}, ${year}`
// }

export function weightConverter(weight, user) {
  if (user && user.settings.weight === 1) {
    return Math.round(weight * 2.2046)
  }
  return weight
}
