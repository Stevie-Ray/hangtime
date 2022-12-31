<script setup>
import { computed, defineProps, ref, nextTick, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import NoSleep from 'nosleep.js'
import ExerciseCard from '@/components/molecules/ExerciseCard/ExerciseCard'
import { time } from '@/helpers'

import { useAuthentication } from '@/stores/authentication'

const { t } = useI18n()
const { user } = storeToRefs(useAuthentication())

const props = defineProps({
  exercises: {
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

onBeforeUnmount(() => {
  // make sure timer is disabled and speech is stopped
  if (timer !== null) clearInterval(timer)
  if (window.speechSynthesis) window.speechSynthesis.cancel()
})

const exercise = computed(() => {
  if (props.exercises) return props.exercises[currentExercise.value]
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
  if (clock.value <= 4 && clock.value > 1) {
    if (user.value?.settings?.speak) {
      speakText(clock.value - 1)
    } else {
      playSound('count.mp3')
    }
  }
  if (clock.value === 1) {
    vibratePhone()
    playSound('start.mp3')
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
    playSound('stop.mp3')
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

const exerciseDone = () => {
  clockText.value = t('Done')
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
    if (currentExercise.value !== props.exercises.length - 1) {
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
  // eslint-disable-next-line default-case
  switch (currentExerciseStep.value) {
    // PAUSE
    case 0:
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
</script>

<template>
  <v-container
    v-if="exercises"
    :class="{
      rest:
        !timerPaused &&
        !(currentExerciseStep === 1 || currentExerciseStep === 3),
      hang:
        !timerPaused && (currentExerciseStep === 1 || currentExerciseStep === 3)
    }"
    :style="{
      transition: `width ${clock}s linear, background-position 99s linear`
    }"
    class="position-absolute h-100 pa-0 progress"
  ></v-container>
  <v-container class="position-relative">
    <v-row>
      <v-col cols="12">
        <v-row align="center" class="pt-4 timer" justify="center">
          <v-col class="text-center" cols="8">
            <div v-if="exercises" class="text-h1">
              {{ time(clock) }}
            </div>
            <div class="text-h6">
              {{ clockText }}
            </div>
            <v-row align="center" justify="center">
              <v-col class="text-center">
                <div class="text-h6">{{ time(exerciseTime) }}</div>
              </v-col>
              <v-col class="text-center" v-if="exercises?.length > 1">
                <div class="text-h6">
                  {{ currentExercise + 1 }}/{{ exercises.length }}
                </div>
              </v-col>
              <v-col class="text-center" v-if="exercises">
                <div class="text-h6">
                  {{ currentExerciseStepRepeat + 1 }}/{{ exercise.repeat + 1 }}
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-card class="pt-12 mt-12 position-relative overflow-visible">
          <v-card-title
            class="justify-center align-center position-absolute w-100 d-flex"
            style="top: -36px; gap: 32px"
          >
            <v-btn
              :style="{
                visibility: exercises?.length > 1 ? 'visible' : 'hidden'
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
                visibility: exercises?.length > 1 ? 'visible' : 'hidden'
              }"
              :disabled="currentExercise >= exercises?.length - 1"
              variant="flat"
              icon="mdi-skip-next"
              class="rounded-circle"
              @click="hasExercise('next')"
            ></v-btn>
          </v-card-title>

          <v-card-text class="pt-0">
            <slot>
              <exercise-card
                variant="flat"
                :index="currentExercise"
                :exercise="exercise"
                :hangboard="{
                  hangboard: 0,
                  company: 1
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
</template>

<style lang="scss" scoped>
.exercise-card:last-child::v-deep(.v-card) {
  margin-bottom: 0 !important;
  &:last-child:after {
    border: none;
  }
}

.progress {
  background-image: url('@/assets/cartographer.png');
  background-repeat: repeat;
  width: 0;
  height: calc(100% - 56px - 64px) !important; // header + footer
  will-change: width;

  &.hang {
    background-color: rgb(var(--v-theme-secondary));
    background-position: -990px -990px;
    width: 100%;
  }

  &.rest {
    background-color: rgb(var(--v-theme-tertiary));
    background-position: 990px 990px;
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
