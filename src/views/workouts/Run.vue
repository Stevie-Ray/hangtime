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
        >mdi-arrow-left</v-icon
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
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex xs12 md8 lg6>
            <v-layout
              justify-space-around
              align-center
              fill-height
              text-center
              v-bind="binding"
              class="canvas"
            >
              <!-- circle -->
              <v-flex class="Counter">
                <v-progress-circular
                  class="mt-3"
                  :rotate="270"
                  :size="300"
                  :width="5"
                  :value="progressCircular"
                >
                  <v-flex class="flex-column">
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

                    <div class="subtitle font-weight-bold text-uppercase">
                      {{ progressText }}
                    </div>

                    <div id="timer" class="display-3 font-weight-bold">
                      {{ count(totalTime) }}
                    </div>

                    <div class="bottom-data">
                      <div class="bottom-data__exercise">
                        <div class="data">
                          <v-icon small>mdi-timer</v-icon>
                          <span
                            v-if="currentWorkout && currentWorkout.exercises"
                            >{{ currentStep + 1 }}/{{
                              currentWorkout.exercises.length
                            }}</span
                          >
                        </div>
                      </div>
                      <div
                        v-if="currentExercise.repeat > 1"
                        class="bottom-data__repeat"
                      >
                        <div class="data">
                          <v-icon small>mdi-history</v-icon>
                          <span
                            >{{ ExerciseRepeat - 1 }}/{{
                              currentExercise.repeat
                            }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </v-flex>
                </v-progress-circular>
              </v-flex>

              <!-- hangboard -->

              <v-flex class="Hangboard">
                <v-container fluid class="py-0">
                  <v-row>
                    <v-col cols="12" class="py-0">
                      <hangboard :data="currentExercise"></hangboard>
                    </v-col>
                  </v-row>
                </v-container>
              </v-flex>

              <!-- title -->
              <v-flex class="Title">
                <div class="title">
                  <span v-if="currentExercise.repeat > 1"
                    >{{ currentExercise.repeat }}x
                  </span>
                  <span v-if="currentExercise.pullups > 1"
                    >{{ currentExercise.pullups }}
                  </span>
                  <span
                    v-if="
                      currentExercise.left === null ||
                        currentExercise.right === null
                    "
                    >One-Arm
                  </span>
                  <span>{{ options[currentExercise.exercise].name }}</span>
                  <span v-if="currentExercise.pullups > 0"> Pull-up</span>
                  <span v-if="currentExercise.pullups > 1">s</span>
                </div>
                <div class="subheading">
                  <span>Hold for {{ currentExercise.hold }} sec. </span>
                  <span v-if="currentExercise.repeat > 1">
                    Rest for {{ currentExercise.rest }} sec.</span
                  >
                </div>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
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
          <v-icon v-if="!paused">mdi-pause</v-icon>
          <v-icon v-else>mdi-play</v-icon>
        </v-btn>
        <v-btn
          v-if="timer === null"
          slot="activator"
          color="secondary"
          dark
          fab
          @click="startWorkout"
        >
          <v-icon>mdi-play</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-content>
  </v-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import * as NoSleep from 'nosleep.js/dist/NoSleep'
import Hangboard from '@/components/Hangboard'
import { getImg, count, speak, sound } from '@/misc/helpers'

export default {
  components: { Hangboard },
  props: {
    id: String,
    userId: String
  },
  data: () => ({
    currentStep: 0,
    ExerciseRepeat: 1,
    totalTime: 0,
    timer: null,
    paused: false,
    progressCircular: 0,
    progressText: 'Press Play',
    initialTime: 0,
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
          // this.initialTime = this.totalTime
          this.totalTime = this.currentExercise.hold
          // reset clock
          this.initialTime = this.totalTime
          this.ExerciseStep += 1
          break
        // HOLD
        case 1:
          if (this.totalTime > 0) {
            this.exerciseHold()
            this.updateTime()
            break
          }
          if (this.currentExercise.repeat > 0) {
            this.totalTime = this.currentExercise.rest
            this.initialTime = this.totalTime
          }
          this.ExerciseStep += 1
          break
        // REST
        case 2:
          if (this.totalTime > 0) {
            this.exerciseRest()
            this.updateTime()
            break
          }
          if (this.currentExercise.repeat > 0) {
            // set time for holding
            this.totalTime = this.currentExercise.hold
            // reset clock
            this.initialTime = this.totalTime
            this.ExerciseStep += 1
            break
          }
          this.ExerciseStep = 4
          break
        // REPEAT
        case 3:
          if (this.totalTime > 0) {
            this.exerciseHold()
            this.updateTime()
            break
          }
          if (this.ExerciseRepeat !== this.currentExercise.repeat + 1) {
            this.totalTime = this.currentExercise.rest
            // reset clock
            this.initialTime = this.totalTime
            this.ExerciseStep -= 1
            break
          }
          this.ExerciseStep += 1
          break
        // NEXT / FINISH
        case 4:
          if (this.currentStep < this.currentWorkout.exercises.length - 1) {
            // next exercise
            this.currentStep += 1
            // set time
            this.exerciseSetup()
            // resets
            this.ExerciseRepeat = 1
            this.ExerciseStep = 0
            break
          }
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
      this.totalTime = this.currentExercise.pause
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
            this.ExerciseRepeat !== this.currentExercise.repeat)
        ) {
          this.speakText('... and pause')
        }
      }
    },
    exerciseRest() {
      this.progressText = 'Pause'
      // rest: start counting down
      if (this.totalTime <= 4) {
        if (this.totalTime > 1) {
          this.speakText(this.totalTime - 1)
        } else {
          this.vibratePhone()
          this.playSound('start.mp3')
          this.speakText('Go!')
          if (this.ExerciseRepeat !== this.currentExercise.repeat + 1) {
            this.ExerciseRepeat += 1
          }
        }
      }
    },
    exercisePause() {
      this.progressText = 'Pause'
      if (
        this.ExerciseRepeat === 1 &&
        this.initialTime - 1 === this.totalTime
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
          if (this.currentExercise.repeat > 1) {
            textToSpeak += `Than rest for ${this.currentExercise.rest} seconds. `
            textToSpeak += `Repeat ${this.currentExercise.repeat} times.`
          }
        }
        this.speakText(textToSpeak)
      }

      // start count down
      if (this.totalTime <= 4) {
        // if 0
        if (this.totalTime > 1) {
          this.speakText(this.totalTime - 1)
        } else {
          this.vibratePhone()
          this.playSound('start.mp3')
          this.speakText('Go!')
          if (this.ExerciseRepeat !== this.currentExercise.repeat + 1) {
            this.ExerciseRepeat += 1
          }
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
      if (this.user.settings.speak) this.speak(text)
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
            console.log('Wake Lock was released')
          })
          console.log('Wake Lock is active')
        } else {
          console.log('noSleep')
          this.noSleep.enable()
        }
      } catch (err) {
        console.error(`${err.name}, ${err.message}`)
      }
    }
  },
  head: {
    title() {
      return {
        inner: `${this.currentWorkout.name} | Workout `
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

.lap .data {
  font-size: 1.8rem;
  font-weight: bold;
  padding: 0 8px;
}

#app .run {
  .v-toolbar {
    &__content,
    &__extension {
      // sm
      @media (min-width: 600px) {
        flex-basis: 100%;
        max-width: 100%;
      }
      @media (min-width: 960px) {
        flex-basis: 66.6666666667%;
        max-width: 66.6666666667%;
      }
      @media (min-width: 1264px) {
        flex-basis: 50%;
        max-width: 50%;
      }
    }
  }
}
</style>
