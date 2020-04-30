<template>
  <v-layout class="run">
    <v-app-bar v-if="currentWorkout" color="primary" app fixed dark>
      <v-icon
        @click="
          $router.push({
            name: 'workout',
            params: { id: currentWorkout.id, userId: userId }
          })
        "
        >{{ mdi.arrowLeft }}</v-icon
      >
      <v-avatar size="32px">
        <v-img
          v-if="networkOnLine"
          :src="currentWorkout.user.photoURL"
          :alt="currentWorkout.user.displayName"
          aspect-ratio="1"
          class="grey lighten-2"
        />
      </v-avatar>
      <v-toolbar-title>
        {{ currentWorkout.name }}
        <div class="subheading">{{ currentWorkout.description }}</div>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content v-if="currentExercise">
      <v-container class="fill-height">
        <v-row class="fill-height">
          <v-col cols="12">
            <v-row
              justify="space-around"
              align="center"
              class="fill-height text-center canvas"
              :class="binding"
            >
              <!-- circle -->
              <div class="Counter">
                <v-progress-circular
                  :rotate="270"
                  :size="300"
                  :width="5"
                  :value="progressCircular"
                >
                  <div class="d-flex align-center justify-center flex-column">
                    <v-avatar
                      size="80"
                      aspect-ratio="1"
                      class="grey lighten-2 mb-3"
                    >
                      <img
                        v-if="ExerciseStep !== 0 && ExerciseStep !== 2"
                        :alt="options[currentExercise.exercise].name"
                        :src="getImg(options[currentExercise.exercise].image)"
                      />
                      <img
                        v-else
                        src="@/assets/sloth/sleepy.svg"
                        alt="sloth sleepy"
                      />
                    </v-avatar>

                    <div
                      v-if="currentStep > 0"
                      class="progress-button progress-previous"
                    >
                      <v-btn icon @click="exercisePrevious">
                        <v-icon>{{ mdi.skipPrevious }}</v-icon>
                      </v-btn>
                    </div>
                    <div class="subtitle font-weight-bold text-uppercase">
                      {{ progressText }}
                    </div>

                    <div
                      v-if="currentStep < currentWorkout.exercises.length - 1"
                      class="progress-button progress-next"
                    >
                      <v-btn icon @click="exerciseNext">
                        <v-icon>{{ mdi.skipNext }}</v-icon>
                      </v-btn>
                    </div>

                    <div id="timer" class="display-3 font-weight-bold">
                      {{ count(totalTime) }}
                    </div>

                    <div class="bottom-data">
                      <div class="bottom-data__exercise">
                        <div class="data">
                          <v-icon small>{{ mdi.timer }}</v-icon>
                          <span
                            v-if="currentWorkout && currentWorkout.exercises"
                            >{{ currentStep + 1 }}/{{
                              currentWorkout.exercises.length
                            }}</span
                          >
                        </div>
                      </div>
                      <div
                        v-if="currentExercise.repeat > 0"
                        class="bottom-data__repeat"
                      >
                        <div class="data">
                          <v-icon small>{{ mdi.history }}</v-icon>
                          <span
                            >{{ ExerciseRepeat }}/{{
                              currentExercise.repeat + 1
                            }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </v-progress-circular>
              </div>

              <!-- hangboard -->

              <div class="Hangboard">
                <v-container fluid class="py-0">
                  <v-row>
                    <v-col cols="12" class="py-0">
                      <hangboard :data="currentExercise"></hangboard>
                      <hand
                        v-if="
                          currentExercise.leftHand || currentExercise.rightHand
                        "
                        :data="currentExercise"
                      ></hand>
                    </v-col>
                  </v-row>
                </v-container>
              </div>

              <!-- title -->
              <div class="Title">
                <div class="title">
                  <workout-item-name
                    :data="currentExercise"
                  ></workout-item-name>
                </div>
                <div class="subheading">
                  <span>Hold for {{ currentExercise.hold }} sec. </span>
                  <span v-if="currentExercise.repeat > 0">
                    Rest for {{ currentExercise.rest }} sec.</span
                  >
                </div>
              </div>
            </v-row>
          </v-col>
        </v-row>
      </v-container>

      <v-speed-dial bottom right fixed>
        <v-btn
          v-if="timer !== null"
          slot="activator"
          color="secondary"
          dark
          fab
          @click="pauseWorkout"
        >
          <v-icon v-if="!paused">{{ mdi.pause }}</v-icon>
          <v-icon v-else>{{ mdi.play }}</v-icon>
        </v-btn>
        <v-btn
          v-if="timer === null"
          slot="activator"
          color="secondary"
          dark
          fab
          @click="startWorkout"
        >
          <v-icon>{{ mdi.play }}</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-content>
  </v-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import NoSleep from 'nosleep.js'
import Hangboard from '@/components/Hangboard'
import Hand from '@/components/Hand'
import { getImg, count, speak, sound } from '@/misc/helpers'
import {
  mdiArrowLeft,
  mdiTimer,
  mdiSkipNext,
  mdiSkipPrevious,
  mdiPlay,
  mdiPause,
  mdiHistory
} from '@mdi/js'
import WorkoutItemName from '../../components/WorkoutItemName'

export default {
  components: { WorkoutItemName, Hangboard, Hand },
  props: {
    id: String,
    userId: String
  },
  data: () => ({
    currentStep: 0,
    ExerciseRepeat: 0,
    totalTime: 0,
    timer: null,
    time: 0,
    mdi: {
      timer: mdiTimer,
      skipNext: mdiSkipNext,
      skipPrevious: mdiSkipPrevious,
      play: mdiPlay,
      pause: mdiPause,
      arrowLeft: mdiArrowLeft,
      history: mdiHistory
    },
    meta: {
      title: 'Workout'
    },
    paused: false,
    progressCircular: 0,
    progressText: 'Press Play',
    initialTime: 0,
    initialStart: true,
    ExerciseStep: 0,
    synth: window.speechSynthesis,
    voiceList: [],
    noSleep: new NoSleep(),
    wakeLock: null
  }),
  computed: {
    ...mapState('app', ['networkOnLine']),
    ...mapState('authentication', ['user']),
    ...mapState('workouts', ['options']),
    ...mapState('companies', ['companies']),
    ...mapGetters('workouts', ['workoutById']),
    // vuetify grid-system breakpoint binding
    binding() {
      const binding = {}

      if (this.$vuetify.breakpoint.xs) binding.column = true

      return binding
    },
    currentExercise() {
      if (!this.currentWorkout) return
      // eslint-disable-next-line consistent-return
      return this.currentWorkout.exercises[this.currentStep]
    },
    currentWorkout() {
      return this.workoutById(this.id)
    }
  },
  mounted() {
    if (this.currentWorkout) {
      this.meta.title = `${this.currentWorkout.name} | Workout `
      this.$emit('updateHead')
    }
    // set timer
    // TODO: Why do I get the voice list here?
    this.voiceList = this.synth
      .getVoices()
      .filter(voice => /^(en|EN)/.test(voice.lang))
  },
  beforeRouteLeave(to, from, next) {
    // make sure timer is disabled on leave
    if (this.timer !== null) clearInterval(this.timer)
    next()
  },
  methods: {
    getImg,
    count,
    speak,
    sound,
    countdown() {
      // set initial state before starting
      if (this.initialTime === 0) {
        this.exerciseSetup()
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
    async startWorkout() {
      await this.requestWakeLock()
      this.timer = setInterval(() => {
        if (!this.paused) this.countdown()
      }, 1000)
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
    exerciseHold() {
      this.progressText = 'Hold'

      if (this.totalTime === 1) {
        this.vibratePhone()
        this.playSound('stop.mp3')

        if (
          this.currentStep + 1 !== this.currentWorkout.exercises.length ||
          (this.currentExercise.repeat > 0 &&
            this.ExerciseRepeat - 1 !== this.currentExercise.repeat)
        ) {
          this.speakText('... and pause')
        }
      }
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
        textToSpeak += 'Next exercise: '

        if (this.currentExercise.pause >= 10) {
          if (this.currentExercise.pullups > 1) {
            textToSpeak += `${this.currentExercise.pullups} `
          }
          if (
            this.currentExercise.left === null ||
            this.currentExercise.right === null
          ) {
            textToSpeak += `One Arm `
          }
          textToSpeak += `${this.options[this.currentExercise.exercise].name}`
          if (this.currentExercise.pullups > 1) {
            textToSpeak += ` Pullups`
          } else if (this.currentExercise.pullups > 0) {
            textToSpeak += ` Pullup`
          }
        }

        if (this.currentExercise.pause >= 15) {
          textToSpeak += `. For ${this.currentExercise.hold} seconds. `
          if (this.currentExercise.repeat > 0) {
            textToSpeak += `Than rest for ${this.currentExercise.rest} seconds. `
            textToSpeak += `Repeat ${this.currentExercise.repeat + 1} times.`
          }
        }

        this.speakText(textToSpeak)
      }

      // start count down
      if (this.initialTime >= 4 && this.totalTime <= 4 && this.totalTime > 1) {
        if (this.user.settings.speak) {
          this.speakText(this.totalTime - 1)
        } else {
          this.playSound('count.mp3')
        }
      }

      if (this.totalTime === 1) {
        this.vibratePhone()
        this.playSound('start.mp3')
        this.speakText('Go!')
        if (this.ExerciseRepeat - 1 !== this.currentExercise.repeat) {
          this.ExerciseRepeat += 1
        }
      }
    },
    exerciseRest() {
      this.progressText = 'Rest'
      // rest: start counting down
      if (this.initialTime >= 4 && this.totalTime <= 4 && this.totalTime > 1) {
        if (this.user.settings.speak) {
          this.speakText(this.totalTime - 1)
        } else {
          this.playSound('count.mp3')
        }
      }

      if (this.totalTime === 1) {
        this.vibratePhone()
        this.playSound('start.mp3')
        this.speakText('Go!')
        if (this.ExerciseRepeat - 1 !== this.currentExercise.repeat) {
          this.ExerciseRepeat += 1
        }
      }
    },
    finishWorkout() {
      this.progressText = 'Done'
      this.speakText('Well done')
      if ('wakeLock' in navigator && 'request' in navigator.wakeLock) {
        this.wakeLock.release()
        this.wakeLock = null
      } else {
        this.noSleep.disable()
      }
      this.paused = true
      clearInterval(this.timer)
    },
    hasNext() {
      if (this.currentStep < this.currentWorkout.exercises.length - 1) {
        this.currentStep += 1 // next exercise
        this.exerciseSetup() // set time
        this.ExerciseRepeat = 0 // resets
        this.ExerciseStep = 0 // pause
        return true
      }
      return false
    },
    exerciseNext() {
      this.currentStep += 1
      this.totalTime = this.currentExercise.pause - 1
      // resets
      this.ExerciseRepeat = 0
      this.ExerciseStep = 0
    },
    exercisePrevious() {
      this.currentStep -= 1
      this.totalTime = this.currentExercise.pause - 1
      // resets
      this.ExerciseRepeat = 0
      this.ExerciseStep = 0
    },

    pauseWorkout() {
      if (!this.paused) {
        if ('wakeLock' in navigator && 'request' in navigator.wakeLock) {
          this.wakeLock.release()
          this.wakeLock = null
        } else {
          this.noSleep.disable()
        }
      } else {
        this.requestWakeLock()
      }
      this.paused = !this.paused
    },
    speakText(text) {
      if (this.user.settings.speak && 'speechSynthesis' in window) {
        this.voiceList = window.speechSynthesis
          .getVoices()
          .filter(voice => /^(en|EN|US)/.test(voice.lang))
        const utterance = new window.SpeechSynthesisUtterance()
        utterance.text = text
        utterance.voice = this.voiceList[this.user.settings.voice]
        this.speak(utterance)
      }
    },
    playSound(path) {
      if (this.user.settings.sound) this.sound(path)
    },
    vibratePhone() {
      if ('vibrate' in navigator) {
        if (this.user.settings.vibrate) navigator.vibrate([80, 40, 120])
      }
    },
    async requestWakeLock() {
      try {
        if ('wakeLock' in navigator && 'request' in navigator.wakeLock) {
          this.wakeLock = await navigator.wakeLock.request('screen')
          this.wakeLock.addEventListener('release', () => {
            // eslint-disable-next-line no-console
            console.log('Wake Lock was released')
          })
          // eslint-disable-next-line no-console
          console.log('Wake Lock is active')
        } else {
          // eslint-disable-next-line no-console
          console.log('noSleep')
          this.noSleep.enable()
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`${err.name}, ${err.message}`)
      }
    }
  },
  head: {
    title() {
      return {
        // inner: `${this.currentWorkout.name} | Workout `
        inner: this.meta.title
      }
    },
    meta: [
      {
        name: 'description',
        content: '',
        id: 'desc'
      }
    ]
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.bottom-data {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  > div > div {
    position: relative;
    display: inline-flex;
    vertical-align: middle;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    padding: 0 12px;
    span {
      display: inline-block;
      padding: 0 4px;
    }
  }
}

.progress-button {
  position: absolute;
  &.progress-previous {
    left: 32px;
  }
  &.progress-next {
    right: 32px;
  }
}

.lap .data {
  font-size: 1.8rem;
  font-weight: bold;
  padding: 0 8px;
}
</style>
