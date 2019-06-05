<template>
  <v-layout row class="profile">
    <v-app-bar v-if="data !== null" color="primary" app fixed dark>
      <v-icon
        @click="$router.push({ name: 'workout', params: { id: data.id } })"
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
        {{ data.name }}
        <div class="subheading">{{ data.description }}</div>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content v-if="currentExercise !== null">
      <v-container fluid fill-height>
        <v-layout justify-space-around column text-xs-center>
          <!-- circle -->
          <v-flex xs12 sm8 md6>
            <v-progress-circular
              class="mt-3"
              :rotate="270"
              :size="300"
              :width="5"
              :value="progressCircular"
            >
              <v-avatar size="80" aspect-ratio="1" class="grey lighten-2 mb-3">
                <img
                  :alt="options[currentExercise.exercise].name"
                  :src="getImg(options[currentExercise.exercise].image)"
                />
              </v-avatar>

              <div class="subtitle font-weight-bold text-uppercase">
                {{ direction }}
              </div>

              <div id="timer" class="display-3 font-weight-bold">
                {{ count(totalTime) }}
              </div>

              <div class="bottom-data">
                <div class="bottom-data__exercise">
                  <div class="data">
                    <v-icon small>mdi-timer</v-icon>
                    {{ currentStep + 1 }}/{{ exercises.length }}
                  </div>
                </div>
                <div
                  v-if="currentExercise.repeat > 1"
                  class="bottom-data__repeat"
                >
                  <div class="data">
                    <v-icon small>mdi-repeat</v-icon>
                    0/{{ currentExercise.repeat }}
                  </div>
                </div>
              </div>
            </v-progress-circular>
          </v-flex>

          <!-- hangboard -->
          <v-flex xs12 sm8 md6>
            <div
              class="hangboard"
              :class="
                companies[
                  user.settings.hangboards[user.settings.selected].company
                ].hangboards[
                  user.settings.hangboards[user.settings.selected].hangboard
                ].name
              "
            >
              <div class="leftside">
                <img
                  :class="
                    companies[
                      user.settings.hangboards[user.settings.selected].company
                    ].hangboards[
                      user.settings.hangboards[user.settings.selected].hangboard
                    ].holds[currentExercise.left].id
                  "
                  :src="
                    getImg(
                      companies[
                        user.settings.hangboards[user.settings.selected].company
                      ].hangboards[
                        user.settings.hangboards[user.settings.selected]
                          .hangboard
                      ].image
                    )
                  "
                />
              </div>
              <div class="rightside">
                <img
                  :class="
                    companies[
                      user.settings.hangboards[user.settings.selected].company
                    ].hangboards[
                      user.settings.hangboards[user.settings.selected].hangboard
                    ].holds[currentExercise.right].id
                  "
                  :src="
                    getImg(
                      companies[
                        user.settings.hangboards[user.settings.selected].company
                      ].hangboards[
                        user.settings.hangboards[user.settings.selected]
                          .hangboard
                      ].image
                    )
                  "
                />
              </div>
            </div>
          </v-flex>

          <!-- title -->
          <v-flex xs12 sm8 md6>
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
              <span>Rest for {{ currentExercise.rest }} sec.</span>
            </div>
          </v-flex>
        </v-layout>
      </v-container>

      <v-speed-dial bottom right fixed>
        <v-btn slot="activator" color="secondary" dark fab large>
          <v-icon>mdi-stop</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-content>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { getImg, count, speak, sound } from '@/misc/helpers'

