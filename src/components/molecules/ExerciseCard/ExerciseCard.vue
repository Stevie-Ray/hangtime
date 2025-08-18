<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ExerciseName from '@/components/atoms/ExerciseName/ExerciseName.vue'
import ExerciseHand from '@/components/atoms/ExerciseHand/ExerciseHand.vue'
import ExerciseHangboard from '@/components/atoms/ExerciseHangboard/ExerciseHangboard.vue'
import ExerciseAbout from '@/components/molecules/ExerciseAbout/ExerciseAbout.vue'
import { time } from '@/helpers'
import type { IExercise } from '@/interfaces/workout.interface'

const { t } = useI18n()

const exercise = defineModel<IExercise>({ required: true })

const emit = defineEmits(['left', 'right', 'rotate'])

const {
  variant = 'elevated',
  hangboard,
  index,
  editHangboard = false,
  editHand = false,
  sort = false,
  hideRest = false
} = defineProps<{
  variant?: 'elevated' | 'flat' | 'text' | 'tonal' | 'outlined' | 'plain'
  hangboard?: { hangboard: number; company: number }
  index?: number
  editHangboard?: boolean
  editHand?: boolean
  sort?: boolean
  hideRest?: boolean
}>()
</script>

<template>
  <div class="exercise-card">
    <v-card :variant="variant" v-if="!hideRest || (index !== 0 && !hideRest)" class="mb-8">
      <v-card-title class="d-flex justify-space-between">
        <div>{{ t('Rest') }}</div>
        <div v-if="exercise">{{ time(exercise.pause) }}</div>
      </v-card-title>
    </v-card>

    <v-card :variant="variant" class="mb-8">
      <v-card-title v-if="exercise" class="d-flex justify-space-between">
        <div v-if="index !== undefined">
          <v-chip class="mr-2" color="primary">{{ index + 1 }}.</v-chip>
        </div>

        <div class="flex-grow-1 text-truncate" style="overflow: hidden">
          <v-dialog max-width="500" v-if="!sort">
            <template v-slot:activator="{ props }">
              <exercise-name v-model="exercise" v-bind="props" hide-repeat />
            </template>

            <template v-slot:default="{ isActive }">
              <v-card class="help">
                <v-card-title>
                  <exercise-name v-model="exercise" hide-repeat />
                </v-card-title>
                <v-card-text>
                  <exercise-about v-model="exercise" />
                </v-card-text>

                <v-card-actions>
                  <v-spacer />

                  <v-btn :text="t('Close')" @click="isActive.value = false" />
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
          <template v-else>
            <exercise-name v-model="exercise" hide-repeat />
          </template>
        </div>

        <div>
          <v-chip v-if="exercise.repeat > 0" variant="outlined">
            {{ exercise.repeat + 1 }}x
          </v-chip>
          <v-chip v-else variant="outlined">1x</v-chip>
          <v-icon v-if="sort" size="x-large" class="handle" style="cursor: grab" icon="$drag" />
        </div>
      </v-card-title>

      <v-card-subtitle v-if="exercise">
        <div class="d-flex justify-space-between">
          <div style="font-size: 1rem">
            <span v-if="exercise.hold && exercise.exercise === 0 && !exercise.max">
              <span>{{ t('Hang') }}: </span>
              <strong>{{ time(Math.round(exercise.hold)) }}</strong>
            </span>
            <span
              v-if="exercise.hold && exercise.exercise === 0 && !exercise.max && exercise.repeat"
            >
              |
            </span>
            <span v-if="exercise.repeat">
              <span>{{ t('Rest') }}: </span>
              <strong>{{ time(Math.round(exercise.rest)) }}</strong>
            </span>
            <span>&nbsp;</span>
          </div>

          <v-chip size="x-small" v-if="exercise.weight && exercise?.weight !== 0">
            {{ exercise.weight }}kg
          </v-chip>
        </div>
      </v-card-subtitle>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <exercise-hangboard
              v-if="hangboard"
              v-model="exercise"
              :hangboard="{
                hangboard: hangboard.hangboard,
                company: hangboard.company
              }"
              :edit="editHangboard"
              @right="(hold) => emit('right', hold)"
              @left="(hold) => emit('left', hold)"
              @rotate="(rotate) => emit('rotate', rotate)"
            >
            </exercise-hangboard>
            <exercise-hand
              v-if="exercise"
              v-model="exercise"
              :edit="editHand"
              :style="{ 'pointer-events': editHand ? 'auto' : 'none' }"
            ></exercise-hand>

            <v-row
              v-if="exercise?.notes && exercise.notes !== ''"
              justify="center"
              style="margin-top: -32px"
            >
              <v-col cols="8">
                <div class="text-center text-caption">
                  {{ exercise.notes }}
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<style lang="scss" scoped>
.v-card {
  overflow: visible;

  &:after {
    content: '';
    display: block;
    position: absolute;
    width: calc(100% - 4rem);
    height: 2rem;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    border-right: 4px dashed;
    border-left: 4px dashed;
    border-color: rgb(var(--v-theme-accent)) !important;
  }

  .v-overlay-container & {
    &.help:after {
      display: none;
    }
  }
}
</style>
