import { BaseModel } from './base.model'
import { User } from './user.model'
import { Workout } from './workout.model'
import { ExerciseState } from '@/enums/exercise'

import { useWakeLock } from '@vueuse/core'
import i18n from '@/plugins/i18n'

import countSound from '@/assets/sound/count.wav'
import startSound from '@/assets/sound/start.wav'
import stopSound from '@/assets/sound/stop.wav'

const { isSupported, isActive, request, release } = useWakeLock()

/**
 * Session model
 * @class Session
 * @extends BaseModel
 * @description Represents a session in the system with its properties
 */
export class Session extends BaseModel {
  /** setTimeout timer */
  static timer: number | null = null

  /** Prepare time in seconds: Time before workout starts */
  static readonly setupTime: number = 5

  /** Audio element */
  static readonly audio: HTMLAudioElement = new Audio()

  /** Is skipping rest: True when skipping rest */
  public isSkippingRest: boolean = false

  /** Pause timer: True when timer is paused */
  public pauseTimer: boolean = false

  /** Workout that is being done */
  public readonly workout: Workout

  /** User that is doing the workout */
  public readonly user?: User | null

  /** Displayed time: Time in seconds */
  public clock: number = 0

  /** Current exercise index */
  public currentExercise: number = 0

  /** Current exercise state: PAUSE, HOLD, REST, REPEAT, DONE */
  public currentExerciseState: ExerciseState = ExerciseState.PAUSE

  /** Current exercise step repeat: Amount of times the exercise has been repeated */
  public currentExerciseStateRepeat: number = 0

  /** Clock text: Displayed time */
  public clockText: string = i18n.global.t('Press Play')

  /** Workout complete: True when workout is complete */
  public workoutComplete: boolean = false

  /** Workout complete time total: Total time worked out */
  public workoutCompleteTimeTotal: number = 0

  /** Workout complete time hanging: Time hanging */
  public workoutCompleteTimeHanging: number = 0

  constructor(workout: Workout, user?: User | null) {
    super({})

    this.workout = workout
    this.user = user
  }

  /** Get current exercise */
  get exercise() {
    return this.workout.exercises[this.currentExercise]
  }

  get exerciseNext() {
    return this.workout.exercises[this.currentExercise + 1]
  }

  /** If timer is paused */
  get isTimerActive() {
    return Session.timer === null ? false : true
  }

  /** Setup timer: Countdown before workout starts, then start workout */
  async setupTimer() {
    // init audio on button click
    if (Session.audio) {
      if (import.meta.env.MODE !== 'production') {
        Session.audio.volume = 0.25
      }
      Session.audio.autoplay = true
      Session.audio.preload = 'auto'
      // audio.type = 'audio/wav'
      Session.audio.crossOrigin = 'anonymous'
      Session.audio.src =
        'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'
    }

    await this.requestWakeLock()

    // setup workout with initial countdown before workout start
    this.clock = Session.setupTime
    // start countdown
    Session.timer = window.setInterval(() => {
      if (!this.pauseTimer) {
        this.countDown()
        this.clock -= 1
        if (this.clock === -1) {
          if (Session.timer !== null) {
            clearInterval(Session.timer)
            Session.timer = null
          }
          // max exercise or movement
          if (
            this.exercise &&
            (this.exercise.max || (this.exercise.exercise && this.exercise.exercise !== 0))
          ) {
            this.clock = 0
          } else {
            if (this.exercise) {
              this.clock = this.exercise.hold - 1
            }
          }
          // start when setup is done
          this.startWorkout()
        }
      }
    }, 1000)
    // set clock text
    if (!this.pauseTimer) {
      this.clockText = i18n.global.t('Get ready')
    }
  }

  /** Start workout: Start workout timer */
  async startWorkout() {
    await this.requestWakeLock()
    // Setup timer / loop
    Session.timer = window.setInterval(() => {
      if (!this.pauseTimer) this.exerciseSteps()
    }, 1000)
    // Count up or down based on exercise type
    if (
      this.exercise &&
      (this.exercise.max || (this.exercise.exercise && this.exercise.exercise !== 0))
    ) {
      this.clock -= 1
    } else {
      this.clock += 1
    }
    // Set initial exercise state
    this.currentExerciseState = ExerciseState.HOLD
    // Initally start exercise steps before loop starts
    this.exerciseSteps()
  }

  /** Exercise pause */
  exercisePause() {
    if (this.clock > Session.setupTime) {
      this.clockText = i18n.global.t('Pause')
    } else {
      this.clockText = i18n.global.t('Get ready')
    }
    this.countDown()
  }

