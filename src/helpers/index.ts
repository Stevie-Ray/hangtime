import imgBackgroundLight1 from '@/assets/backgrounds/background-l1.png'
import imgBackgroundLight2 from '@/assets/backgrounds/background-l2.png'
import imgBackgroundLight3 from '@/assets/backgrounds/background-l3.png'
import imgBackgroundLight4 from '@/assets/backgrounds/background-l4.png'
import imgBackgroundLight5 from '@/assets/backgrounds/background-l5.png'
import imgBackgroundLight6 from '@/assets/backgrounds/background-l6.png'
import imgBackgroundDark1 from '@/assets/backgrounds/background-d1.jpeg'
import imgBackgroundDark2 from '@/assets/backgrounds/background-d2.png'
import imgBackgroundDark3 from '@/assets/backgrounds/background-d3.jpeg'
import imgBackgroundDark4 from '@/assets/backgrounds/background-d4.png'
import imgBackgroundDark5 from '@/assets/backgrounds/background-d5.png'
import imgBackgroundDark6 from '@/assets/backgrounds/background-d6.png'
import imgBackgroundDark7 from '@/assets/backgrounds/background-d7.png'
import type { IUser } from '@/interfaces/user.interface'
import type { ExerciseJson } from '@/interfaces/exercise.json.interface'
import { Exercises, Grip, GripPosition } from '@/enums/exercise'
import { Unit } from '@/enums/unit'

/**
 * Pad time with 0 if less than 10
 * @param time
 * @return {*}
 */
function padTime(time: number) {
  return (time < 10 ? '0' : '') + time
}

/**
 * Format time
 * @param item
 * @returns
 */
export function time(item: number | undefined) {
  let hours
  let minutes = '00'
  let seconds = '00'

  if (item) {
    hours = padTime(Math.floor(item / 3600))
    minutes = padTime(Math.floor((item % 3600) / 60))
    seconds = padTime(item % 60)
  }

  if (hours && Number(hours) > 0) {
    return `${hours}:${minutes}:${seconds}`
  }

  return `${minutes}:${seconds}`
}

/**
 * Grip
 * @returns {{name: string, short: string, id: number, image: string, description: string, steps: [{name: string, description: string}]}[]}
 */
