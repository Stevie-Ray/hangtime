<script setup lang="ts">
import { computed, ref, Ref, nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { stream } from '@hangtime/grip-connect'
import type { massObject } from '@hangtime/grip-connect/src/types/notify'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import NoSleep from 'nosleep.js'
import WorkoutBluetooth from '@/components/atoms/WorkoutBluetooth/WorkoutBluetooth.vue'
import WorkoutShare from '@/components/atoms/WorkoutShare/WorkoutShare.vue'
import WorkoutSubscribe from '@/components/atoms/WorkoutSubscribe/WorkoutSubscribe.vue'
import ExerciseCard from '@/components/molecules/ExerciseCard/ExerciseCard.vue'
import ExerciseAbout from '@/components/molecules/ExerciseAbout/ExerciseAbout.vue'
import WorkoutComplete from '@/components/molecules/dialog/WorkoutComplete/WorkoutComplete.vue'
import SubscribeToApp from '@/components/molecules/dialog/SubscribeToApp/SubscribeToApp.vue'
import { Workout, Exercise } from '@/interfaces/workouts.interface'
import { time } from '@/helpers'

import countSound from '@/assets/sound/count.wav'
import startSound from '@/assets/sound/start.wav'
import stopSound from '@/assets/sound/stop.wav'

import { useAuthenticationStore } from '@/stores/authentication'
import { useActivitiesStore } from '@/stores/activities'
import { useBluetoothStore } from '@/stores/bluetooth'

const { device } = storeToRefs(useBluetoothStore())

const { t } = useI18n()

const { user } = storeToRefs(useAuthenticationStore())

const { updateUser } = useAuthenticationStore()

const { createUserActivity } = useActivitiesStore()

const props = defineProps({
  workout: {
    type: Object as () => Workout
  },
  /** Quick Workout */
  quick: {
    type: Boolean,
    default: false
  }
})

const workout = ref(props.workout)

watch(
  () => props.workout,
  (newValue) => {
    workout.value = newValue
  }
)

let timer: number | null = null
const timerPaused: Ref<boolean | null> = ref(null)
const clock: Ref<number> = ref(0)
const clockText: Ref<string> = ref(t('Press Play'))
const currentExercise: Ref<number> = ref(0)
const currentExerciseStep: Ref<number> = ref(0)
const currentExerciseStepRepeat: Ref<number> = ref(0)

const audio: HTMLAudioElement = new Audio()
const noSleep: NoSleep = new NoSleep()
const setupTime: number = 5

// complete
const dialogWorkoutComplete: Ref<boolean> = ref(false)
const workoutCompleteTimeTotal: Ref<number> = ref(0)
const workoutCompleteTimeHanging: Ref<number> = ref(0)

// bluetooth
const bluetoothOutput = ref<massObject | null>(null)

const notify = (data: massObject) => {
  bluetoothOutput.value = data
}

onBeforeUnmount(() => {
  // make sure timer is disabled and speech is stopped
  if (timer !== null) clearInterval(timer)
  if (window.speechSynthesis) window.speechSynthesis.cancel()
})

const exercise = computed<Exercise | undefined>(() => {
  if (workout.value?.exercises) return workout.value.exercises[currentExercise.value]
  return undefined
})

const exerciseNext = computed<Exercise | undefined>(() => {
  if (workout.value?.exercises) return workout?.value?.exercises[currentExercise.value + 1]
  return undefined
})

const exerciseTime = computed<number>(() => {
  if (exercise.value)
    return (
      (exercise.value.hold + exercise.value.rest) * (exercise.value.repeat + 1) -
      exercise.value.rest
    )
  return 0
})

const requestWakeLock = () => {
  try {
    noSleep.enable()
  } catch (err: unknown) {
    if (err instanceof Error) {
      // eslint-disable-next-line no-console
      console.error(`${err.name}, ${err.message}`)
    }
  }
}

const speak = (text: SpeechSynthesisUtterance) => {
  try {
    window.speechSynthesis.speak(text)
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.log('speechSynthesis not available', ex)
  }
}

const speakText = (text: string) => {
  if (user.value?.settings.speak && 'speechSynthesis' in window) {
    let voiceList = window.speechSynthesis.getVoices()
    if (user.value.settings.locale) {
      voiceList = voiceList.filter((voice) => {
        if (user.value?.settings.locale) {
          return voice.lang.includes(user.value?.settings.locale.substring(0, 2))
        }
        return voice.lang
      })
    } else {
      voiceList = voiceList.filter((voice) => /^(en|EN|US)/.test(voice.lang))
    }
    const utterance = new window.SpeechSynthesisUtterance()
    utterance.text = text
    utterance.voice = voiceList[user.value?.settings.voice]
    speak(utterance)
  }
}

const playSound = (path: string, type: 'wav' | 'mp3') => {
  if (user.value?.settings.sound && audio) {
    // workaround for iOS / Safari
    if (path) {
      audio.src = path
    }
    if (type) {
      // audio.type = `audio/${type}`
    }
    audio.addEventListener('canplaythrough', () => {
      audio.play()
    })
  }
}
const vibratePhone = () => {
  if ('vibrate' in navigator) {
    if (user.value?.settings.vibrate) navigator.vibrate([80, 40, 120])
  }
}

const countDown = () => {
  // if (clock.value === 15) {
  //   if (user.value.settings?.speak) {
  //     speakText(`${t('Get ready')}!`)
  //   } else {
  //     playSound(countSound, 'wav')
  //   }
  // }
  if (clock.value <= 3 && clock.value > 1) {
    if (user.value?.settings.speak) {
      speakText(`${clock.value - 1}`)
    } else {
      playSound(countSound, 'wav')
    }
  }
  if (clock.value === 1) {
    vibratePhone()
    playSound(startSound, 'wav')
    speakText(`${t('Go')}!`)
  }
}

const pauseWorkout = () => {
  if (!timerPaused.value) {
    noSleep.disable()
  } else {
    requestWakeLock()
  }
  timerPaused.value = !timerPaused.value
}

const stopTimer = () => {
  noSleep.disable()
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
  timerPaused.value = !timerPaused.value
  if (device.value) {
    // disconnect(device.value)
  }
}

const exercisePause = () => {
  if (clock.value > setupTime) {
    clockText.value = t('Pause')
  } else {
    clockText.value = t('Get ready')
  }
  countDown()
}

const exerciseHold = () => {
  if (
    exercise.value &&
    (exercise.value.max || (exercise.value.exercise && exercise.value.exercise !== 0))
  ) {
    clockText.value = t('Go')
  } else {
    clockText.value = t('Hold')
  }
  if (
    clock.value === 1 &&
    !(
      exercise.value &&
      (exercise.value.max || (exercise.value.exercise && exercise.value.exercise !== 0))
    )
  ) {
    vibratePhone()
    playSound(stopSound, 'wav')
  }
}

const exerciseRest = () => {
  if (clock.value > setupTime) {
    clockText.value = t('Rest')
  } else {
    clockText.value = t('Get ready')
  }
  countDown()
  if (clock.value === 1) {
    if (exercise.value && currentExerciseStepRepeat.value - 1 !== exercise.value.repeat) {
      currentExerciseStepRepeat.value += 1
    }
  }
}

const updateUserCompleted = () => {
  if (user.value) {
    // check if completed object exists
    if (!user?.value?.completed) {
      user.value.completed = {
        time: 0,
        hold: 0,
        amount: 0
      }
    }
    // resolve bug
    if (Number.isNaN(user.value.completed.time)) user.value.completed.time = 0
    if (Number.isNaN(user.value.completed.hold)) user.value.completed.hold = 0
    if (Number.isNaN(user.value.completed.amount)) user.value.completed.amount = 0
    // update values
    user.value.completed.time += workoutCompleteTimeTotal.value
    user.value.completed.hold += workoutCompleteTimeHanging.value
    user.value.completed.amount += 1
    updateUser()
  }
}

const exerciseDone = () => {
  clockText.value = t('Done')
  createUserActivity({
    name: workout?.value?.name ? workout.value.name : '',
    start_date_local: new Date(),
    sport_type: 'Workout',
    elapsed_time: workoutCompleteTimeTotal.value,
    elapsed_time_hanging: workoutCompleteTimeHanging.value,
    description: workout?.value?.description ? workout.value.description : '',
    difficulty: workout?.value?.level !== undefined ? workout.value.level : null,
    type: 'Hangboarding',
    company: workout?.value?.company !== undefined ? workout.value.company : null,
    hangboard: workout?.value?.hangboard !== undefined ? workout.value.hangboard : null,
    user: workout?.value?.user?.id ? workout.value.user.id : '',
    workout: workout?.value?.id ? workout.value.id : ''
  })
  updateUserCompleted()
  // open dialog
  dialogWorkoutComplete.value = true
  // stop timers
  stopTimer()
}

const hasExercise = (type: 'prev' | 'next') => {
  const setupTimers = () => {
    nextTick(() => {
      if (currentExercise.value === 0) {
        clock.value = 0
      }
      if (currentExercise.value !== 0 && exercise.value) {
        clock.value = exercise.value.pause - 1
      }
      currentExerciseStep.value = 0
      currentExerciseStepRepeat.value = 0
      exercisePause()
    })
    return true
  }

  if (type === 'next') {
    // if there is another exercise
    // eslint-disable-next-line no-unsafe-optional-chaining
    if (workout?.value?.exercises && currentExercise.value !== workout.value.exercises.length - 1) {
      currentExercise.value += 1
      setupTimers()
    }
  }
  if (type === 'prev') {
    if (currentExercise.value > 0) {
      currentExercise.value -= 1
      setupTimers()
    }
  }
  return false
}

const skip = ref(false)

const disableSkipRest = () => {
  return (
    !(
      (clockText.value === t('Rest') || clockText.value === t('Pause')) &&
      clock.value >= setupTime
    ) || clockText.value === t('Go')
  )
}
const skipRest = () => {
  clock.value = setupTime
  skip.value = true
}

const disableMaxHold = () => {
  return (
    clockText.value !== t('Go') ||
    exercise.value?.max === false ||
    (exercise.value?.exercise && exercise.value.exercise === 0)
  )
}
const maxHold = () => {
  vibratePhone()
  playSound(stopSound, 'wav')
  // HOLD
  if (currentExerciseStep.value === 1) {
    // check if exercise has to repeat
    if (exercise.value && exercise.value.repeat > 0) {
      clock.value = exercise.value.rest - 1
      currentExerciseStep.value = 2
      if (device.value) {
        bluetoothOutput.value = null
      }
      return
    }
  }
  // REPEAT
  if (currentExerciseStep.value === 3) {
    if (exercise.value && currentExerciseStepRepeat.value !== exercise.value.repeat) {
      clock.value = exercise.value.rest - 1
      currentExerciseStep.value = 2
      if (device.value) {
        bluetoothOutput.value = null
      }
      return
    }
  }

  if (hasExercise('next')) {
    return
  }
  currentExerciseStep.value = 4
}

const exerciseSteps = () => {
  switch (currentExerciseStep.value) {
    // PAUSE
    case 0:
      workoutCompleteTimeTotal.value += 1
      if (clock.value > 0) {
        exercisePause()
        clock.value -= 1
        break
      }
      skip.value = false
      if (
        exercise.value &&
        (exercise.value.max || (exercise.value.exercise && exercise.value.exercise !== 0))
      ) {
        clock.value = 0
      } else {
        if (exercise.value) {
          clock.value = exercise.value.hold - 1
        }
      }
      if (device.value && exercise.value) {
        stream(device.value, (exercise.value.hold - 1) * 1000)
      }
      currentExerciseStep.value = 1
      exerciseHold()
      break
    // HOLD
    case 1:
      workoutCompleteTimeTotal.value += 1
      workoutCompleteTimeHanging.value += 1
      if (
        exercise.value &&
        (exercise.value.max || (exercise.value.exercise && exercise.value.exercise !== 0))
      ) {
        exerciseHold()
        clock.value += 1
        break
      } else if (clock.value > 0) {
        exerciseHold()
        clock.value -= 1
        break
      }
      // check if exercise has to repeat
      if (exercise.value && exercise.value.repeat > 0) {
        clock.value = exercise.value.rest - 1
        currentExerciseStep.value = 2
        if (device.value) {
          bluetoothOutput.value = null
        }
        exerciseRest()
        break
      }
      if (hasExercise('next')) {
        break
      }
      currentExerciseStep.value = 4
      break
    // REST
    case 2:
      workoutCompleteTimeTotal.value += 1
      if (clock.value > 0) {
        exerciseRest()
        clock.value -= 1
        break
      }
      skip.value = false
      // repeat exercise
      if (exercise.value && exercise.value.repeat > 0) {
        if (exercise.value.max || (exercise.value.exercise && exercise.value.exercise !== 0)) {
          clock.value = 0
        } else {
          if (exercise.value) {
            clock.value = exercise.value.hold - 1
          }
        }
        if (device.value && exercise.value) {
          stream(device.value, (exercise.value.hold - 1) * 1000)
        }
        currentExerciseStep.value = 3
        exerciseHold()
        break
      }
      if (hasExercise('next')) {
        break
      }
      currentExerciseStep.value = 4
      break
    // REPEAT
    case 3:
      workoutCompleteTimeTotal.value += 1
      workoutCompleteTimeHanging.value += 1
      if (
        exercise.value &&
        (exercise.value.max || (exercise.value.exercise && exercise.value.exercise !== 0))
      ) {
        clock.value += 1
        break
      }
      if (clock.value > 0) {
        exerciseHold()
        clock.value -= 1
        break
      }
      if (exercise.value && currentExerciseStepRepeat.value !== exercise.value.repeat) {
        clock.value = exercise.value.rest - 1
        currentExerciseStep.value = 2
        if (device.value) {
          bluetoothOutput.value = null
        }
        exerciseRest()
        break
      }
      if (hasExercise('next')) {
        break
      }
      currentExerciseStep.value = 4
      break
    // // NEXT / FINISH
    case 4:
      exerciseDone()
      break
    default:
      break
  }
}

const startWorkout = async () => {
  await requestWakeLock()
  // start with hold
  currentExerciseStep.value = 1
  timer = window.setInterval(() => {
    if (!timerPaused.value) exerciseSteps()
  }, 1000)
  if (
    exercise.value &&
    (exercise.value.max || (exercise.value.exercise && exercise.value.exercise !== 0))
  ) {
    clock.value -= 1
  } else {
    clock.value += 1
  }
  exerciseSteps()
}

const setupWorkout = async () => {
  await requestWakeLock()

  // give the user some time to get ready
  clock.value = setupTime
  timer = window.setInterval(() => {
    if (!timerPaused.value) {
      countDown()
      clock.value -= 1
      if (clock.value === 0) {
        if (timer !== null) {
          clearInterval(timer)
          timer = null
        }
        // max exercise or movement
        if (
          exercise.value &&
          (exercise.value.max || (exercise.value.exercise && exercise.value.exercise !== 0))
        ) {
          clock.value = 0
        } else {
          if (exercise.value) {
            clock.value = exercise.value.hold - 1
            if (device.value) {
              stream(device.value, (exercise.value.hold - 1) * 1000)
            }
          }
        }
        // start when setup is done
        startWorkout()
      }
    }
  }, 1000)
  if (!timerPaused.value) {
    clockText.value = t('Get ready')
  }
}

const startTimer = () => {
  timerPaused.value = false
  // init audio on button click
  if (audio) {
    if (import.meta.env.MODE !== 'production') {
      audio.volume = 0.25
    }
    audio.autoplay = true
    audio.preload = 'auto'
    // audio.type = 'audio/wav'
    audio.crossOrigin = 'anonymous'
    audio.src =
      'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'
  }
  setupWorkout()
}

const dialogWorkoutSubscribe = ref(true)
const canSubscribePlayBilling = ref(false)
const subscribeLimit = 30
const PAYMENT_METHOD = 'https://play.google.com/billing'
const canSubscribe = window.getDigitalGoodsService

async function canUsePlayBilling() {
  if (canSubscribe === undefined) {
    // eslint-disable-next-line no-console
    console.log("window doesn't have getDigitalGoodsService.")
    return
  }
  try {
    const service = await window.getDigitalGoodsService(PAYMENT_METHOD)
    // eslint-disable-next-line no-console
    console.log(service)
    if (service === null) {
      // eslint-disable-next-line no-console
      console.log('Play Billing is not available.')
    } else {
      // eslint-disable-next-line no-shadow
      const items = ['subscription']
      const details = await service.getDetails(items)
      // eslint-disable-next-line no-console
      console.log(details)
      if (details === null) {
        // eslint-disable-next-line no-console
        console.log('Are you running a Play Store build?')
      } else if (details.length === 0) {
        // eslint-disable-next-line no-console
        console.log('Are you running a Play Store build? 2')
      } else {
        canSubscribePlayBilling.value = true
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
}

onMounted(() => {
  canUsePlayBilling()
})
</script>

<template>
  <v-container
    v-if="workout?.exercises"
    :class="{
      rest: !timerPaused && !(currentExerciseStep === 1 || currentExerciseStep === 3),
      hang: !timerPaused && (currentExerciseStep === 1 || currentExerciseStep === 3)
    }"
    :style="{
      transition:
        clock !== 0
          ? skip
            ? 'none'
            : clockText === t('Go') && (currentExerciseStep === 1 || currentExerciseStep === 3)
              ? `width 0s linear`
              : `width ${clock}s linear`
          : 'none'
    }"
    class="position-absolute h-100 px-0 py-0 progress"
  ></v-container>
  <v-container v-if="workout?.exercises" class="position-relative">
    <v-row align="start" justify="center">
      <v-col cols="12" md="7" class="d-flex flex-column" style="min-height: 85vh">
        <v-row align="center" justify="center">
          <v-col class="text-center pb-4" cols="12" sm="8">
            <v-row align="center">
              <v-col cols="12" class="d-flex justify-space-between align-center">
                <slider-bluetooth
                  v-if="bluetoothOutput?.massLeft"
                  :stream="bluetoothOutput.massLeft"
                />
                <div class="timer w-100">
                  <div class="text-h1">
                    {{ time(clock) }}
                  </div>
                  <div class="text-h6 pt-2 mb-4" style="font-size: 1.5rem !important">
                    {{ clockText }}
                  </div>
                  <div v-if="bluetoothOutput?.massTotal" style="overflow: hidden">
                    <v-row align="center" justify="space-evenly">
                      <v-col class="text-center">
                        <div class="text-caption text-uppercase">
                          {{ t('Max') }}
                        </div>
                        <div class="text-h6">
                          <span> {{ bluetoothOutput.massMax }} KG</span>
                        </div>
                      </v-col>
                      <v-col v-if="workout?.exercises?.length > 1" class="text-center">
                        <div class="text-caption text-uppercase">
                          {{ t('Total') }}
                        </div>
                        <div class="text-h6">
                          <span> {{ bluetoothOutput.massTotal }} KG</span>
                        </div>
                      </v-col>
                      <v-col v-if="workout?.exercises" class="text-center">
                        <div class="text-caption text-uppercase">
                          {{ t('Average') }}
                        </div>
                        <div class="text-h6">
                          <span> {{ bluetoothOutput.massAverage }} KG</span>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </div>
                <slider-bluetooth
                  v-if="bluetoothOutput?.massRight"
                  :stream="bluetoothOutput.massRight"
                />
              </v-col>
            </v-row>
            <v-row class="timer" align="center" justify="space-evenly">
              <v-col class="text-center">
                <div class="text-caption text-uppercase">
                  {{ t('Time') }}
                </div>
                <div class="text-h6">
                  <span v-if="clockText === t('Go')">∞</span>
                  <span v-else>{{ time(exerciseTime) }}</span>
                </div>
              </v-col>
              <v-col v-if="workout?.exercises?.length > 1" class="text-center">
                <div class="text-caption text-uppercase">
                  {{ t('Exercise') }}
                </div>
                <div class="text-h6">{{ currentExercise + 1 }}/{{ workout?.exercises.length }}</div>
              </v-col>
              <v-col v-if="workout?.exercises" class="text-center">
                <div class="text-caption text-uppercase">
                  {{ t('Repeat') }}
                </div>
                <div v-if="exercise" class="text-h6">
                  {{ currentExerciseStepRepeat + 1 }}/{{ exercise.repeat + 1 }}
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="flex-grow-0">
          <v-col cols="12">
            <v-card class="mb-4">
              <v-card-text>
                <slot>
                  <exercise-card
                    v-if="workout"
                    :exercise="exercise"
                    :hangboard="{
                      hangboard: workout.hangboard,
                      company: workout.company
                    }"
                    :index="currentExercise"
                    hide-rest
                    variant="flat"
                  >
                  </exercise-card>
                </slot>
              </v-card-text>
            </v-card>

            <v-row class="blend">
              <v-col cols="12">
                <div class="d-flex align-center justify-space-between w-100 ga-1 mb-2">
                  <v-btn
                    :disabled="!!disableMaxHold()"
                    :class="{ pulse: !disableMaxHold() }"
                    icon="$timerCheckOutline"
                    size="x-large"
                    class="rounded-circle"
                    variant="text"
                    color="text"
                    @click="maxHold"
                  />
                  <div class="d-flex align-center justify-center ga-4">
                    <v-btn
                      :disabled="currentExercise <= 0"
                      icon="$skipPrevious"
                      size="x-large"
                      variant="text"
                      color="text"
                      class="rounded-circle"
                      @click="hasExercise('prev')"
                    />
                    <v-btn
                      :icon="timerPaused === null ? '$play' : timerPaused ? '$play' : '$pause'"
                      size="x-large"
                      variant="flat"
                      class="rounded-circle"
                      @click="timerPaused === null ? startTimer() : pauseWorkout()"
                    ></v-btn>
                    <v-btn
                      :disabled="currentExercise >= workout?.exercises?.length - 1"
                      size="x-large"
                      class="rounded-circle"
                      icon="$skipNext"
                      variant="text"
                      color="text"
                      @click="hasExercise('next')"
                    />
                  </div>
                  <v-btn
                    :disabled="disableSkipRest()"
                    icon="$skipForward"
                    size="x-large"
                    class="rounded-circle"
                    variant="text"
                    color="text"
                    @click="skipRest"
                  />
                </div>
                <div class="d-flex justify-space-between align-center w-100 px-2">
                  <div class="d-flex">
                    <workout-subscribe v-if="!quick" :workout="workout" />
                  </div>
                  <div class="d-flex">
                    <workout-bluetooth
                      size="small"
                      :workout="workout"
                      @start="timerPaused === null ? startTimer() : null"
                      @notify="notify"
                    />
                    <workout-share size="small" :workout="workout" />
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="5">
        <v-card v-if="exerciseNext" class="mb-8">
          <v-card-title>{{ $t('Next exercise') }}</v-card-title>
          <v-card-text>
            <exercise-card
              :exercise="exerciseNext"
              :hangboard="{
                hangboard: workout.hangboard,
                company: workout.company
              }"
              :index="currentExercise + 1"
              hide-rest
              variant="flat"
            >
            </exercise-card>
          </v-card-text>
        </v-card>
        <v-card v-if="exercise?.exercise !== null && !quick" class="mb-8">
          <v-card-title>{{ $t('About the exercise') }}</v-card-title>
          <v-card-text>
            <exercise-about :exercise="exercise" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- Show subscribe wall -->
  <subscribe-to-app
    v-if="
      canSubscribePlayBilling &&
      !user?.subscribed &&
      user?.completed &&
      user?.completed.time / 60 > (subscribeLimit / 4) * 3
    "
    v-model="dialogWorkoutSubscribe"
    :limit="subscribeLimit"
  >
  </subscribe-to-app>
  <workout-complete
    v-if="workout"
    v-model="dialogWorkoutComplete"
    :time-hanging="workoutCompleteTimeHanging"
    :time-total="workoutCompleteTimeTotal"
    :workout="workout"
    @show="dialogWorkoutComplete = !dialogWorkoutComplete"
  >
  </workout-complete>
</template>

<style lang="scss" scoped>
.exercise-card:last-child:deep(.v-card) {
  margin-bottom: 0 !important;

  &:last-child:after {
    border: none;
  }
}

@keyframes forwards {
  0% {
    background-position: 0 -1000%;
  }
  100% {
    background-position: 0 0;
  }
}

@keyframes backwards {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 -1000%;
  }
}

.progress {
  background-image: url('@/assets/cartographer.png');
  background-position: 0 0;
  background-repeat: repeat;
  height: calc(100% - 56px) !important; // header
  max-width: 100%;
  width: 0;
  will-change: width, background-position;
  //width: 50% !important;

  &.hang {
    animation: forwards 300s infinite linear;
    background-color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
    width: 100%;
  }

  &.rest {
    animation: backwards 300s infinite linear;
    background-color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
    width: 0;
  }
}

.v-btn--variant-text,
.timer {
  color: white;
  mix-blend-mode: difference;
}

.pulse {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    scale: 1;
    opacity: 0.9;
  }
  50% {
    scale: 1.2;
    opacity: 1;
  }
  100% {
    scale: 1;
    opacity: 0.9;
  }
}
</style>