  /** Exercise hold */
  exerciseHold() {
    if (
      this.exercise &&
      (this.exercise.max || (this.exercise.exercise && this.exercise.exercise !== 0))
    ) {
      this.clockText = i18n.global.t('Go')
    } else {
      this.clockText = i18n.global.t('Hold')
    }
    if (
      this.clock === 1 &&
      !(
        this.exercise &&
        (this.exercise.max || (this.exercise.exercise && this.exercise.exercise !== 0))
      )
    ) {
      this.vibratePhone()
      this.playSound(stopSound)
    }
  }

  /** Exercise rest */
  exerciseRest() {
    if (this.clock > Session.setupTime) {
      this.clockText = i18n.global.t('Rest')
    } else {
      this.clockText = i18n.global.t('Get ready')
    }
    this.countDown()
    if (this.clock === 1) {
      if (this.exercise && this.currentExerciseStateRepeat - 1 !== this.exercise.repeat) {
        this.currentExerciseStateRepeat += 1
      }
    }
  }

  /** Stop timer */
  stopTimer() {
    if (isActive.value) {
      this.releaseWakeLock()
    }
    if (Session.timer !== null) {
      clearInterval(Session.timer)
      Session.timer = null
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      window.speechSynthesis.resume()
    }
  }

  /** Exercise done: Set workout complete to true and stop timer */
  exerciseDone() {
    this.clockText = i18n.global.t('Done')

    this.workoutComplete = true
    this.stopTimer()
  }

  /** Check if there is an exercise (prev or next) */
  hasExercise(type: 'prev' | 'next') {
    const setupTimers = () => {
      if (this.currentExercise === 0) {
        this.clock = 0
      }
      if (this.currentExercise !== 0 && this.exercise) {
        this.clock = this.exercise.pause - 1
      }
      this.currentExerciseState = ExerciseState.PAUSE
      this.currentExerciseStateRepeat = 0
      this.exercisePause()

      return true
    }

    if (type === 'next') {
      // if there is another exercise

      if (this.workout?.exercises && this.currentExercise !== this.workout.exercises.length - 1) {
        this.currentExercise += 1
        setupTimers()
      }
    }
    if (type === 'prev') {
      if (this.currentExercise > 0) {
        this.currentExercise -= 1
        setupTimers()
      }
    }
    return false
  }

  /** Exercise steps: Go to all excerises in a workout and all there states / steps: PAUSE, HOLD, REST, REPEAT, DONE */
  exerciseSteps() {
    switch (this.currentExerciseState) {
      case ExerciseState.PAUSE:
        this.workoutCompleteTimeTotal += 1
        if (this.clock > 0) {
          this.exercisePause()
          this.clock -= 1
          break
        }
        // reset skip
        this.isSkippingRest = false
        if (
          this.exercise &&
          (this.exercise.max || (this.exercise.exercise && this.exercise.exercise !== 0))
        ) {
          this.clock = 0
        } else {
          if (this.exercise) {
            this.clock = this.exercise.hold - 1
          }
        }
        this.currentExerciseState = ExerciseState.HOLD
        this.exerciseHold()
        break
      case ExerciseState.HOLD:
        this.workoutCompleteTimeTotal += 1
        this.workoutCompleteTimeHanging += 1
        if (
          this.exercise &&
          (this.exercise.max || (this.exercise.exercise && this.exercise.exercise !== 0))
        ) {
          this.exerciseHold()
          this.clock += 1
          break
        } else if (this.clock > 0) {
          this.exerciseHold()
          this.clock -= 1
          break
        }
        // check if exercise has to repeat
        if (this.exercise && this.exercise.repeat > 0) {
          this.clock = this.exercise.rest - 1
          this.currentExerciseState = ExerciseState.REST
          this.exerciseRest()
          break
        }
        if (this.hasExercise('next')) {
          break
        }
        this.currentExerciseState = ExerciseState.DONE
        break
      case ExerciseState.REST:
        this.workoutCompleteTimeTotal += 1
        if (this.clock > 0) {
          this.exerciseRest()
          this.clock -= 1
          break
        }
        // reset skip
        this.isSkippingRest = false
        // repeat exercise
        if (this.exercise && this.exercise.repeat > 0) {
          if (this.exercise.max || (this.exercise.exercise && this.exercise.exercise !== 0)) {
            this.clock = 0
          } else {
            if (this.exercise) {
              this.clock = this.exercise.hold - 1
            }
          }
          this.currentExerciseState = ExerciseState.REPEAT
          this.exerciseHold()
          break
        }
        if (this.hasExercise('next')) {
          break
        }
        this.currentExerciseState = ExerciseState.DONE
        break
      case ExerciseState.REPEAT:
        this.workoutCompleteTimeTotal += 1
        this.workoutCompleteTimeHanging += 1
        if (
          this.exercise &&
          (this.exercise.max || (this.exercise.exercise && this.exercise.exercise !== 0))
        ) {
          this.clock += 1
          break
        }
        if (this.clock > 0) {
          this.exerciseHold()
          this.clock -= 1
          break
        }
        if (this.exercise && this.currentExerciseStateRepeat !== this.exercise.repeat) {
          this.clock = this.exercise.rest - 1
          this.currentExerciseState = ExerciseState.REST

          this.exerciseRest()
          break
        }
        if (this.hasExercise('next')) {
          break
        }
        this.currentExerciseState = ExerciseState.DONE
        break
      case ExerciseState.DONE:
        this.exerciseDone()
        break
      default:
        break
    }
  }