export function useGrip() {
  return [
    {
      name: 'Dead Hang',
      short: 'Dead Hang',
      id: Grip.DEAD_HANG,
      image: 'exercises/deadhang.svg',
      description:
        "A deadhang is when you hang from a sturdy bar or a hangboard with your arms straight and your feet off the ground. It's a static exercise, meaning you stay still without moving. Keep your shoulders engaged and avoid swinging.",
      steps: [
        {
          name: 'Engage Your Core',
          description:
            'Before lifting your feet off the ground, engage your core muscles to maintain proper body alignment.'
        },
        {
          name: 'Hang with Straight Arms',
          description:
            'Hang from the holds with your arms fully extended. Your body should be in a relaxed, hanging position.'
        },
        {
          name: 'Lift Your Feet',
          description:
            'Slowly lift your feet off the ground or platform, so your entire body weight is supported by your grip on the hangboard.'
        },
        {
          name: 'Maintain the Position',
          description:
            'Hang as long as you can with good form. Focus on breathing and keeping your shoulders engaged. Avoid swinging or excessive movement.'
        }
      ]
    },
    {
      name: 'Lock off - 45°',
      short: '45°',
      id: Grip.LOCK_OFF_45,
      image: 'exercises/bentarmhang.svg',
      description: 'When you hold a specific grip with your arm fully bent at a 45-degree angle.',
      steps: [
        {
          name: 'Starting Position',
          description:
            'Begin with your arms fully extended, hanging from the holds. Your feet should be off the ground, and your body should be in a vertical or slightly overhanging position.'
        },
        {
          name: 'Lock-off Movement',
          description:
            'Initiate the lock-off by bending your arms at the elbows.\n' +
            'Focus on keeping your arms at a 45° angle with your body. This means that your upper arms will be roughly halfway between fully extended and fully bent.\n' +
            'Engage your core and lower body to minimize swinging or momentum.\n' +
            'Keep your shoulders engaged and avoid letting them sag forward or rise too high.\n' +
            'Maintain a smooth, controlled movement as you pull your body upward by contracting your biceps and other upper body muscles.'
        },
        {
          name: 'Hold the Lock-off',
          description:
            'Hold the lock-off position for a set amount of time or for a specific number of seconds. The duration will depend on your current strength level and training goals. Initially, you may start with shorter durations and gradually increase them over time.'
        }
      ]
    },
    {
      name: 'Lock off - 90°',
      short: '90°',
      id: Grip.LOCK_OFF_90,
      image: 'exercises/lhang.svg',
      description: 'When you hold a specific grip with your arm fully bent at a 90-degree angle.',
      steps: [
        {
          name: 'Starting Position',
          description:
            'Begin with your arms fully extended, hanging from the holds. Your feet should be off the ground, and your body should be in a vertical or slightly overhanging position.'
        },
        {
          name: 'Lock-off Movement',
          description:
            'Initiate the lock-off by bending your arms at the elbows.\n' +
            'Focus on keeping your arms at a 90° angle with your body. This means that your upper arms will be halfway extended.\n' +
            'Engage your core and lower body to minimize swinging or momentum.\n' +
            'Keep your shoulders engaged and avoid letting them sag forward or rise too high.\n' +
            'Maintain a smooth, controlled movement as you pull your body upward by contracting your biceps and other upper body muscles.'
        },
        {
          name: 'Hold the Lock-off',
          description:
            'Hold the lock-off position for a set amount of time or for a specific number of seconds. The duration will depend on your current strength level and training goals. Initially, you may start with shorter durations and gradually increase them over time.'
        }
      ]
    },
    {
      name: 'Lock off - Full',
      short: 'Full',
      id: Grip.LOCK_OFF_FULL,
      image: 'exercises/pullup.svg',
      description: 'When you hold a specific grip with your arm fully bent.',
      steps: [
        {
          name: 'Starting Position',
          description:
            'Begin with your arms fully extended, hanging from the holds. Your feet should be off the ground, and your body should be in a vertical or slightly overhanging position.'
        },
        {
          name: 'Lock-off Movement',
          description:
            'Initiate the lock-off by bending your arms at the elbows.\n' +
            'Focus on keeping your arms fully locked off. This means that your upper arms will be fully extended.\n' +
            'Engage your core and lower body to minimize swinging or momentum.\n' +
            'Keep your shoulders engaged and avoid letting them sag forward or rise too high.\n' +
            'Maintain a smooth, controlled movement as you pull your body upward by contracting your biceps and other upper body muscles.'
        },
        {
          name: 'Hold the Lock-off',
          description:
            'Hold the lock-off position for a set amount of time or for a specific number of seconds. The duration will depend on your current strength level and training goals. Initially, you may start with shorter durations and gradually increase them over time.'
        }
      ],
      disabledExercises: [Exercises.PULLUP, Exercises.SCAP_PULL, Exercises.TYPEWRITER]
    },
    {
      name: 'Front Lever',
      short: 'Front Lever',
      id: Grip.FRONT_LEVER,
      image: 'exercises/frontlever.svg',
      description:
        'A Front Lever is an advanced exercise where you hang horizontally with your body parallel to the ground, using your core and upper body strength.',
      steps: [
        {
          name: 'Leg Position',
          description:
            "To perform a front lever on a hangboard, you'll need a horizontal bar or ledge below the hangboard. Your legs will hang down from this bar. The bar should be positioned at hip height or slightly lower."
        },
        {
          name: 'Starting Position',
          description:
            'Hang from the hangboard with your arms fully extended and your body hanging vertically. Your feet should be on the horizontal bar, and your legs should be fully extended in front of you.'
        },
        {
          name: 'Front Lever Progression',
          description:
            'Begin by tucking your knees toward your chest while maintaining a straight line from your shoulders to your hips.\n' +
            'As you get comfortable with this tucked position, start to straighten your legs slowly, extending them forward.\n' +
            'The goal is to achieve a horizontal body position with your legs straight and parallel to the ground. Your body should resemble a "lever" with your arms as the pivot point.\n' +
            'Keep your core engaged, and avoid arching or rounding your back. Aim for a straight line from your shoulders to your toes.'
        },
        {
          name: 'Hold the Front Lever',
          description:
            'Initially, you may only be able to hold a partial front lever for a few seconds. Gradually work on increasing the duration of your holds as your strength improves.'
        },
        {
          name: 'Lower Down',
          description:
            "When you're ready to end the front lever, slowly bend your knees and bring your legs back to the tucked position before lowering yourself down to the starting position."
        }
      ]
    },
    {
      name: 'No Hang',
      short: 'No Hang',
      id: Grip.NO_HANG,
      image: 'exercises/nohang.svg',
      description:
        'A no-hang involves using the holds with your feet on the ground or a support, rather than hanging from them. It helps train finger strength and grip without full-body weight.',
      steps: [
        {
          name: 'Foot Placement',
          description:
            'Position your feet on the ground or on a stable surface (e.g., a chair or bench) so that your body weight is primarily supported by your legs. Your feet should be shoulder-width apart, and your knees should be slightly bent to allow for a more natural stance.'
        },
        {
          name: 'Grip Technique',
          description:
            'Reach up to the selected holds on the hangboard and grip them using an open-handed grip. Your fingers and thumb should be positioned around the holds, simulating the grip you would use while climbing.'
        },
        {
          name: 'No-Hang Movement',
          description:
            'While keeping your feet firmly on the ground or the support, pull your body upward by flexing your fingers and forearms.\n' +
            'Focus on engaging your finger and forearm muscles to lift your body weight.\n' +
            'Hold the position for a set amount of time (e.g., 5-10 seconds) or for a specific number of repetitions, depending on your training plan.'
        },
        {
          name: 'Lower Down',
          description:
            'After each repetition, gently lower yourself back to the starting position, ensuring you maintain control throughout the movement.'
        }
      ],
      disabledExercises: [
        Exercises.PULLUP,
        Exercises.SCAP_PULL,
        Exercises.NEGATIVE_PULL,
        Exercises.TYPEWRITER,
        Exercises.L_HANG,
        Exercises.KNEES_RAISE
      ]
    }
  ]
}

