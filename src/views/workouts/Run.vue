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
                  <span>Rest for {{ currentExercise.rest }} sec.</span>
                </div>
              </v-flex>
            </v-layout>
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
    progressCircular: 0,
    initalTime: 0,
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
    ...mapGetters('workouts', ['workoutById']),
    // vuetify grid-system breakpoint binding
    binding() {
      const binding = {}

      if (this.$vuetify.breakpoint.xs) binding.column = true

      return binding
    },
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
    },
    currentExercise() {
      // set current exercise based on currentStep
      if (!this.exercises) return
      return this.exercises[this.currentStep]
    },
    currentWorkout() {
      return this.workoutById(this.id)
    }
  },
  created() {
    // TODO: remove ugly code
    this.$store.dispatch('exercises/getWorkoutExercises', this.id)
  },
  mounted() {
    // set timer
    this.timer = setInterval(() => this.countdown(), 1000)

    // TODO: why do i get the voice list?
    this.voiceList = this.synth
      .getVoices()
      .filter(voice => /^(en|EN)/.test(voice.lang))
  },
  updated() {
    this.$nextTick(function() {
      // update Timer
      if (this.currentExercise && this.initalTime === 0) {
        this.totalTime = this.currentExercise.pause
        // set initalTime to totalTime
        this.initalTime = this.totalTime
      }
      //
      if (this.stepRepeat === 0 && this.initalTime - 1 === this.totalTime) {
        // speak if enabled
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
            `for ${this.currentExercise.hold} seconds. Than rest for ${this.currentExercise.rest} seconds.`
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
      // if there is time left
      if (this.totalTime >= 1) {
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
      }
      // if step repeats
      else if (this.stepRepeat !== this.currentExercise.repeat) {
        this.stepRepeat = this.stepRepeat + 1

        // set timers
        this.totalTime = this.currentExercise.hold + this.currentExercise.rest
        this.initalTime = this.totalTime
      }
      // check if all steps are done
      else if (this.currentStep < this.exercises.length - 1) {
        // // set next exercise
        this.currentStep = this.currentStep + 1
        this.stepRepeat = 0

        // set time
        this.totalTime = this.currentExercise.pause
        this.initalTime = this.totalTime
      }
      // done!
      else {
        this.finished = true
        // this.stop()
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
.canvas {
  &:not(.column) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas: 'Counter Hangboard' 'Counter Title';
    height: inherit;
    @media (min-width: 960px) {
      padding-top: 40px;
      padding-bottom: 40px;
    }
  }
  .Counter {
    grid-area: Counter;
  }

  .Hangboard {
    grid-area: Hangboard;
    width: 100%;
  }

  .Title {
    grid-area: Title;
  }
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
