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
import { IUser } from '@/interfaces/authentication.interface'

/**
 *
 * @param time
 * @return {*}
 */

function padTime(time: number) {
  return (time < 10 ? '0' : '') + time
}

/**
 *
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
      id: 1,
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
      id: 2,
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
      id: 3,
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
      disabledExercises: [1, 2, 4]
    },
    {
      name: 'Front Lever',
      short: 'Front Lever',
      id: 4,
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
      id: 5,
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
      id: 1,
      type: 'arms',
      description:
        'A "Pull-up" involves grabbing holds and pulling your body upward while hanging from the holds.',
      steps: [
        {
          name: 'Hang Position',
          description:
            'Hang from the selected holds with your arms fully extended, and your feet off the ground. Your body should be in a straight line from your head to your heels.'
        },
        {
          name: 'Pull-up Movement',
          description:
            'Initiate the pull-up by bending your arms at the elbows, bringing your chest closer to the hangboard.\n' +
            'Focus on engaging your back, shoulders, biceps, and finger strength as you pull your body upward.\n' +
            'Aim to bring your chin above the level of the hangboard.\n' +
            'Keep your core engaged and maintain a controlled, smooth movement throughout the pull-up.'
        },
        {
          name: 'Hold the Top Position',
          description:
            "Once you've pulled yourself up, hold the top position briefly, maintaining the bent-arm position with your chin above the hangboard. This will help you work on static strength and control."
        },
        {
          name: 'Lower Down',
          description:
            'Slowly extend your arms to lower yourself back to the starting position. Keep the movement controlled and avoid dropping suddenly.'
        }
      ]
    },
    {
      name: 'Scap Pull',
      id: 2,
      type: 'arms',
      description:
        'A "Scapular Pull-up" is an exercise that targets scapular (shoulder blade) strength and stability. Hang from the hold with straight arms and without bending your elbows, squeeze your shoulder blades together to lift your body slightly.',
      steps: [
        {
          name: 'Grip the Hold',
          description:
            'Stand in front of the hangboard and reach up to grip the chosen hold with both hands. Your arms should be fully extended, and your palms should be facing away from you.'
        },
        {
          name: 'Engage Your Scapulae',
          description:
            "This is the key part of the Scapular Pull-up. Without bending your arms, initiate the movement by engaging your shoulder blades (scapulae). Imagine trying to pinch your shoulder blades together and downward as if you're trying to squeeze a pencil between them. This will retract and depress your shoulder blades."
        },
        {
          name: 'Pull Your Chest Towards the Hold',
          description:
            'As your scapulae engage, your chest should naturally move closer to the hold. This is the scapular pull-up motion. Focus on using your back muscles, particularly the muscles between your shoulder blades.'
        },
        {
          name: 'Hold and Squeeze',
          description:
            'Once your shoulder blades are fully engaged, hold this position for a second or two, squeezing your shoulder blades together as hard as you can.'
        }
      ]
    },
    {
      name: 'Negative Pull',
      id: 3,
      type: 'arms',
      description:
        'A "Negative Pull-up" involves starting at the top, gripping a hold, and then lowering your body slowly.',
      steps: [
        {
          name: 'Grip the Hold',
          description:
            'Stand in front of the hangboard and reach up to grip the chosen hold with both hands. Your arms should be fully extended, and your palms should be facing away from you.'
        },
        {
          name: 'Jump Up or Use a Step',
          description:
            'To get into the starting position for the negative pull-up, you can either jump up to the hold or use a step to assist you in reaching the hold. Your chin should be above the hangboard.'
        },
        {
          name: 'Engage Your Muscles',
          description:
            'With your chin above the hangboard, engage your core and back muscles to maintain a stable position.'
        },
        {
          name: 'Lower Slowly',
          description:
            'Now, slowly and in a controlled manner, lower your body down toward the ground. Focus on using your back and arm muscles to resist gravity. Your goal is to take about 5-10 seconds to lower your body completely.'
        },
        {
          name: 'Full Extension',
          description:
            "When your arms are fully extended and you're hanging from the hold with straight arms, the negative pull-up is complete."
        }
      ]
    },
    {
      name: 'Typewriter',
      id: 4,
      type: 'arms',
      description:
        'A "Typewriter" is when you move your hands horizontally between holds, like the keys of a typewriter.',
      steps: [
        {
          name: 'Shift to One Side',
          description:
            'Begin the Typewriter by shifting your body to one side while keeping your arms straight. The goal is to move your chest and head over one of the holds while maintaining a straight-arm hang on the other.'
        },
        {
          name: 'Rotate Your Head and Chest',
          description:
            "As you shift your body to one side, start rotating your head and chest in that direction. Your goal is to get your head and chest directly above the hold you're moving toward."
        },
        {
          name: 'Reach and Hold',
          description:
            'Once your head and chest are above the hold, reach out with your free hand and grip the hold firmly. Your other hand should still be holding the starting hold.'
        },
        {
          name: 'Reverse the Movement',
          description:
            'Now, reverse the movement by shifting your body and rotating your head and chest back to the center position while maintaining a grip on both holds. Your arms should remain straight.'
        },
        {
          name: 'Shift to the Other Side',
          description:
            'Repeat the process on the opposite side, shifting your body, rotating your head and chest, and reaching for the other hold.'
        },
        {
          name: 'Continue Alternating',
          description:
            'Continue to alternate between the two holds, moving from side to side in a controlled and deliberate manner. Focus on maintaining stability and control throughout the exercise.'
        }
      ]
    },
    {
      name: 'L-Hang',
      id: 5,
      type: 'legs',
      description: 'An "L-Hang" is when you hang with your arms and legs forming an "L" shape.',
      steps: [
        {
          name: 'Hanging Position',
          description:
            'Initially, hang with both feet on the ground to help you get into the correct position. Your body should form an "L" shape, with your legs extended horizontally and your torso hanging vertically.'
        },
        {
          name: 'Lift Your Legs',
          description:
            "Once you're comfortable with the hanging position, slowly raise your legs, keeping them straight. Your goal is to bring them up to hip height or as close to forming an 'L' shape as possible. This engages your core and adds difficulty to the exercise."
        },
        {
          name: 'Hold and Maintain',
          description:
            'Maintain the L-Hang position for as long as you can with proper form. Focus on keeping your arms straight and your core engaged. Aim to hold for at least 10-15 seconds when you start, and gradually increase the duration as you get stronger.'
        },
        {
          name: 'Lower Your Legs',
          description:
            'Gently lower your legs back to the starting position, keeping them straight. Avoid swinging or using momentum during this phase.'
        }
      ]
    },
    {
      name: 'Knee raise',
      id: 6,
      type: 'legs',
      description: 'A "Knee raise" involves raising your knees toward your chest while hanging.',
      steps: [
        {
          name: 'Hanging Position',
          description:
            'Hang from the holds with your arms fully extended, maintaining a straight body position.'
        },
        {
          name: 'Raise Your Knees',
          description:
            'Begin the knee raise by slowly lifting your knees toward your chest. Aim to bring your knees as high as you can without compromising your form or swinging excessively.'
        },
        {
          name: 'Controlled Movement',
          description:
            'Ensure that the knee raise is a controlled movement. Avoid using momentum or swinging your body during the exercise.'
        },
        {
          name: 'Hold and Lowe',
          description:
            'Once your knees are at their highest point, hold the position for a second or two to engage your core further. Then, slowly lower your knees back to the starting position with your legs fully extended.'
        }
      ]
    }
  ]
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

  return images[Math.floor(Math.random() * images.length)]
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
  if (user.weight === 1) {
    return Math.round(weight * 2.2046)
  }
  return weight
}
