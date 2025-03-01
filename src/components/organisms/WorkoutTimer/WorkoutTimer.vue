<script setup lang="ts">
import { computed, ref, onBeforeUnmount, useTemplateRef, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'

import { Workout } from '@/models/workout.model'
import { Session } from '@/models/session.model'
import { ExerciseState } from '@/enums/exercise'
import { time } from '@/helpers'

import WorkoutBluetooth from '@/components/atoms/WorkoutBluetooth/WorkoutBluetooth.vue'
import WorkoutShare from '@/components/atoms/WorkoutShare/WorkoutShare.vue'
import WorkoutSubscribe from '@/components/atoms/WorkoutSubscribe/WorkoutSubscribe.vue'
import ExerciseCard from '@/components/molecules/ExerciseCard/ExerciseCard.vue'
import ExerciseAbout from '@/components/molecules/ExerciseAbout/ExerciseAbout.vue'
import WorkoutComplete from '@/components/molecules/dialog/WorkoutComplete/WorkoutComplete.vue'
import SubscribeToApp from '@/components/molecules/dialog/SubscribeToApp/SubscribeToApp.vue'
import SliderBluetooth from '@/components/atoms/SliderBluetooth/SliderBluetooth.vue'

import { useAuthenticationStore } from '@/stores/authentication.store'
import { useActivitiesStore } from '@/stores/activities.store'
import { useBluetoothStore } from '@/stores/bluetooth.store'

import { usePlayBilling } from '@/composables/usePlayBilling'

const { canSubscribePlayBilling, subscribeLimit } = usePlayBilling()

const { t } = useI18n()

const { updateUser } = useAuthenticationStore()
const { createUserActivity } = useActivitiesStore()

const { user } = storeToRefs(useAuthenticationStore())
const { bluetoothOutput } = storeToRefs(useBluetoothStore())

const workout = defineModel<Workout>({ required: true })

const { quick = false } = defineProps<{
  /** Quick workout */
  quick?: boolean
}>()

const session = reactive(new Session(workout.value, user.value))

// dialogs
const dialogWorkoutSubscribe = ref(true)
const dialogWorkoutComplete = ref(false)

onBeforeUnmount(() => {
  // make sure timer is disabled and speech is stopped
  session.stopTimer()
})

const exerciseTime = computed<number>(() => {
  if (session.exercise)
    return (
      (session.exercise.hold + session.exercise.rest) * (session.exercise.repeat + 1) -
      session.exercise.rest
    )
  return 0
})

const progress = useTemplateRef('progress')

const progressTransition = computed(() => {
  if (session.clock === 0 || session.isSkippingRest) return 'none'
  if (
    session.clockText === t('Go') &&
    (session.currentExerciseState === ExerciseState.HOLD ||
      session.currentExerciseState === ExerciseState.REPEAT)
  ) {
    return 'width 0s linear, background-color 0.5s ease'
  }
  return `width ${session.clock}s linear, background-color 0.5s ease`
})

const toggleWorkout = () => {
  if (!session.pauseTimer) {
    if (progress.value?.$el) {
      const computedStyle = window.getComputedStyle(progress.value.$el)
      const currentWidth = computedStyle.getPropertyValue('width')
      progress.value.$el.style.width = currentWidth
      progress.value.$el.style.transition = 'none'
    }
  } else {
    if (progress.value?.$el) {
      progress.value.$el.style.removeProperty('width')
      progress.value.$el.style.transition = progressTransition.value
    }
  }

  if (!session.pauseTimer) {
    session.releaseWakeLock()
  } else {
    session.requestWakeLock()
  }
  // pause timer
  session.pauseTimer = !session.pauseTimer
}

const updateUserCompleted = () => {
  if (user.value) {
    // check if completed object exists
    if (!user?.value?.completed) {
      user.value.completed = {
        time: 0,
        hold: 0,
        amount: 0
      }
    }
    // resolve bug
    if (Number.isNaN(user.value.completed.time)) user.value.completed.time = 0
    if (Number.isNaN(user.value.completed.hold)) user.value.completed.hold = 0
    if (Number.isNaN(user.value.completed.amount)) user.value.completed.amount = 0
    // update values
    user.value.completed.time += session.workoutCompleteTimeTotal
    user.value.completed.hold += session.workoutCompleteTimeHanging
    user.value.completed.amount += 1
    updateUser()
  }
}

watch(
  () => session.workoutComplete,
  () => {
    if (session.workoutComplete) {
      createUserActivity(
        session.workoutCompleteTimeTotal,
        session.workoutCompleteTimeHanging,
        workout.value
      )
      updateUserCompleted()
      // open dialog
      dialogWorkoutComplete.value = true
    }
  }
)

onBeforeUnmount(() => {
  // make sure timer is disabled and speech is stopped
  session.stopTimer()
})
</script>

<template>
  <v-container
    ref="progress"
    v-if="workout?.exercises"
    :class="{
      rest:
        session.currentExerciseState !== ExerciseState.HOLD &&
        session.currentExerciseState !== ExerciseState.REPEAT,
      hang:
        session.currentExerciseState === ExerciseState.HOLD ||
        session.currentExerciseState === ExerciseState.REPEAT,
      pause: session.pauseTimer
    }"
    :style="{ transition: progressTransition }"
    class="position-absolute h-100 px-0 py-0 progress"
  ></v-container>
  <v-container v-if="workout?.exercises" class="position-relative">
    <v-row justify="center">
      <v-col cols="12" md="7" class="d-flex flex-column" style="min-height: 85vh">
        <v-row align="center" justify="center">
          <v-col class="text-center pb-4" cols="12" sm="8">
            <v-row align="center">
              <v-col cols="12" class="d-flex justify-space-between align-center">
                <slider-bluetooth
                  v-if="bluetoothOutput?.massLeft"
                  :stream="bluetoothOutput.massLeft"
                />
                <div class="timer w-100">
                  <div class="text-h1">
                    {{ time(session.clock) }}
                  </div>
                  <div class="text-h6 pt-2 mb-4" style="font-size: 1.5rem !important">
                    {{ session.clockText }}
                  </div>
                  <div v-if="bluetoothOutput?.massTotal" style="overflow: hidden">
                    <v-row align="center" justify="space-evenly">
                      <v-col class="text-center">
                        <div class="text-caption text-uppercase">
                          {{ t('Max') }}
                        </div>
                        <div class="text-h6">
                          <span> {{ bluetoothOutput.massMax }} KG</span>
                        </div>
                      </v-col>
                      <v-col v-if="workout?.exercises?.length > 1" class="text-center">
                        <div class="text-caption text-uppercase">
                          {{ t('Total') }}
                        </div>
                        <div class="text-h6">
                          <span> {{ bluetoothOutput.massTotal }} KG</span>
                        </div>
                      </v-col>
                      <v-col v-if="workout?.exercises" class="text-center">
                        <div class="text-caption text-uppercase">
                          {{ t('Average') }}
                        </div>
                        <div class="text-h6">
                          <span> {{ bluetoothOutput.massAverage }} KG</span>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </div>
                <slider-bluetooth
                  v-if="bluetoothOutput?.massRight"
                  :stream="bluetoothOutput.massRight"
                />
              </v-col>
            </v-row>
            <v-row class="timer" align="center" justify="space-evenly">
              <v-col class="text-center">
                <div class="text-caption text-uppercase">
                  {{ t('Time') }}
                </div>
                <div class="text-h6">
                  <span v-if="session.clockText === t('Go')">∞</span>
                  <span v-else>{{ time(exerciseTime) }}</span>
                </div>
              </v-col>
              <v-col v-if="workout?.exercises?.length > 1" class="text-center">
                <div class="text-caption text-uppercase">
                  {{ t('Exercise') }}
                </div>
                <div class="text-h6">
                  {{ session.currentExercise + 1 }}/{{ workout?.exercises.length }}
                </div>
              </v-col>
              <v-col v-if="workout?.exercises" class="text-center">
                <div class="text-caption text-uppercase">
                  {{ t('Repeat') }}
                </div>
                <div v-if="session.exercise" class="text-h6">
                  {{ session.currentExerciseStateRepeat + 1 }}/{{ session.exercise.repeat + 1 }}
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="flex-grow-0">
          <v-col cols="12">
            <v-card class="mb-4">
              <v-card-text>
                <slot>
                  <exercise-card
                    v-if="workout"
                    :model-value="session.exercise"
                    :hangboard="{
                      hangboard: workout.hangboard,
                      company: workout.company
                    }"
                    :index="session.currentExercise"
                    hide-rest
                    variant="flat"
                  >
                  </exercise-card>
                </slot>
              </v-card-text>
            </v-card>

            <v-row class="blend">
              <v-col cols="12">
                <div class="d-flex align-center justify-space-between w-100 ga-1 mb-2">
                  <v-btn
                    :disabled="!!session.completeCurrentExerciseDisabled()"
                    :class="{ pulse: !session.completeCurrentExerciseDisabled() }"
                    icon="$timerCheckOutline"
                    size="x-large"
                    class="rounded-circle"
                    variant="text"
                    color="text"
                    :title="!!!session.completeCurrentExerciseDisabled() ? t('Done') : undefined"
                    @click="session.completeCurrentExercise()"
                  />
                  <div class="d-flex align-center justify-center ga-4">
                    <v-btn
                      :disabled="session.currentExercise <= 0"
                      icon="$skipPrevious"
                      size="x-large"
                      variant="text"
                      color="text"
                      class="rounded-circle"
                      :title="session.currentExercise <= 0 ? undefined : t('Previous exercise')"
                      @click="session.hasExercise('prev')"
                    />
                    <v-btn
                      :icon="
                        !session.isTimerActive ? '$play' : session.pauseTimer ? '$play' : '$pause'
                      "
                      size="x-large"
                      variant="flat"
                      class="rounded-circle"
                      :title="
                        !session.isTimerActive ? t('Go') : session.pauseTimer ? t('Go') : t('Pause')
                      "
                      @click="!session.isTimerActive ? session.setupTimer() : toggleWorkout()"
                    ></v-btn>
                    <v-btn
                      :disabled="session.currentExercise >= workout?.exercises?.length - 1"
                      size="x-large"
                      class="rounded-circle"
                      icon="$skipNext"
                      variant="text"
                      color="text"
                      :title="
                        session.currentExercise >= workout?.exercises?.length - 1
                          ? undefined
                          : t('Next exercise')
                      "
                      @click="session.hasExercise('next')"
                    />
                  </div>
                  <v-btn
                    :disabled="session.skipRestDisabled()"
                    icon="$skipForward"
                    size="x-large"
                    class="rounded-circle"
                    variant="text"
                    color="text"
                    :title="
                      session.skipRestDisabled()
                        ? undefined
                        : t('Skip {time}', { time: session.clock })
                    "
                    @click="session.skipRest()"
                  />
                </div>
                <div class="d-flex justify-space-between align-center w-100 px-2">
                  <div class="d-flex">
                    <workout-subscribe v-if="!quick" v-model="workout" />
                  </div>
                  <div class="d-flex">
                    <workout-bluetooth
                      v-model="workout"
                      size="small"
                      @start="!session.isTimerActive ? session.setupTimer() : null"
                    />
                    <workout-share v-model="workout" size="small" />
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>

      <v-col v-if="!quick" cols="12" md="5">
        <v-card v-if="session.exerciseNext" class="mb-8">
          <v-card-title>{{ t('Next exercise') }}</v-card-title>
          <v-card-text>
            <exercise-card
              :model-value="session.exerciseNext"
              :hangboard="{
                hangboard: workout.hangboard,
                company: workout.company
              }"
              :index="session.currentExercise + 1"
              hide-rest
              variant="flat"
            />
          </v-card-text>
        </v-card>
        <v-card v-if="session.exercise?.exercise !== null" class="mb-8">
          <v-card-title>{{ t('About the exercise') }}</v-card-title>
          <v-card-text>
            <exercise-about :model-value="session.exercise" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- Show subscribe wall -->
  <subscribe-to-app
    v-if="
      canSubscribePlayBilling &&
      !user?.subscribed &&
      user?.completed &&
      user?.completed.time / 60 > (subscribeLimit / 4) * 3
    "
    v-model="dialogWorkoutSubscribe"
  />
  <workout-complete
    v-if="workout"
    v-model="workout"
    :show-dialog="dialogWorkoutComplete"
    :time-hanging="session.workoutCompleteTimeHanging"
    :time-total="session.workoutCompleteTimeTotal"
    @show="dialogWorkoutComplete = !dialogWorkoutComplete"
  />
</template>

<style lang="scss" scoped>
.exercise-card:last-child:deep(.v-card) {
  margin-bottom: 0 !important;

  &:last-child:after {
    border: none;
  }
}

@keyframes forwards {
  0% {
    background-position: 0 -1000%;
  }
  100% {
    background-position: 0 0;
  }
}

@keyframes backwards {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 -1000%;
  }
}

.progress {
  background-image: url('@/assets/cartographer.png');
  background-position: 0 0;
  background-repeat: repeat;
  height: calc(100% - 56px) !important; // header
  max-width: 100%;
  width: 0;
  will-change: width, background-position, background-color;
  //width: 50% !important;

  &.hang {
    animation: forwards 300s infinite linear;
    background-color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
    width: 100%;
  }

  &.rest {
    animation: backwards 300s infinite linear;
    background-color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
    width: 0;
  }

  &.pause {
    background-color: transparent;
    animation-play-state: paused;
  }
}

.v-btn--variant-text,
.timer {
  color: white;
  mix-blend-mode: difference;
}

.pulse {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    scale: 1;
    opacity: 0.9;
  }
  50% {
    scale: 1.2;
    opacity: 1;
  }
  100% {
    scale: 1;
    opacity: 0.9;
  }
}
</style>
