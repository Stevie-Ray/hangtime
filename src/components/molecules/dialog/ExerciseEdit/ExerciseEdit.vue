<script setup lang="ts">
import { computed, ref, watch, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useExercises, useGrip, weightConverter } from '@/helpers'
import ExerciseCard from '@/components/molecules/ExerciseCard/ExerciseCard.vue'
import ExerciseHand from '@/components/atoms/ExerciseHand/ExerciseHand.vue'
import ExerciseCounter from '@/components/molecules/ExerciseCounter/ExerciseCounter.vue'
import { useAuthenticationStore } from '@/stores/authentication'
import { Workout, Exercise } from '@/interfaces/workouts.interface'

const { user } = storeToRefs(useAuthenticationStore())

// helpers
const grip = useGrip()
const exercises = useExercises()

const { t } = useI18n()

const repType = ref('original')

const props = withDefaults(
  defineProps<{
    workout?: Workout
    index?: number
  }>(),
  {
    index: 1
  }
)

const workout = ref(props.workout)
const index = ref(props.index)

watch(
  () => props.workout,
  (newValue) => {
    workout.value = newValue
  }
)

watch(
  () => props.index,
  (newValue) => {
    index.value = newValue
  }
)

const emit = defineEmits(['time', 'show'])

const dialog = ref(true)

// const exercise = computed<Exercise | null>(() => workout.value?.exercises[index.value] ?? null)
const exercise = computed<Exercise | undefined>(() => workout.value?.exercises[index.value])

// eslint-disable-next-line no-shadow
const exerciseEditTime = (timer: 'hold' | 'rest' | 'repeat' | 'pause' | 'time', time: number) => {
  if (!exercise.value) return
  // set time of timer value
  exercise.value[timer] = time
  // remove old value
  if (workout.value?.time !== undefined && exercise.value?.time !== undefined) {
    emit('time', workout.value.time - exercise.value.time)
  }
  exercise.value.time =
    (exercise.value.hold + exercise.value.rest) * (exercise.value.repeat + 1) -
    exercise.value.rest +
    exercise.value.pause
  // add new value
  if (workout.value?.time !== undefined && exercise.value?.time !== undefined) {
    emit('time', workout.value.time + exercise.value.time)
  }
}

const exerciseByType = (typeId: 'arms' | 'legs') =>
  // eslint-disable-next-line no-shadow
  exercises.filter((exercise) => exercise.type === typeId)

const exerciseFilter = (type: 'arms' | 'legs') => {
  if (exercise.value && grip[exercise.value.grip].disabledExercises) {
    return exerciseByType(type).map((obj) => ({
      ...obj,
      disabled: exercise.value
        ? grip[exercise.value.grip].disabledExercises?.includes(obj.id)
        : null
    }))
  }
  return exerciseByType(type)
}

const exerciseMovement = computed({
  // getter
  get() {
    if (exercise.value && exercise.value.exercise === 0) return null
    return exercise.value ? exercise.value.exercise : null
  },
  // setter
  set(newValue) {
    if (exercise.value && newValue !== null) {
      exercise.value.exercise = newValue
    }
  }
})

const exerciseRemove = () => {
  if (workout.value && workout.value.exercises[index.value]) {
    const removedExercise = workout.value.exercises.splice(index.value, 1)[0]

    if (workout.value?.time && removedExercise?.time) {
      emit('time', workout.value.time - removedExercise.time)
    }

    index.value = 0
    emit('show', false)
  }
}

const exerciseCopy = () => {
  if (workout.value) {
    const newExercise = structuredClone(toRaw(workout.value.exercises[index.value]))
    workout.value.exercises.splice(index.value, 0, newExercise)

    if (workout.value?.time && newExercise?.time) {
      emit('time', workout.value.time + newExercise.time)
    }

    index.value = 0
    emit('show', false)
  }
}

// workout - weight
const weightLabel = computed(() => {
  if (user.value?.weight && exercise.value && exercise.value.weight !== 0) {
    return `Your weight: ${user.value.weight}kg.
     Training weight: ${user.value.weight + exercise.value.weight}kg.`
  }
  return 'Adjust using kettle/dumb-bells or pulley system'
})

const rules = {
  length: (length: number) => (v: string) =>
    (v || '').length <= length || `Max ${length} characters`
}
</script>