export default {
  props: {
    data: Object
  },
  data: () => ({
    currentStep: 0,
    stepRepeat: 0,
    currentExercise: null,
    totalTime: 0,
    timer: null,
    progressCircular: 0,
    initial: 0,
    synth: window.speechSynthesis,
    voiceList: [],
    down: false,
    finished: false
  }),
  computed: {
    ...mapState('app', ['networkOnLine']),
    ...mapState('authentication', ['user']),
    ...mapState('exercises', ['exercises', 'options']),
    ...mapState('companies', ['companies']),
    direction() {
      if (this.finished) {
        return 'Done'
      }
      if (this.stepRepeat === 0) {
        return 'Pause'
      }
      if (this.down) {
        return 'Rest'
      }
      let string = ''
      if (this.currentExercise.pullups > 1) {
        string += `${this.currentExercise.pullups}`
      }
      string += ` ${this.options[this.currentExercise.exercise].name}`
      if (this.currentExercise.pullups > 1) {
        string += 's'
      }
      return string
    }
  },
  created() {
    // TODO: remove ugly code
    this.$store.dispatch('exercises/getWorkoutExercises', this.data.id)

    // set current exercise based on currentStep
    this.currentExercise = this.exercises[this.currentStep]
    // update Timer
    this.totalTime = this.currentExercise.pause
    // set timer
    this.timer = setInterval(() => this.countdown(), 1000)
    // set initalTime to totalTime
    this.initalTime = this.totalTime
    // get voice list
    this.voiceList = this.synth
      .getVoices()
      .filter(voice => /^(en|EN)/.test(voice.lang))
  },
  mounted() {
    //
  },
  updated() {
    this.$nextTick(function() {
      if (this.stepRepeat === 0 && this.initalTime - 1 === this.totalTime) {
        if (this.user.settings.speak) {
          this.speak('Next exercise')
          if (this.currentExercise.pullups > 1) {
            this.speak(
              `${this.currentExercise.pullups +
                this.options[this.currentExercise.exercise].name}s`
            )
          } else {
            this.speak(this.options[this.currentExercise.exercise].name)
          }
          this.speak(
            `for ${this.currentExercise.hold} seconds. Than rest for ${
              this.currentExercise.rest
            } seconds.`
          )
        }
      }

      if (
        this.stepRepeat !== 0 &&
        this.totalTime === this.currentExercise.rest
      ) {
        if (this.user.settings.vibrate) {
          navigator.vibrate([80, 40, 120])
        }
        if (this.user.settings.sound) {
          this.sound('stop.mp3')
        }
        if (this.user.settings.speak) {
          this.speak('... and rest')
        }
      }

      if (this.totalTime <= 3) {
        if (this.totalTime === 0) {
          if (this.user.settings.vibrate) {
            navigator.vibrate([80, 40, 120])
          }
          if (this.user.settings.sound) {
            this.sound('start.mp3')
          }
          if (this.user.settings.speak) {
            this.speak('Go!')
          }
        } else if (this.user.settings.speak) {
          this.speak(this.totalTime)
        }
      }
    })
  },
  methods: {
    getImg,
    count,
    speak,
    sound,
    countdown() {
      if (this.totalTime >= 1) {
        // if there is time left

        // totalTime -1
        this.totalTime = this.totalTime - 1
        // update circle
        this.progressCircular =
          ((this.initalTime - this.totalTime) * 100) / this.initalTime

        if (this.stepRepeat !== 0) {
          if (this.totalTime < this.currentExercise.rest) {
            this.down = true
          }
          if (
            this.totalTime ===
            this.currentExercise.hold + this.currentExercise.rest - 1
          ) {
            this.down = false
          }
        } else {
          // this.down = false;
        }
      } else if (this.stepRepeat !== this.currentExercise.repeat) {
        // if step repeats
        this.stepRepeat = this.stepRepeat + 1

        // set timers
        this.totalTime = this.currentExercise.hold + this.currentExercise.rest
        this.initalTime = this.totalTime
      } else if (this.currentStep < this.exercises.length - 1) {
        // check if all steps are done
        this.currentStep = this.currentStep + 1
        this.stepRepeat = 0

        // set next exercise
        this.currentExercise = this.exercises[this.currentStep]

        // set time
        this.totalTime = this.currentExercise.pause
        this.initalTime = this.totalTime
      } else {
        // done!
        // this.finished = true
        // this.stop()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
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
</style>