/**
 * Grip Position
 * @returns {{name: string, id: number, description: string}[]}
 */
export function useGripPosition() {
  return [
    {
      name: 'Open Handed',
      id: GripPosition.OPEN_HANDED,
      description:
        'Fingers are extended and relaxed, with minimal flexion at the finger joints. This is the most natural and least stressful grip position.'
    },
    {
      name: 'Half Crimp',
      id: GripPosition.HALF_CRIMP,
      description:
        'Fingers are bent at the first joint (proximal interphalangeal joint) to approximately 90 degrees, while the second joint remains relatively straight.'
    },
    {
      name: 'Full Crimp',
      id: GripPosition.FULL_CRIMP,
      description:
        'Fingers are maximally bent at both the first and second joints, creating maximum tension and engagement of the finger flexors.'
    }
  ]
}

let cachedExercises: ExerciseJson[] | null = null

/**
 * Get sorted exercises. Cached after initial load.
 * @returns {ExerciseJson[]}
 */
export function useExercises(): ExerciseJson[] {
  // If exercises have been loaded and sorted before, return them directly.
  if (cachedExercises) {
    return cachedExercises
  }

  const modules = import.meta.glob('@/helpers/exercises/*.json', {
    eager: true
  })

  // Convert the imported modules to an array of ExerciseJson objects
  const exercises: ExerciseJson[] = Object.values(modules).map((mod) => {
    return (mod as { default: ExerciseJson }).default
  })

  // Sort the exercises by id according to our custom logic
  cachedExercises = sortExercises(exercises)

  return cachedExercises
}

/**
 * Sort exercises based on the legacy order.
 */
function sortExercises(exercises: ExerciseJson[]): ExerciseJson[] {
  // Map each exercise id to a numeric order
  const desiredOrder: Record<string, number> = {
    Pullups: 0,
    'Scapular_Pull-Up': 1,
    'Negative_Pull-Up': 2,
    'Typewriter_Pull-Up': 3,
    Hanging_L_Sit: 4,
    Hanging_Leg_Raise: 5
  }

  // Exercises not in desiredOrder will go to the end (Infinity).
  return exercises.sort((a, b) => {
    const orderA = desiredOrder[a.id] ?? Infinity
    const orderB = desiredOrder[b.id] ?? Infinity
    return orderA - orderB
  })
}

// Make sure to declare the cache variable somewhere accessible.
let cachedFitnessExercises: ExerciseJson[] | undefined

/**
 * Get fitness exercises. Cached after initial load.
 * @returns {ExerciseJson[]}
 */
export function useFitnessExercises(): ExerciseJson[] {
  if (cachedFitnessExercises) {
    return cachedFitnessExercises
  }
  const modules = import.meta.glob('@/helpers/exercises.json', {
    eager: true,
    import: 'default'
  })
  const exercises = Object.values(modules)[0] as ExerciseJson[]

  cachedFitnessExercises = exercises
  return cachedFitnessExercises
}

/**
 *
 * @param dark
 * @return {string}
 */
export function useRandomImage(dark: boolean = false) {
  let images = []
  if (!dark) {
    images = [
      imgBackgroundLight1,
      imgBackgroundLight2,
      imgBackgroundLight3,
      imgBackgroundLight4,
      imgBackgroundLight5,
      imgBackgroundLight6
    ]
  } else {
    images = [
      imgBackgroundDark1,
      imgBackgroundDark2,
      imgBackgroundDark3,
      imgBackgroundDark4,
      imgBackgroundDark5,
      imgBackgroundDark6,
      imgBackgroundDark7
    ]
  }

  const randomIndex = Math.floor(Math.random() * images.length)
  return images[randomIndex] || images[0] || ''
}

// export function sound(audio) {
//     if (audio) {
//         // eslint-disable-next-line global-require
//         const file = new URL(`/src/assets/sound/${audio}`, import.meta.url).href
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

export function weightConverter(weight: number, user: IUser) {
  if (user.settings?.weight === Unit.Imperial) {
    return Math.round(weight * 2.2046)
  }
  return weight
}

export function weightUnit(user: IUser) {
  if (user.settings?.weight === Unit.Imperial) {
    return 'lbs'
  }
  return 'kg'
}
