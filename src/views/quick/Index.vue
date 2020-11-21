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
    </v-app-bar>

    <v-main>
      <v-container class="fill-height">
        <v-row class="fill-height">
          <v-col cols="12">
            <v-row
              justify="space-around"
              align="center"
              class="fill-height text-center"
            >
              <v-progress-circular
                :rotate="270"
                :size="200"
                :width="5"
                :value="totalPercentage"
                class="mt-4"
              >
                <div class="d-flex align-center justify-center flex-column">
                  <div id="timer" class="text-h2 font-weight-bold">
                    {{ count(totalTime) }}
                  </div>
                  <div class="text--secondary">in development</div>
                </div>
              </v-progress-circular>

              <v-row justify="center" align="start">
                <v-col cols="6" justify="center">
                  <v-row justify="center" align="start">
                    <!-- Hold -->
                    <v-col cols="12">
                      <v-text-field
                        v-model="hold"
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
        <v-btn fixed fab bottom right disabled color="secondary">
          <v-icon>{{ mdi.play }}</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-main>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { mdiArrowLeft, mdiPlay, mdiPlus, mdiMinus } from '@mdi/js'
import { count } from '@/misc/helpers'

export default {
  data: () => ({
    holdInput: 15,
    pauseInput: 30,
    repeatInput: 0,
    total: 20,
    mdi: {
      arrowLeft: mdiArrowLeft,
      play: mdiPlay,
      plus: mdiPlus,
      minus: mdiMinus
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
    totalPercentage() {
      return 100
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
    increment(element) {
      this[element] = parseInt(this[element], 10) + 1
    },
    decrement(element) {
      this[element] = parseInt(this[element], 10) - 1
    }
  }
}
</script>
