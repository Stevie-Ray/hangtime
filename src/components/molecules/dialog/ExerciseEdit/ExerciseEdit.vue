<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import {
  useExercises,
  useFitnessExercises,
  useGrip,
  useGripPosition,
  weightConverter,
  weightUnit
} from '@/helpers'
import ExerciseCard from '@/components/molecules/ExerciseCard/ExerciseCard.vue'
import ExerciseHand from '@/components/atoms/ExerciseHand/ExerciseHand.vue'
import ExerciseCounter from '@/components/molecules/ExerciseCounter/ExerciseCounter.vue'
import { useAuthenticationStore } from '@/stores/authentication.store'
import { Workout } from '@/models/workout.model'
import { Exercises } from '@/enums/exercise'

const { user } = storeToRefs(useAuthenticationStore())

// helpers
const grip = useGrip()
const gripPosition = useGripPosition()
const exerciseList = useExercises()
const fitnessExercises = useFitnessExercises()

const exercises = computed(() => {
  return exerciseList.map((exercise, index) => ({
    ...exercise,
    // start at 1, 0 is the default exercise (dead hang)
    index: index + 1
  }))
})

const exerciseFilter = computed(() => {
  if (exercise.value && grip[exercise.value.grip].disabledExercises) {
    return exercises.value.map((obj) => ({
      ...obj,
      disabled: exercise.value
        ? grip[exercise.value.grip].disabledExercises?.includes(obj.id as Exercises)
        : null
    }))
  }
  return exercises.value
})

const { t } = useI18n()

const repType = ref('original')

const workout = defineModel<Workout>({ required: true })

const { showDialog = false, index = 1 } = defineProps<{
  showDialog?: boolean
  index?: number
}>()

const emit = defineEmits(['update-time', 'update-index', 'show-dialog'])

// const exercise = computed<Exercise | null>(() => workout.value?.exercises[index.value] ?? null)
const exercise = computed(() => workout.value?.exercises[index])

const exerciseEditTime = (timer: 'hold' | 'rest' | 'repeat' | 'pause' | 'time', time: number) => {
  if (!exercise.value) return
  // set time of timer value
  exercise.value[timer] = time
  // remove old value
  if (workout.value?.time !== undefined && exercise.value?.time !== undefined) {
    emit('update-time', workout.value.time - exercise.value.time)
  }
  exercise.value.time =
    (exercise.value.hold + exercise.value.rest) * (exercise.value.repeat + 1) -
    exercise.value.rest +
    exercise.value.pause
  // add new value
  if (workout.value?.time !== undefined && exercise.value?.time !== undefined) {
    emit('update-time', workout.value.time + exercise.value.time)
  }
}

const exerciseRemove = () => {
  if (workout.value && workout.value.exercises[index]) {
    workout.value.removeExercise(index)

    if (workout.value?.time) {
      emit('update-time', workout.value.time)
    }

    emit('update-index', 0)
    emit('show-dialog', false)
  }
}

const exerciseCopy = () => {
  if (workout.value) {
    workout.value.copyExercise(index)

    if (workout.value?.time) {
      emit('update-time', workout.value.time)
    }

    emit('update-index', 0)
    emit('show-dialog', false)
  }
}

// workout - weight
const weightLabel = computed(() => {
  if (user.value?.weight && exercise.value && exercise.value.weight !== 0) {
    return `Your weight: ${weightConverter(user.value.weight, user.value)} ${weightUnit(user.value)}.
     Training weight: ${weightConverter(user.value.weight + exercise.value.weight, user.value)} ${weightUnit(user.value)}.`
  }
  return 'Adjust using kettle/dumb-bells or pulley system'
})

const rules = {
  length: (length: number) => (v: string) =>
    (v || '').length <= length || `Max ${length} characters`
}
</script>

