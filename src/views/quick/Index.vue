<template>
  <app-container name="Quick workout" :back-link="{ name: 'workouts' }">
    <template #icons>
      <!--      <v-icon v-if="startWorkout || !defaultTime" @click="resetTime">{{-->
      <!--        mdi.undo-->
      <!--      }}</v-icon>-->
    </template>

    <v-row
      justify="space-around"
      align="center"
      class="fill-height text-center canvas column"
      no-gutters
    >
      <circle-timer
        :current-exercise="currentExercise"
        :start-button="startWorkout"
        :pause-button="pauseWorkout"
      ></circle-timer>

      <v-col cols="6" class="pt-4" justify="center">
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
  </app-container>
</template>

<script>
import { mapState } from 'vuex'
import { mdiPlay, mdiPlus, mdiMinus, mdiPause, mdiUndo } from '@mdi/js'
import AppContainer from '@/components/molecules/AppContainer/AppContainer'
import CircleTimer from '@/components/molecules/CircleTimer/CircleTimer'

export default {
  components: {
    AppContainer,
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
    mdi: {
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
