<template>
  <div class="progress-circular">
    <v-progress-circular
      :rotate="270"
      :size="300"
      :width="5"
      :value="progressCircular"
      class="mt-4"
    >
      <div class="d-flex align-center justify-center flex-column">
        <!-- avatar-->
        <v-avatar size="80" aspect-ratio="1" class="grey lighten-2 mb-3">
          <span v-if="ExerciseStep !== 0 && ExerciseStep !== 2">
            <img
              v-if="!isNaN(currentExercise.grip)"
              :alt="grip[currentExercise.grip].name"
              :src="getImg(grip[currentExercise.grip].image)"
              class="grey lighten-2"
            />

            <img
              v-else-if="grip[currentExercise.exercise]"
              :src="getImg(grip[currentExercise.exercise].image)"
              :alt="grip[currentExercise.exercise].name"
              class="grey lighten-2"
            />

            <img
              v-else
              src="@/assets/exercises/deadhang.svg"
              alt="sloth deadhang"
            />
          </span>
          <img v-else src="@/assets/sloth/sleepy.svg" alt="sloth sleepy" />
        </v-avatar>
        <!-- previous -->
        <div v-if="currentStep > 0" class="progress-button progress-previous">
          <v-btn icon @click="exercisePrevious">
            <v-icon>{{ mdi.skipPrevious }}</v-icon>
          </v-btn>
        </div>
        <!-- progress -->
        <div class="subtitle font-weight-bold text-uppercase">
          {{ $t(progressText) }}
        </div>
        <!-- next-->
        <div
          v-if="
            currentWorkout && currentStep < currentWorkout.exercises.length - 1
          "
          class="progress-button progress-next"
        >
          <v-btn icon @click="exerciseNext">
            <v-icon>{{ mdi.skipNext }}</v-icon>
          </v-btn>
        </div>
        <!-- time -->
        <div id="timer" class="text-h2 font-weight-bold">
          {{ count(totalTime) }}
        </div>

        <!-- bottom -->
        <div class="bottom-data">
          <div
            v-if="currentWorkout && currentWorkout.exercises"
            class="bottom-data__exercise"
          >
            <div class="data">
              <v-icon>{{ mdi.timer }}</v-icon>
              <span>
                {{ currentStep + 1 }}/{{ currentWorkout.exercises.length }}
              </span>
            </div>
          </div>
          <div
            v-if="currentExercise.weight && currentExercise.weight !== 0"
            class="bottom-data__weight"
          >
            <div class="data">
              <v-icon>{{ mdi.weight }}</v-icon>
              <span
                >{{ weightConverter(currentExercise.weight, user) }}
                {{ weightShort }}</span
              >
            </div>
          </div>
          <div v-if="currentExercise.repeat > 0" class="bottom-data__repeat">
            <div class="data">
              <v-icon>{{ mdi.history }}</v-icon>
              <span>{{ ExerciseRepeat }}/{{ currentExercise.repeat + 1 }}</span>
            </div>
          </div>
        </div>
      </div>
    </v-progress-circular>

    <!-- Complete Dialog -->
    <dialog-workout-complete
      v-model="dialogs.complete"
      :user="user"
      :current-workout="currentWorkout"
      :time-in-workout="timeInWorkout"
      :time-holding-on="timeHoldingOn"
    ></dialog-workout-complete>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import NoSleep from 'nosleep.js'
import {
  mdiTimer,
  mdiSkipNext,
  mdiSkipPrevious,
  mdiPlay,
  mdiPause,
  mdiHistory,
  mdiWeight
} from '@mdi/js'
import DialogWorkoutComplete from '@/components/molecules/DialogWorkoutComplete/DialogWorkoutComplete'
import { count, getImg, sound, speak, weightConverter } from '@/misc/helpers'

