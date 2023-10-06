<script setup>
import {
  computed,
  defineProps,
  ref,
  nextTick,
  onBeforeUnmount,
  onMounted
} from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import NoSleep from 'nosleep.js'
import ExerciseCard from '@/components/molecules/ExerciseCard/ExerciseCard'
import WorkoutComplete from '@/components/molecules/dialog/WorkoutComplete/WorkoutComplete'
import SubscribeToApp from '@/components/molecules/dialog/SubscribeToApp/SubscribeToApp'
import { time } from '@/helpers'

import { useAuthentication } from '@/stores/authentication'
import { useActivities } from '@/stores/activities'

const { t } = useI18n()

const { user } = storeToRefs(useAuthentication())

const { updateUser } = useAuthentication()

const { createUserActivity } = useActivities()

const props = defineProps({
  workout: {
    type: Object
  }
})

let timer = null
const timerPaused = ref(null)
const clock = ref(0)
const clockText = ref(t('Press Play'))
const currentExercise = ref(0)
const currentExerciseStep = ref(0)
const currentExerciseStepRepeat = ref(0)

const audio = new Audio()
const noSleep = new NoSleep()
const setupTime = 5

// complete
const dialogWorkoutComplete = ref(false)
const workoutCompleteTimeTotal = ref(0)
const workoutCompleteTimeHanging = ref(0)

onBeforeUnmount(() => {
  // make sure timer is disabled and speech is stopped
  if (timer !== null) clearInterval(timer)
  if (window.speechSynthesis) window.speechSynthesis.cancel()
})

const exercise = computed(() => {
  if (props?.workout?.exercises)
    return props?.workout?.exercises[currentExercise.value]
  return {}
})

const exerciseTime = computed(
  () =>
    (exercise.value.hold + exercise.value.rest) * (exercise.value.repeat + 1) -
    exercise.value.rest
)

const requestWakeLock = () => {
  try {
    noSleep.enable()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`${err.name}, ${err.message}`)
  }
}

const speak = (text) => {
  try {
    window.speechSynthesis.speak(text)
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.log('speechSynthesis not available', ex)
  }
}

const speakText = (text) => {
  if (user.value?.settings?.speak && 'speechSynthesis' in window) {
    let voiceList = window.speechSynthesis.getVoices()
    if (user.value?.settings.locale) {
      voiceList = voiceList.filter((voice) => {
        return voice.lang.includes(user.value?.settings?.locale.substring(0, 2))
      })
    } else {
      voiceList = voiceList.filter((voice) => /^(en|EN|US)/.test(voice.lang))
    }
    const utterance = new window.SpeechSynthesisUtterance()
    utterance.text = text
    utterance.voice = voiceList[user.value?.settings?.voice]
    speak(utterance)
  }
}

const playSound = (path) => {
  if (user.value?.settings?.sound) {
    // workaround for iOS / Safari
    // eslint-disable-next-line global-require,import/no-dynamic-require
    audio.src = require(`@/assets/sound/${path}`)
  }
}
const vibratePhone = () => {
  if ('vibrate' in navigator) {
    if (user.value?.settings?.vibrate) navigator.vibrate([80, 40, 120])
  }
}