<template>
  <v-dialog
    :model-value="showDialog"
    :scrim="false"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar>
        <v-btn color="text" icon="$close" @click="emit('show-dialog', false)" />
        <v-toolbar-title>
          {{ t('Edit exercise') }}
        </v-toolbar-title>

        <v-toolbar-items>
          <v-btn
            v-if="index !== 0"
            icon="$deleteOutline"
            @click="exerciseRemove"
            :title="t('Delete exercise')"
          />
          <v-btn icon="$contentCopy" @click="exerciseCopy" :title="t('Copy exercise')" />
          <v-btn
            icon="$contentSaveOutline"
            @click="emit('show-dialog', false)"
            :title="t('Save exercise')"
          />
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-expansion-panels v-if="exercise" variant="accordion">
              <exercise-card
                v-if="workout"
                v-model="exercise"
                :hangboard="{
                  hangboard: workout.hangboard,
                  company: workout.company
                }"
                :hide-rest="index === 0"
                :index="index"
                edit-hangboard
                @left="
                  (hold) =>
                    exercise && exercise.left === hold && exercise.right !== null
                      ? (exercise.left = null)
                      : exercise
                        ? (exercise.left = hold)
                        : null
                "
                @right="
                  (hold) =>
                    exercise && exercise.right === hold && exercise.left !== null
                      ? (exercise.right = null)
                      : exercise
                        ? (exercise.right = hold)
                        : null
                "
                @rotate="(rotate) => (exercise ? (exercise.rotate = rotate) : null)"
              ></exercise-card>

              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon icon="$numeric1BoxOutline"></v-icon>
                  <span class="ml-2">{{ t('Exercise') }}</span>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <div class="text-caption">
                        {{ t('Body position') }}
                      </div>
                      <v-select
                        v-model="exercise.grip"
                        :items="grip"
                        item-title="name"
                        item-value="id"
                        required
                        @update:modelValue="exercise.exercise = 0"
                      >
                      </v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="text-caption">{{ t('Movement') }} ({{ t('Optional') }})</div>
                      <v-select
                        v-model="exercise.exercise"
                        :items="exerciseFilter"
                        item-title="name"
                        item-value="index"
                        item-disabled="disabled"
                        item-props
                        clearable
                        @update:model-value="
                          (value) => {
                            if (value === null) {
                              exercise.exercise = 0
                              exercise.pullups = 1
                              exercise.max = false
                            }
                          }
                        "
                      >
                        <template #selection="data">
                          <span
                            v-if="data.item.value !== 0"
                            class="text-truncate"
                            v-text="data.item.title"
                          ></span>
                        </template>
                      </v-select>
                    </v-col>
                  </v-row>

                  <v-row v-if="false">
                    <v-col cols="12">
                      <div class="text-caption">
                        {{ t('Exercise') }}
                      </div>
                      <v-autocomplete
                        :items="fitnessExercises"
                        item-title="name"
                        item-value="id"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon icon="$numeric2BoxOutline"></v-icon>
                  <span
                    :class="{
                      'text--secondary': exercise?.repeat === 0
                    }"
                    class="ml-2"
                  >
                    {{ t('Timers') }}
                  </span>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-btn-toggle
                    v-model="repType"
                    background-color="text"
                    border
                    class="d-flex align-content-space-around my-4"
                    dark
                    mandatory
                  >
                    <v-btn class="flex-1-1" value="original" @click="exercise.max = false">
                      <span v-if="exercise.exercise !== 0">
                        {{ t('Amount') }}
                      </span>
                      <span v-else>
                        {{ t('Time') }}
                      </span>
                    </v-btn>
                    <v-btn class="flex-1-1" value="max" @click="exercise.max = true">
                      {{ t('Max') }}
                    </v-btn>
                  </v-btn-toggle>

                  <exercise-counter
                    v-if="index !== 0"
                    :max="300"
                    :min="3"
                    v-model="exercise.pause"
                    timer
                    subtitle="Before hang"
                    title="Rest"
                    @update:model-value="(value) => exerciseEditTime('pause', value)"
                  >
                  </exercise-counter>

                  <exercise-counter
                    v-if="exercise.exercise !== 0 && repType !== 'max'"
                    :disabled="exercise.exercise === 0"
                    :max="30"
                    :title="`${exercises[exercise.exercise - 1].name}s`"
                    v-model="exercise.pullups"
                    @update:model-value="(value) => (exercise ? (exercise.pullups = value) : null)"
                  >
                  </exercise-counter>

                  <exercise-counter
                    v-if="exercise.exercise === 0 && repType !== 'max'"
                    :max="180"
                    :min="3"
                    timer
                    v-model="exercise.hold"
                    title="Hang"
                    @update:model-value="(value) => exerciseEditTime('hold', value)"
                  >
                  </exercise-counter>

                  <exercise-counter
                    :max="24"
                    :min="0"
                    :model-value="exercise.repeat"
                    subtitle="1x = No repeat"
                    title="Repeat"
                    @update:model-value="(value) => exerciseEditTime('repeat', value)"
                  >
                    <template #default>
                      <input
                        size="1"
                        type="text"
                        readonly
                        inputmode="decimal"
                        class="text-center"
                        :value="`${exercise.repeat + 1}x`"
                      />
                    </template>
                  </exercise-counter>

                  <exercise-counter
                    v-if="exercise.repeat > 0"
                    :disabled="exercise.repeat === 0"
                    :max="180"
                    :min="3"
                    timer
                    v-model="exercise.rest"
                    subtitle="After repeats"
                    title="Rest"
                    @update:model-value="(value) => exerciseEditTime('rest', value)"
                  >
                  </exercise-counter>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon icon="$numeric3BoxOutline"></v-icon>
                  <span
                    :class="{
                      'text--secondary':
                        (exercise?.leftHand &&
                          exercise?.rightHand &&
                          !exercise?.leftHand.length &&
                          !exercise?.rightHand.length) ||
                        (!exercise?.leftHand && !exercise?.rightHand)
                    }"
                    class="ml-2"
                    >{{ t('Fingers') }}</span
                  >
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  {{ exercise.gripPosition }}
                  <v-row>
                    <v-col cols="12">
                      <div class="text-caption">{{ t('Grip position') }} ({{ t('Optional') }})</div>
                      <v-select
                        v-model="exercise.gripPosition"
                        :items="gripPosition"
                        item-title="name"
                        item-value="id"
                        clearable
                      >
                      </v-select>
                    </v-col>
                  </v-row>
                  <exercise-hand
                    v-model="exercise"
                    edit
                    @left="
                      (finger: (1 | 2 | 3 | 4 | 5)[]) =>
                        exercise ? (exercise.leftHand = finger) : null
                    "
                    @right="
                      (finger: (1 | 2 | 3 | 4 | 5)[]) =>
                        exercise ? (exercise.rightHand = finger) : null
                    "
                  ></exercise-hand>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon icon="$numeric4BoxOutline"></v-icon>
                  <span
                    :class="{
                      'text--secondary': exercise?.weight === 0 || !exercise?.weight
                    }"
                    class="ml-2"
                  >
                    {{ t('Weight') }}</span
                  >
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="text-caption mb-4">
                    {{ weightLabel }}
                  </div>

                  <exercise-counter
                    :max="50"
                    :min="-50"
                    v-model="exercise.weight"
                    suffix="kg"
                    title="Weight"
                    @update:model-value="(value) => (exercise ? (exercise.weight = value) : null)"
                  >
                    <template #default>
                      <span v-if="user">
                        {{ weightConverter(exercise.weight, user) }}{{ weightUnit(user) }}
                      </span>
                    </template>
                  </exercise-counter>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon icon="$numeric5BoxOutline"></v-icon>
                  <span
                    :class="{
                      'text--secondary': exercise?.notes === '' || !exercise?.notes
                    }"
                    class="ml-2"
                    >{{ t('Notes') }}</span
                  >
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-textarea
                    v-model="exercise.notes"
                    :rules="[rules.length(140)]"
                    auto-grow
                    counter="140"
                    filled
                    row-height="24"
                    rows="2"
                  ></v-textarea>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