export default {
  name: 'CircleTimer',
  components: {
    DialogWorkoutComplete
  },
  props: {
    startButton: Boolean,
    pauseButton: Boolean,
    currentExercise: Object,
    currentWorkout: Object
  },
  data: () => ({
    dialogs: {
      complete: false
    },
    currentStep: 0,
    progressText: 'Press Play',
    total: 0,
    timer: null,
    ExerciseStep: 0,
    ExerciseRepeat: 0,
    totalTime: 0,
    timeInWorkout: 0,
    timeHoldingOn: 0,
    initialTime: 0,
    initialStart: true,
    progressCircular: 0,
    paused: false,
    noSleep: new NoSleep(),
    mdi: {
      timer: mdiTimer,
      skipNext: mdiSkipNext,
      skipPrevious: mdiSkipPrevious,
      play: mdiPlay,
      pause: mdiPause,
      history: mdiHistory,
      weight: mdiWeight
    }
  }),
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('app', ['networkOnLine']),
    ...mapState('workouts', ['grip', 'exercises']),
    ...mapGetters('authentication', ['weightShort']),
    ...mapGetters('workouts', ['exerciseById'])
  },
  watch: {
    startButton() {
      this.startWorkout()
    },
    pauseButton() {
      this.pauseWorkout()
    },
    resetButton() {
      this.currentStep = 0
      this.progressText = 'Press Play'
      this.total = 0
      this.timer = null
      this.ExerciseStep = 0
      this.ExerciseRepeat = 0
      this.totalTime = 0
      this.initialTime = 0
      this.initialStart = true
      this.progressCircular = 0
      this.paused = true
      clearInterval(this.timer)
    }
  },
  beforeDestroy() {
    // make sure timer is disabled and speech is stopped
    if (this.timer !== null) clearInterval(this.timer)
    if (window.speechSynthesis) window.speechSynthesis.cancel()
  },
  methods: {
    getImg,
    count,
    speak,
    sound,
    weightConverter,
    ...mapActions('authentication', ['triggerUpdateTimes']),
    async startWorkout() {
      await this.requestWakeLock()
      this.exerciseSetup()
      this.timer = setInterval(() => {
        if (!this.paused) this.countdown()
      }, 1000)
    },
    async requestWakeLock() {
      try {
        this.noSleep.enable()
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`${err.name}, ${err.message}`)
      }
    },
    pauseWorkout() {
      if (!this.paused && this.pauseButton) {
        this.noSleep.disable()
      } else {
        this.requestWakeLock()
      }
      this.paused = !this.paused
    },
    countdown() {
      // set initial state before starting
      if (this.initialTime === 0) {
        this.exerciseSetup()
      }

      this.timeInWorkout += 1

      if (this.ExerciseStep === 1 || this.ExerciseStep === 3) {
        this.timeHoldingOn += 1
      }
      // eslint-disable-next-line default-case
      switch (this.ExerciseStep) {
        // PAUSE
        case 0:
          if (this.totalTime > 0) {
            this.exercisePause()
            this.updateTime()
            break
          }
          // set time for holding
          this.totalTime = this.currentExercise.hold - 1
          // reset clock
          this.initialTime = this.totalTime
          this.ExerciseStep = 1
          break
        // HOLD
        case 1:
          if (this.totalTime > 0) {
            this.exerciseHold()
            this.updateTime()
            break
          }
          // check if exercise has to repeat
          if (this.currentExercise.repeat > 0) {
            this.totalTime = this.currentExercise.rest - 1
            this.initialTime = this.totalTime
            this.ExerciseStep = 2
            break
          }
          if (this.hasNext()) {
            break
          }
          this.ExerciseStep = 4
          break
        // // REST
        case 2:
          if (this.totalTime > 0) {
            this.exerciseRest()
            this.updateTime()
            break
          }
          if (this.currentExercise.repeat > 0) {
            this.totalTime = this.currentExercise.hold - 1
            this.initialTime = this.totalTime
            this.ExerciseStep = 3
            break
          }
          if (this.hasNext()) {
            break
          }
          this.ExerciseStep = 4
          break
        // // REPEAT
        case 3:
          if (this.totalTime > 0) {
            this.exerciseHold()
            this.updateTime()
            break
          }
          if (this.ExerciseRepeat - 1 !== this.currentExercise.repeat) {
            this.totalTime = this.currentExercise.rest - 1
            this.initialTime = this.totalTime
            this.ExerciseStep = 2
            break
          }
          if (this.hasNext()) {
            break
          }
          this.ExerciseStep = 4
          break
        // // NEXT / FINISH
        case 4:
          this.finishWorkout()
          break
      }
    },
    exerciseSetup() {
      this.totalTime = this.currentExercise.pause - 1
      // don't remove 1 sec on start.
      if (this.initialStart) {
        this.totalTime = this.currentExercise.pause
      }
      this.initialStart = false
      // finish Setup
      this.initialTime = this.totalTime
    },
    updateTime() {
      this.totalTime -= 1

      // update circle
      this.progressCircular =
        ((this.initialTime - this.totalTime) * 100) / this.initialTime
    },
    exerciseNext() {
      this.currentStep += 1
      this.$emit('current-step', this.currentStep)
      this.$nextTick(() => {
        this.totalTime = this.currentExercise.pause
      })
      // resets
      this.ExerciseRepeat = 0
      this.ExerciseStep = 0
    },
    exercisePrevious() {
      this.currentStep -= 1
      this.$emit('current-step', this.currentStep)
      this.$nextTick(() => {
        this.totalTime = this.currentExercise.pause
      })
      // resets
      this.ExerciseRepeat = 0
      this.ExerciseStep = 0
    },
    exerciseHold() {
      this.progressText = 'Hold'

      if (this.totalTime === 1) {
        this.vibratePhone()
        this.playSound('stop.mp3')

        if (
          (this.currentWorkout &&
            this.currentStep + 1 !== this.currentWorkout.exercises.length) ||
          (this.currentExercise.repeat > 0 &&
            this.ExerciseRepeat - 1 !== this.currentExercise.repeat)
        ) {
          this.speakText(`${this.$i18n.t('And pause')}!`)
        }
      }
    },
    hasNext() {
      if (
        this.currentWorkout &&
        this.currentStep < this.currentWorkout.exercises.length - 1
      ) {
        this.currentStep += 1 // next exercise
        this.$emit('current-step', this.currentStep)
        this.$nextTick(() => {
          this.exerciseSetup() // set time
          this.ExerciseRepeat = 0 // resets
          this.ExerciseStep = 0 // pause
          return true
        })
      }
      return false
    },
    exercisePause() {
      this.progressText = 'Pause'

      // only speak at the beginning of a pause
      if (
        this.ExerciseRepeat === 0 &&
        this.initialTime - 1 === this.totalTime &&
        this.currentExercise.pause > 5
      ) {
        let textToSpeak = ''
        textToSpeak += `${this.$i18n.t('Next exercise')}: `

        if (this.currentExercise.pause >= 10) {
          if (this.currentExercise.pullups > 1) {
            textToSpeak += `${this.currentExercise.pullups} `
          }
          if (
            this.currentExercise.left === null ||
            this.currentExercise.right === null
          ) {
            textToSpeak += `${this.$i18n.t('One Arm')} `
          }
          // fallback system
          // eslint-disable-next-line no-restricted-globals
          if (!isNaN(this.currentExercise.grip)) {
            textToSpeak += ` ${this.grip[this.currentExercise.grip].name}`
            if (this.currentExercise.exercise !== 0) {
              textToSpeak += ` ${
                this.exerciseById(this.currentExercise.exercise).name
              }`
            }
            if (this.currentExercise.pullups > 1) {
              textToSpeak += `s`
            }
          } else {
            // old way
            if (this.grip[this.currentExercise.exercise]) {
              textToSpeak += `${this.grip[this.currentExercise.exercise].name}`
            }

            if (this.currentExercise.pullups > 1) {
              textToSpeak += ` Pullups`
            } else if (this.currentExercise.pullups > 0) {
              textToSpeak += ` Pullup`
            }
          }
        }

        if (this.currentExercise.pause >= 15) {
          textToSpeak += `. ${this.$i18n.t('For {hold} seconds', {
            hold: this.currentExercise.hold
          })}. `
          if (this.currentExercise.repeat > 0) {
            textToSpeak += `${this.$i18n.t('Than rest for {rest} seconds', {
              rest: this.currentExercise.rest
            })}. `
            textToSpeak += `${this.$i18n.t('Repeat {repeat} times', {
              repeat: this.currentExercise.repeat + 1
            })}.`
          }
        }
        this.speakText(textToSpeak)
      }

      if (this.currentExercise.pause >= 135 && this.totalTime === 120) {
        this.speakText(`${this.$i18n.t('2 minutes left')}`)
      }

      if (this.currentExercise.pause >= 75 && this.totalTime === 60) {
        this.speakText(`${this.$i18n.t('1 minute left')}`)
      }

      if (this.currentExercise.pause >= 45 && this.totalTime === 30) {
        this.speakText(`${this.$i18n.t('30 seconds left')}`)
      }

      if (this.currentExercise.pause >= 30 && this.totalTime === 15) {
        this.speakText(`${this.$i18n.t('15 seconds left.. Get ready')}!`)
      }

      // start count down
      if (this.initialTime >= 4 && this.totalTime <= 4 && this.totalTime > 1) {
        if (this.user && this.user.settings.speak) {
          this.speakText(this.totalTime - 1)
        } else {
          this.playSound('count.mp3')
        }
      }

      if (this.totalTime === 1) {
        this.vibratePhone()
        this.playSound('start.mp3')
        this.speakText(`${this.$i18n.t('Go')}!`)
        if (this.ExerciseRepeat - 1 !== this.currentExercise.repeat) {
          this.ExerciseRepeat += 1
        }
      }
    },
    exerciseRest() {
      this.progressText = 'Rest'
      // rest: start counting down
      if (this.initialTime >= 4 && this.totalTime <= 4 && this.totalTime > 1) {
        if (this.user && this.user.settings.speak) {
          this.speakText(this.totalTime - 1)
        } else {
          this.playSound('count.mp3')
        }
      }

      if (this.totalTime === 1) {
        this.vibratePhone()
        this.playSound('start.mp3')
        this.speakText(`${this.$i18n.t('Go')}!`)
        if (this.ExerciseRepeat - 1 !== this.currentExercise.repeat) {
          this.ExerciseRepeat += 1
        }
      }
    },
    finishWorkout() {
      this.noSleep.disable()
      this.paused = true
      if (this.timeInWorkout >= 2) {
        this.timeInWorkout -= 2
      }
      this.triggerUpdateTimes({
        total: this.timeInWorkout,
        hold: this.timeHoldingOn
      })
      this.dialogs.complete = true
      clearInterval(this.timer)
    },
    speakText(text) {
      if (
        this.user &&
        this.user.settings.speak &&
        'speechSynthesis' in window
      ) {
        this.voiceList = window.speechSynthesis.getVoices()
        if (this.user.settings.locale) {
          this.voiceList = this.voiceList.filter((voice) => {
            return voice.lang.includes(
              this.user.settings.locale.substring(0, 2)
            )
          })
        } else {
          this.voiceList = this.voiceList.filter((voice) =>
            /^(en|EN|US)/.test(voice.lang)
          )
        }
        const utterance = new window.SpeechSynthesisUtterance()
        utterance.text = text
        utterance.voice = this.voiceList[this.user.settings.voice]
        this.speak(utterance)
      }
    },
    playSound(path) {
      if (this.user && this.user.settings.sound) this.sound(path)
    },
    vibratePhone() {
      if ('vibrate' in navigator) {
        if (this.user && this.user.settings.vibrate)
          navigator.vibrate([80, 40, 120])
      }
    }
  }
}
</script>