const countDown = () => {
  // if (clock.value === 15) {
  //   if (user.value?.settings?.speak) {
  //     speakText(`${t('Get Ready')}!`)
  //   } else {
  //     playSound('count.wav')
  //   }
  // }
  if (clock.value <= 3 && clock.value > 1) {
    if (user.value?.settings?.speak) {
      speakText(clock.value - 1)
    } else {
      playSound('count.wav')
    }
  }
  if (clock.value === 1) {
    vibratePhone()
    playSound('start.wav')
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
  clearInterval(timer)
  timerPaused.value = !timerPaused.value
  // resetTimer()
}

const exercisePause = () => {
  clockText.value = t('Pause')
  countDown()
}

const exerciseHold = () => {
  clockText.value = t('Hold')
  if (clock.value === 1) {
    vibratePhone()
    playSound('stop.wav')
  }
}

const exerciseRest = () => {
  clockText.value = t('Rest')
  countDown()
  if (clock.value === 1) {
    if (currentExerciseStepRepeat.value - 1 !== exercise.value.repeat) {
      currentExerciseStepRepeat.value += 1
    }
  }
}

const updateUserCompleted = () => {
  // check if object exists
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

const exerciseDone = () => {
  clockText.value = t('Done')
  createUserActivity({
    name: props?.workout?.name ? props.workout.name : '',
    start_date_local: new Date(),
    sport_type: 'Workout',
    elapsed_time: workoutCompleteTimeTotal.value,
    elapsed_time_hanging: workoutCompleteTimeHanging.value,
    description: props?.workout?.description ? props.workout.description : '',
    difficulty: props?.workout?.level ? props.workout.level : '',
    type: 'Hangboarding',
    company: props?.workout?.company ? props.workout.company : '',
    hangboard: props?.workout?.hangboard ? props.workout.hangboard : '',
    user: props?.workout?.user?.id ? props.workout.user.id : '',
    workout: props?.workout?.id ? props?.workout.id : ''
  })
  updateUserCompleted()
  // open dialog
  dialogWorkoutComplete.value = true
  // stop timers
  stopTimer()
}

const hasExercise = (type) => {
  const setupTimers = () => {
    nextTick(() => {
      if (currentExercise.value === 0) {
        clock.value = 0
      }
      if (currentExercise.value !== 0) {
        clock.value = exercise.value.pause - 1
      }
      currentExerciseStep.value = 0
      currentExerciseStepRepeat.value = 0
    })
    return true
  }

  if (type === 'next') {
    // if there is another exercise
    if (currentExercise.value !== props.workout.exercises.length - 1) {
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
      clock.value = exercise.value.hold - 1
      currentExerciseStep.value = 1
      break
    // HOLD
    case 1:
      workoutCompleteTimeTotal.value += 1
      workoutCompleteTimeHanging.value += 1
      if (clock.value > 0) {
        exerciseHold()
        clock.value -= 1
        break
      }
      // check if exercise has to repeat
      if (exercise.value.repeat > 0) {
        clock.value = exercise.value.rest - 1
        currentExerciseStep.value = 2
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
      if (exercise.value.repeat > 0) {
        clock.value = exercise.value.hold - 1
        currentExerciseStep.value = 3
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
      if (clock.value > 0) {
        exerciseHold()
        clock.value -= 1
        break
      }
      if (currentExerciseStepRepeat.value !== exercise.value.repeat) {
        clock.value = exercise.value.rest - 1
        currentExerciseStep.value = 2
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
  timer = setInterval(() => {
    if (!timerPaused.value) exerciseSteps()
  }, 1000)
}

const setupWorkout = async () => {
  await requestWakeLock()

  // give the user some time to get ready
  clock.value = setupTime
  timer = setInterval(() => {
    if (!timerPaused.value) {
      clockText.value = t('Get ready')
      countDown()
      clock.value -= 1
      if (clock.value === 0) {
        clearInterval(timer)
        clock.value = exercise.value.hold - 1
        // start when setup is done
        startWorkout()
      }
    }
  }, 1000)
}

const startTimer = () => {
  timerPaused.value = false
  // init audio on button click
  if (audio) {
    audio.autoplay = true
    audio.src =
      'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'
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
      rest:
        !timerPaused &&
        !(currentExerciseStep === 1 || currentExerciseStep === 3),
      hang:
        !timerPaused && (currentExerciseStep === 1 || currentExerciseStep === 3)
    }"
    :style="{
      transition: `width ${clock}s linear`
    }"
    class="position-absolute h-100 pa-0 progress"
  ></v-container>
  <v-container class="position-relative">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6">
        <v-row align="center" class="timer" justify="center">
          <v-col class="text-center" cols="8" sm="10">
            <div v-if="workout?.exercises" class="text-h1">
              {{ time(clock) }}
            </div>
            <div class="text-h6 pt-2 pb-4">
              {{ clockText }}
            </div>
            <v-row align="center" justify="center">
              <v-col class="text-center">
                <div class="text-h6">{{ time(exerciseTime) }}</div>
              </v-col>
              <v-col class="text-center" v-if="workout?.exercises?.length > 1">
                <div class="text-h6">
                  {{ currentExercise + 1 }}/{{ workout?.exercises.length }}
                </div>
              </v-col>
              <v-col class="text-center" v-if="workout?.exercises">
                <div class="text-h6">
                  {{ currentExerciseStepRepeat + 1 }}/{{ exercise.repeat + 1 }}
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card
          class="pt-12 mt-12 mt-sm-4 pt-sm-8 position-relative overflow-visible"
        >
          <v-card-title
            class="justify-center align-center position-absolute w-100 d-flex"
            style="top: -36px; gap: 32px; z-index: 1"
          >
            <v-btn
              :style="{
                visibility:
                  workout?.exercises?.length > 1 ? 'visible' : 'hidden'
              }"
              :disabled="currentExercise <= 0"
              variant="flat"
              icon="mdi-skip-previous"
              class="rounded-circle"
              @click="hasExercise('prev')"
            ></v-btn>
            <v-btn
              variant="flat"
              :icon="
                timerPaused === null
                  ? 'mdi-play'
                  : timerPaused
                  ? 'mdi-play'
                  : 'mdi-pause'
              "
              class="rounded-circle"
              size="x-large"
              @click="timerPaused === null ? startTimer() : pauseWorkout()"
            ></v-btn>
            <v-btn
              :style="{
                visibility:
                  workout?.exercises?.length > 1 ? 'visible' : 'hidden'
              }"
              :disabled="currentExercise >= workout?.exercises?.length - 1"
              variant="flat"
              icon="mdi-skip-next"
              class="rounded-circle"
              @click="hasExercise('next')"
            ></v-btn>
          </v-card-title>

          <v-card-text class="pt-0">
            <slot>
              <exercise-card
                v-if="workout"
                variant="flat"
                :index="currentExercise"
                :exercise="exercise"
                :hangboard="{
                  hangboard: workout.hangboard,
                  company: workout.company
                }"
                hide-rest
              >
              </exercise-card>
            </slot>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- Show subscribe wall -->
  <subscribe-to-app
    v-model="dialogWorkoutSubscribe"
    v-if="
      canSubscribePlayBilling &&
      !user?.subscribed &&
      user?.completed?.time / 60 > (subscribeLimit / 4) * 3
    "
    :limit="subscribeLimit"
  >
  </subscribe-to-app>
  <workout-complete
    v-if="workout"
    v-model="dialogWorkoutComplete"
    :time-total="workoutCompleteTimeTotal"
    :time-hanging="workoutCompleteTimeHanging"
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
  background-repeat: repeat;
  background-position: 0 0;
  width: 0;
  height: calc(100% - 56px) !important; // header
  will-change: width, background-position;

  &.hang {
    background-color: rgb(var(--v-theme-secondary));
    animation: forwards 300s infinite linear;
    width: 100%;
  }

  &.rest {
    background-color: rgb(var(--v-theme-tertiary));
    animation: backwards 300s infinite linear;
    width: 0;
  }
}

.timer {
  .v-theme--dark & {
    color: rgb(var(--v-theme-surface-variant));
  }
  color: rgba(var(--v-theme-on-primary));
  mix-blend-mode: difference;
}

.rounded-circle {
  outline: rgb(var(--v-theme-surface)) 4px solid;
}
</style>