<template>
  <v-dialog v-model="dialog" :scrim="false" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar>
        <v-btn color="text" icon="$close" @click="emit('show', false)" />
        <v-toolbar-title>
          {{ t('Edit exercise') }}
        </v-toolbar-title>

        <v-toolbar-items>
          <v-btn v-if="index !== 0" icon="$deleteOutline" @click="exerciseRemove" />
          <v-btn icon="$contentCopy" @click="exerciseCopy" />
          <v-btn icon="$contentSaveOutline" @click="emit('show', false)" />
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-expansion-panels v-if="exercise" variant="accordion">
              <exercise-card
                v-if="workout"
                :exercise="exercise"
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
                    <v-col cols="12">
                      <div class="text-caption">
                        {{ t('Body position') }}
                      </div>
                      <v-select
                        v-model="exercise.grip"
                        :items="grip"
                        item-title="name"
                        item-value="id"
                        required
                      >
                      </v-select>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6">
                      <div class="text-caption">{{ t('Movement') }} ({{ t('Optional') }})</div>
                      <v-select
                        v-model="exerciseMovement"
                        :items="exerciseFilter('arms')"
                        :label="t('Arms')"
                        item-title="name"
                        item-value="id"
                        single-line
                      >
                        <template #selection="data">
                          <span
                            v-if="data.item.raw.type"
                            class="text-truncate"
                            v-text="data.item.title"
                          ></span>
                        </template>
                      </v-select>
                    </v-col>

                    <v-col cols="6">
                      <div class="text-caption text-right">
                        <span
                          v-if="exercise && exercise.exercise !== 0"
                          @click="
                            ;(exercise.exercise = 0), (exercise.pullups = 1), (exercise.max = false)
                          "
                        >
                          {{ t('Reset') }}
                        </span>
                        <span v-else>&nbsp;</span>
                      </div>
                      <v-select
                        v-model="exerciseMovement"
                        :items="exerciseFilter('legs')"
                        :label="t('Legs')"
                        item-title="name"
                        item-value="id"
                        single-line
                      >
                        <template #selection="data">
                          <span
                            v-if="data.item.raw.type"
                            class="text-truncate"
                            v-text="data.item.title"
                          ></span>
                        </template>
                      </v-select>
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
                    :value="exercise.pause"
                    subtitle="Before hang"
                    title="Rest"
                    @input="(value) => exerciseEditTime('pause', value)"
                  >
                  </exercise-counter>

                  <exercise-counter
                    v-if="exercise.exercise !== 0 && repType !== 'max'"
                    :disabled="exercise.exercise === 0"
                    :max="30"
                    :timer="false"
                    :title="`${exercises[exercise.exercise - 1].name}s`"
                    :value="exercise.pullups"
                    @input="(value: number) => (exercise ? (exercise.pullups = value) : null)"
                  >
                  </exercise-counter>

                  <exercise-counter
                    v-if="exercise.exercise === 0 && repType !== 'max'"
                    :max="180"
                    :min="3"
                    :value="exercise.hold"
                    title="Hang"
                    @input="(value) => exerciseEditTime('hold', value)"
                  >
                  </exercise-counter>

                  <exercise-counter
                    :max="24"
                    :min="0"
                    :timer="false"
                    :value="exercise.repeat"
                    subtitle="1x = No repeat"
                    title="Repeat"
                    @input="(value) => exerciseEditTime('repeat', value)"
                  >
                    <template #default>{{ exercise.repeat + 1 }}x</template>
                  </exercise-counter>

                  <exercise-counter
                    v-if="exercise.repeat > 0"
                    :disabled="exercise.repeat === 0"
                    :max="180"
                    :min="3"
                    :value="exercise.rest"
                    subtitle="After repeats"
                    title="Rest"
                    @input="(value) => exerciseEditTime('rest', value)"
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
                  <exercise-hand
                    :exercise="exercise"
                    edit
                    @left="(finger: number[]) => (exercise ? (exercise.leftHand = finger) : null)"
                    @right="(finger: number[]) => (exercise ? (exercise.rightHand = finger) : null)"
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
                    :timer="false"
                    :value="exercise.weight"
                    suffix="kg"
                    title="Weight"
                    @input="(value: number) => (exercise ? (exercise.weight = value) : null)"
                  >
                    <template #default>
                      <span v-if="user">{{ weightConverter(exercise.weight, user) }}kg</span>
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
