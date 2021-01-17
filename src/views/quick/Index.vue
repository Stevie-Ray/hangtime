<template>
  <v-layout class="grades">
    <v-app-bar color="primary" app fixed dark>
      <v-icon @click="$router.push({ name: 'workouts' })">{{
        mdi.arrowLeft
      }}</v-icon>
      <v-toolbar-title>
        {{ $t('Quick workout') }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!--      <v-icon v-if="startWorkout || !defaultTime" @click="resetTime">{{-->
      <!--        mdi.undo-->
      <!--      }}</v-icon>-->
    </v-app-bar>

    <v-main>
      <v-container class="fill-height">
        <v-row class="fill-height" no-gutters>
          <v-col cols="12">
            <v-row
              justify="space-around"
              align="center"
              class="fill-height text-center"
              no-gutters
            >
              <circle-timer
                :total-time="totalTime"
                :current-exercise="currentExercise"
                :start-button="startWorkout"
                :pause-button="pauseWorkout"
                :reset-button="resetWorkout"
              ></circle-timer>

              <v-row justify="center" align="start" no-gutters>
                <v-col cols="6" justify="center">
                  <v-row justify="center" align="start">
                    <!-- Hold -->
                    <v-col cols="12">
                      <v-text-field
                        v-model="hold"
                        :disabled="startWorkout"
                        hide-details
                        min="0"
                        type="number"
                        :label="$t('Hold')"
                        :append-outer-icon="mdi.plus"
                        :prepend-icon="mdi.minus"
                        @click:append-outer="increment('hold')"
                        @click:prepend="decrement('hold')"
                      >
                      </v-text-field>
                    </v-col>
                    <!-- Pause -->
                    <v-col cols="12">
                      <v-text-field
                        v-model="pause"
                        :disabled="startWorkout"
                        min="0"
                        hide-details
                        type="number"
                        :label="$t('Pause')"
                        :append-outer-icon="mdi.plus"
                        :prepend-icon="mdi.minus"
                        @click:append-outer="increment('pause')"
                        @click:prepend="decrement('pause')"
                      >
                      </v-text-field>
                    </v-col>
                    <!-- Repeat -->
                    <v-col cols="12">
                      <v-text-field
                        v-model="repeat"
                        :disabled="startWorkout"
                        hide-details
                        min="0"
                        type="number"
                        :label="$t('Repeat')"
                        :append-outer-icon="mdi.plus"
                        :prepend-icon="mdi.minus"
                        @click:append-outer="increment('repeat')"
                        @click:prepend="decrement('repeat')"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
      <v-fab-transition>
        <v-btn
          v-if="startWorkout"
          slot="activator"
          color="secondary"
          fixed
          bottom
          right
          fab
          @click="pauseWorkout = !pauseWorkout"
        >
          <v-icon v-if="!pauseWorkout">{{ mdi.pause }}</v-icon>
          <v-icon v-else>{{ mdi.play }}</v-icon>
        </v-btn>
        <v-btn
          v-else
          slot="activator"
          color="secondary"
          fixed
          bottom
          right
          fab
          @click="startWorkout = !startWorkout"
        >
          <v-icon>{{ mdi.play }}</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-main>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import CircleTimer from '@/components/molecules/CircleTimer/CircleTimer'
import {
  mdiArrowLeft,
  mdiPlay,
  mdiPlus,
  mdiMinus,
  mdiPause,
  mdiUndo
} from '@mdi/js'

export default {
  components: {
    CircleTimer
  },
  data: () => ({
    currentExercise: {
      hold: 10,
      pause: 5,
      rest: 5,
      repeat: 0
    },
    paused: false,
    initialStart: true,
    startWorkout: false,
    pauseWorkout: false,
    resetWorkout: false,
    mdi: {
      arrowLeft: mdiArrowLeft,
      play: mdiPlay,
      pause: mdiPause,
      plus: mdiPlus,
      minus: mdiMinus,
      undo: mdiUndo
    }
  }),
  head: {
    title: {
      inner: 'Quick workout'
    },
    meta: [
      {
        name: 'description',
        content: '',
        id: 'desc'
      }
    ]
  },
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('app', ['networkOnLine']),
    totalTime() {
      return (
        (this.currentExercise.hold + this.currentExercise.pause) *
        (this.currentExercise.repeat + 1)
      )
    },
    defaultTime() {
      return (
        this.currentExercise ===
        {
          hold: 10,
          pause: 5,
          rest: 5,
          repeat: 0
        }
      )
    },
    hold: {
      get() {
        return this.currentExercise.hold
      },
      set(value) {
        this.currentExercise.hold = parseInt(value, 10)
      }
    },
    rest: {
      get() {
        return this.currentExercise.rest
      },
      set(value) {
        this.currentExercise.rest = parseInt(value, 10)
      }
    },
    pause: {
      get() {
        return this.currentExercise.pause
      },
      set(value) {
        this.currentExercise.rest = parseInt(value, 10)
        this.currentExercise.pause = parseInt(value, 10)
      }
    },
    repeat: {
      get() {
        return this.currentExercise.repeat
      },
      set(value) {
        this.currentExercise.repeat = parseInt(value, 10)
      }
    }
  },
  methods: {
    resetTime() {
      this.currentExercise = {
        hold: 10,
        pause: 5,
        rest: 5,
        repeat: 0
      }
      this.resetWorkout = !this.resetWorkout
    },
    increment(element) {
      if (this.initialStart) {
        this.currentExercise[element] =
          parseInt(this.currentExercise[element], 10) + 1
        // eslint-disable-next-line no-cond-assign
        if (element === 'pause') {
          this.currentExercise.rest =
            parseInt(this.currentExercise.rest, 10) + 1
        }
      }
    },
    decrement(element) {
      if (this.initialStart && this.currentExercise[element] > 0) {
        this.currentExercise[element] =
          parseInt(this.currentExercise[element], 10) - 1
        if (element === 'pause') {
          this.currentExercise.rest =
            parseInt(this.currentExercise.rest, 10) - 1
        }
      }
    }
  }
}
</script>
