<template>
  <v-layout class="grades">
    <v-app-bar color="primary" app fixed dark>
      <v-icon @click="$router.push({ name: 'workouts' })">{{
        mdi.arrowLeft
      }}</v-icon>
      <v-toolbar-title>
        Quick Workout
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-icon
        v-if="(!initialStart && paused) || !defaultTime"
        @click="resetTime"
        >{{ mdi.undo }}</v-icon
      >
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
              <v-progress-circular
                :rotate="270"
                :size="300"
                :width="5"
                :value="progressCircular"
                class="mt-4"
              >
                <div class="d-flex align-center justify-center flex-column">
                  <div id="timer" class="text-h2 font-weight-bold">
                    <span v-if="timer === null && initialStart">
                      {{ count(totalTime) }}
                    </span>
                    <span v-else>
                      {{ count(total) }}
                    </span>
                  </div>
                  <div class="text--secondary">
                    <span v-if="timer !== null && !initialStart">
                      {{ count(totalTime) }}
                    </span>
                    <span v-else>
                      Press Play
                      <span class="text--primary">(beta)</span>
                    </span>
                  </div>
                </div>
              </v-progress-circular>

              <v-row justify="center" align="start" no-gutters>
                <v-col cols="6" justify="center">
                  <v-row justify="center" align="start">
                    <!-- Hold -->
                    <v-col cols="12">
                      <v-text-field
                        v-model="hold"
                        :disabled="!initialStart"
                        hide-details
                        type="number"
                        label="Hold"
                        :append-outer-icon="mdi.plus"
                        :prepend-icon="mdi.minus"
                        @click:append-outer="increment('holdInput')"
                        @click:prepend="decrement('holdInput')"
                      >
                      </v-text-field>
                    </v-col>
                    <!-- Pause -->
                    <v-col cols="12">
                      <v-text-field
                        v-model="pause"
                        :disabled="!initialStart"
                        hide-details
                        type="number"
                        label="Pause"
                        :append-outer-icon="mdi.plus"
                        :prepend-icon="mdi.minus"
                        @click:append-outer="increment('pauseInput')"
                        @click:prepend="decrement('pauseInput')"
                      >
                      </v-text-field>
                    </v-col>
                    <!-- Repeat -->
                    <v-col cols="12">
                      <v-text-field
                        v-model="repeat"
                        :disabled="!initialStart"
                        hide-details
                        type="number"
                        label="Repeat"
                        :append-outer-icon="mdi.plus"
                        :prepend-icon="mdi.minus"
                        @click:append-outer="increment('repeatInput')"
                        @click:prepend="decrement('repeatInput')"
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
          v-if="timer === null"
          slot="activator"
          color="secondary"
          disabled
          fixed
          bottom
          right
          fab
          @click="startWorkout"
        >
          <v-icon>{{ mdi.play }}</v-icon>
        </v-btn>
        <v-btn
          v-if="timer !== null"
          slot="activator"
          color="secondary"
          fixed
          bottom
          right
          fab
          @click="pauseWorkout"
        >
          <v-icon v-if="!paused">{{ mdi.pause }}</v-icon>
          <v-icon v-else>{{ mdi.play }}</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-main>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import {
  mdiArrowLeft,
  mdiPlay,
  mdiPlus,
  mdiMinus,
  mdiPause,
  mdiUndo
} from '@mdi/js'
import { count } from '@/misc/helpers'
import NoSleep from 'nosleep.js'

export default {
  data: () => ({
    holdInput: 15,
    pauseInput: 30,
    repeatInput: 0,
    total: 0,
    timer: null,
    initialTime: 0,
    initialStart: true,
    progressCircular: 0,
    paused: false,
    noSleep: new NoSleep(),
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
      return (this.holdInput + this.pauseInput) * (this.repeatInput + 1)
    },
    defaultTime() {
      return (
        this.holdInput === 15 &&
        this.pauseInput === 30 &&
        this.repeatInput === 0
      )
    },
    hold: {
      get() {
        return this.holdInput
      },
      set(value) {
        this.holdInput = parseInt(value, 10)
      }
    },
    pause: {
      get() {
        return this.pauseInput
      },
      set(value) {
        this.pauseInput = parseInt(value, 10)
      }
    },
    repeat: {
      get() {
        return this.repeatInput
      },
      set(value) {
        this.repeatInput = parseInt(value, 10)
      }
    }
  },
  methods: {
    count,
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
    countdown() {
      if (this.total > 0) {
        this.updateTime()
      } else {
        this.finishWorkout()
      }
    },
    exerciseSetup() {
      if (this.initialStart) {
        this.total = this.totalTime
        // finish Setup
        this.initialTime = this.totalTime
      }
      this.initialStart = false
    },
    updateTime() {
      this.total -= 1
      // // update circle
      this.progressCircular =
        ((this.initialTime - this.total) * 100) / this.initialTime
    },
    pauseWorkout() {
      if (!this.paused) {
        this.noSleep.disable()
      } else {
        this.requestWakeLock()
      }
      this.paused = !this.paused
    },
    finishWorkout() {
      this.noSleep.disable()
      this.paused = true
      clearInterval(this.timer)
    },
    resetTime() {
      this.holdInput = 15
      this.pauseInput = 30
      this.repeatInput = 0
      this.total = 0
      if (this.timer !== null) {
        clearInterval(this.timer)
      }
      this.timer = null
      this.initialTime = 0
      this.initialStart = true
      this.progressCircular = 0
      this.paused = false
    },
    increment(element) {
      if (this.initialStart) {
        this[element] = parseInt(this[element], 10) + 1
      }
    },
    decrement(element) {
      if (this.initialStart) {
        this[element] = parseInt(this[element], 10) - 1
      }
    }
  }
}
</script>
