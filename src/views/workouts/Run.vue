<template>
  <v-layout row class="profile">
    <v-app-bar v-if="currentWorkout" color="primary" app fixed dark>
      <v-icon
        @click="
          $router.push({ name: 'workout', params: { id: currentWorkout.id } })
        "
        >mdi-arrow-left</v-icon
      >
      <v-avatar size="32px">
        <v-img
          v-if="networkOnLine"
          :src="user.photoURL"
          :alt="user.displayName"
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
              text-xs-center
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
                  <v-avatar
                    size="80"
                    aspect-ratio="1"
                    class="grey lighten-2 mb-3"
                  >
                    <img
                      :alt="options[currentExercise.exercise].name"
                      :src="getImg(options[currentExercise.exercise].image)"
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
                        {{ currentStep + 1 }}/{{
                          currentWorkout.exercises.length
                        }}
                      </div>
                    </div>
                    <div
                      v-if="currentExercise.repeat > 1"
                      class="bottom-data__repeat"
                    >
                      <div class="data">
                        <v-icon small>mdi-restore-clock</v-icon>
                        {{ stepRepeat }}/{{ currentExercise.repeat }}
                      </div>
                    </div>
                  </div>
                </v-progress-circular>
              </v-flex>

              <!-- hangboard -->
              <v-flex class="Hangboard">
                <hangboard :data="currentExercise"></hangboard>
              </v-flex>

              <!-- title -->
              <v-flex class="Title">
                <div class="title">
                  <span v-if="currentExercise.repeat > 1"
                    >{{ currentExercise.repeat }}x</span
                  >
                  <span v-if="currentExercise.pullups > 1">
                    {{ currentExercise.pullups }}</span
                  >
                  <span> {{ options[currentExercise.exercise].name }}</span>
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
          large
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
          large
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
import Hangboard from '@/components/Hangboard'
import { getImg, count, speak, sound } from '@/misc/helpers'

export default {
  components: { Hangboard },
  props: {
    id: String
  },
  data: () => ({
    currentStep: 0,
    stepRepeat: 0,
    totalTime: 0,
    timer: null,
    paused: false,
    progressCircular: 0,
    progressText: 'Press Play',
    initialTime: 0,
    synth: window.speechSynthesis,
    voiceList: []
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
      // set current exercise based on currentStep
      if (!this.currentWorkout) return
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
  methods: {
    getImg,
    count,
    speak,
    sound,
    countdown() {
      // init countdown
      if (this.initialTime === 0) {
        this.totalTime = this.currentExercise.pause
        // set initialTime to totalTime to prevent next init
        this.initialTime = this.totalTime
      }

      // if there is time left
      if (this.totalTime > 0) {

        // totalTime -1
        this.totalTime = this.totalTime - 1

        // update circle
        this.progressCircular =
          ((this.initialTime - this.totalTime) * 100) / this.initialTime

        // STATES
        if (this.stepRepeat !== 0) {

          // STATE REST: check if rest && if hold time is done && not last repeat
          if (
            this.currentExercise.rest > 0 &&
            this.totalTime < this.currentExercise.rest
          ) {
            this.progressText = 'Rest'


              // this happens only once
              if (this.totalTime === this.currentExercise.rest - 1) {

                  this.vibratePhone
                  this.playSound('stop.mp3')
                  this.speakText('... and rest')


              }
              // rest: start counting down
              if (this.totalTime <= 3 &&
                      this.stepRepeat !== this.currentExercise.repeat) {

                // if 0
                if (this.totalTime > 0) {
                  this.speakText(this.totalTime)
                } else {
                  this.vibratePhone
                  this.playSound('start.mp3')
                  this.speakText('Go!')
                }
              }

          }

          // STATE: HOLD -> eenmalig
          if (
            this.totalTime ===
            this.currentExercise.hold + this.currentExercise.rest - 1
          ) {
            this.progressText = 'Hold'
          }

          if (this.totalTime === 0 && this.currentExercise.repeat === 1) {
            this.playSound('stop.mp3')
            if (this.currentStep + 1 !== this.currentWorkout.exercises.length) {
              this.speakText('... and pause')
            }
          }
        }
        // STATE: PAUSE
        else {
          this.progressText = 'Pause'

          if (
            this.stepRepeat === 0 &&
            this.initialTime - 1 === this.totalTime
          ) {
            this.speakText('Next exercise')
            if (this.currentExercise.pullups > 1) {
              this.speakText(
                `${this.currentExercise.pullups +
                  this.options[this.currentExercise.exercise].name}s`
              )
            } else {
              this.speakText(this.options[this.currentExercise.exercise].name)
            }
            this.speakText(`for ${this.currentExercise.hold} seconds.`)
            if (
              this.currentExercise.rest > 0 &&
              this.currentExercise.repeat > 1
            ) {
              this.speakText(
                `Than rest for ${this.currentExercise.rest} seconds.`
              )

              // let string = ''
              // TODO fix pull-ups
              // if (this.currentExercise.pullups > 1) {
              //   string += `${this.currentExercise.pullups}`
              // }
              // string += ` ${this.options[this.currentExercise.exercise].name}`
              // if (this.currentExercise.pullups > 1) {
              //   string += 's'
              // }
            }
          }

          // start count down
          if (this.totalTime <= 3 ) {
            // if 0
            if (this.totalTime > 0) {
              this.speakText(this.totalTime)
            } else {
              this.vibratePhone
              this.playSound('start.mp3')
              this.speakText('Go!')
            }
          }
        }
      }

      // if step repeats !== exercise repeats
      else if (this.stepRepeat !== this.currentExercise.repeat) {

        this.stepRepeat = this.stepRepeat + 1

        // set timers
        this.totalTime = this.currentExercise.hold + this.currentExercise.rest
        this.initialTime = this.totalTime
      }

      // check if all steps are done
      else if (this.currentStep < this.currentWorkout.exercises.length - 1) {
        // // set next exercise
        this.currentStep = this.currentStep + 1
        this.stepRepeat = 0

        // set time
        this.totalTime = this.currentExercise.pause
        this.initialTime = this.totalTime
      }
      // done!
      else {
        this.progressText = 'Done'
        this.speakText('Well done')
        this.paused = true
        clearInterval(this.timer)
      }
    },
    startWorkout() {
      this.timer = setInterval(() => {
        if (!this.paused) this.countdown()
      }, 1000)
    },
    pauseWorkout() {
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.bottom-data {
  > div {
    display: inline-block;
    width: 50%;
  }
}

.lap .data {
  font-size: 1.8rem;
  font-weight: bold;
  padding: 0 8px;
}

#app .profile {
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