  /** Count down */
  countDown() {
    // if (this.clock === 15) {
    //   if (this.user.settings?.speak) {
    //     this.speakText(i18n.global.t('Get ready'))
    //   } else {
    //     this.playSound(countSound)
    //   }
    // }
    if (this.clock <= 3 && this.clock > 1) {
      if (this.user?.settings?.speak) {
        this.speakText(`${this.clock - 1}`)
      } else {
        this.playSound(countSound)
      }
    }
    if (this.clock === 1) {
      this.vibratePhone()
      this.playSound(startSound)
      this.speakText(i18n.global.t('Go'))
    }
  }

  /** Speak text */
  speakText(text: string) {
    if (this.user?.settings?.speak && 'speechSynthesis' in window) {
      let voiceList = window.speechSynthesis.getVoices()
      if (this.user?.settings?.locale) {
        voiceList = voiceList.filter((voice) => {
          if (this.user?.settings?.locale) {
            return voice.lang.includes(this.user.settings.locale.substring(0, 2))
          }
          return voice.lang
        })
      } else {
        voiceList = voiceList.filter((voice) => /^(en|EN|US)/.test(voice.lang))
      }
      const utterance = new window.SpeechSynthesisUtterance()
      utterance.text = text
      utterance.voice = voiceList[this.user.settings.voice]

      try {
        window.speechSynthesis.speak(utterance)
      } catch (ex) {
        console.log('speechSynthesis not available', ex)
      }
    }
  }

  /** Play sound */
  playSound(path: string) {
    if (this.user?.settings?.sound && Session.audio) {
      // Add error handling and remove event listener after play
      const playHandler = () => {
        Session.audio.play().catch((err: Error) => console.warn('Audio playback failed:', err))
        Session.audio.removeEventListener('canplaythrough', playHandler)
      }
      Session.audio.src = path
      Session.audio.addEventListener('canplaythrough', playHandler)
      // Add timeout to prevent hanging
      setTimeout(() => {
        Session.audio.removeEventListener('canplaythrough', playHandler)
      }, 2000)
    }
  }

  /** Vibrate phone */
  vibratePhone() {
    if ('vibrate' in navigator) {
      if (this.user?.settings?.vibrate) navigator.vibrate([80, 40, 120])
    }
  }

  /** Skip rest disabled */
  skipRestDisabled() {
    return (
      !(
        (this.currentExerciseState === ExerciseState.REST ||
          this.currentExerciseState === ExerciseState.PAUSE) &&
        this.clock >= Session.setupTime
      ) || this.clockText === i18n.global.t('Go')
    )
  }

  /** Skip rest */
  skipRest() {
    this.clock = Session.setupTime
    this.isSkippingRest = true
  }

  /** Complete current exercise disabled */
  completeCurrentExerciseDisabled() {
    return (
      this.clockText !== i18n.global.t('Go') ||
      this.exercise?.max === false ||
      (this.exercise?.exercise && this.exercise.exercise === 0)
    )
  }

  /** Complete current exercise */
  completeCurrentExercise() {
    this.vibratePhone()
    this.playSound(stopSound)
    if (this.currentExerciseState === ExerciseState.HOLD) {
      // check if exercise has to repeat
      if (this.exercise?.repeat > 0) {
        this.clock = this.exercise.rest - 1
        this.currentExerciseState = ExerciseState.REST
        return
      }
    }
    if (this.currentExerciseState === ExerciseState.REPEAT) {
      if (this.exercise && this.currentExerciseStateRepeat !== this.exercise?.repeat) {
        this.clock = this.exercise.rest - 1
        this.currentExerciseState = ExerciseState.REST
        return
      }
    }

    if (this.hasExercise('next')) {
      return
    }
    this.currentExerciseState = ExerciseState.DONE
  }

  /** Request wake lock */
  async requestWakeLock() {
    try {
      if (isSupported.value && !isActive.value) {
        request('screen')
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`${err.name}, ${err.message}`)
      }
    }
  }

  /** Release wake lock */
  async releaseWakeLock() {
    try {
      if (isSupported.value && isActive.value) {
        release()
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`${err.name}, ${err.message}`)
      }
    }
  }
}
