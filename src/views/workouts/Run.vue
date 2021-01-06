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
      <v-avatar size="32px" class="grey lighten-2">
        <v-img
          v-if="networkOnLine && currentWorkout.user.photoURL"
          :src="currentWorkout.user.photoURL"
          :alt="currentWorkout.user.displayName"
        />
      </v-avatar>
      <v-toolbar-title>
        {{ currentWorkout.name }}
        <div class="subheading">{{ currentWorkout.description }}</div>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main v-if="currentExercise">
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
                <circle-timer
                  :current-exercise="currentExercise"
                  :current-workout="currentWorkout"
                  :start-button="startWorkout"
                  :pause-button="pauseWorkout"
                  @current-step="editCurrentStep"
                ></circle-timer>
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
                  <span
                    >{{
                      $t('Hold for {hold} sec.', { hold: currentExercise.hold })
                    }}
                  </span>
                  <span v-if="currentExercise.repeat > 0">
                    {{
                      $t('Rest for {rest} sec.', { rest: currentExercise.rest })
                    }}
                  </span>
                </div>
                <div
                  v-if="currentExercise.notes !== ''"
                  class="text--secondary"
                >
                  {{ currentExercise.notes }}
                </div>
              </div>
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
import { mapState, mapGetters } from 'vuex'
import Hangboard from '@/components/Hangboard'
import Hand from '@/components/Hand'
import WorkoutItemName from '@/components/WorkoutItemName'
import CircleTimer from '@/components/CircleTimer'

import { mdiArrowLeft, mdiPlay, mdiPause } from '@mdi/js'

export default {
  components: { WorkoutItemName, Hangboard, Hand, CircleTimer },
  props: {
    id: String,
    userId: String
  },
  data: () => ({
    currentStep: 0,
    initialStart: true,
    startWorkout: false,
    pauseWorkout: false,
    mdi: {
      play: mdiPlay,
      pause: mdiPause,
      arrowLeft: mdiArrowLeft
    },
    meta: {
      title: 'Workout'
    }
  }),
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
  },
  computed: {
    ...mapState('app', ['networkOnLine']),
    ...mapState('authentication', ['user']),
    ...mapState('workouts', ['grip', 'exercises']),
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
  beforeDestroy() {
    // make sure timer is disabled on leave
    if (this.timer !== null) clearInterval(this.timer)
  },
  mounted() {
    if (this.currentWorkout) {
      this.meta.title = `${this.currentWorkout.name} | Workout `
      // eslint-disable-next-line vue/custom-event-name-casing
      this.$emit('updateHead')
    }
  },
  methods: {
    editCurrentStep(step) {
      this.currentStep = step
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.bottom-data {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  > div {
    flex: 1 1 auto;

    span:last-child {
      padding-right: 8px;
      display: inline-block;
    }

    &:last-child span:last-child {
      padding-right: 0;
      display: inline-block;
    }

    svg {
      padding-right: 2px;
      height: 20px;
      width: 20px;
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
