<script setup>
import { defineEmits, defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import ExerciseName from '@/components/atoms/ExerciseName/ExerciseName'
import ExerciseHand from '@/components/atoms/ExerciseHand/ExerciseHand'
import ExerciseHangboard from '@/components/atoms/ExerciseHangboard/ExerciseHangboard'
import { time } from '@/helpers'

const { t } = useI18n()

const emit = defineEmits(['left', 'right', 'rotate'])

const props = defineProps({
  variant: {
    type: String,
    default: 'elevated'
  },
  exercise: {
    type: Object
  },
  hangboard: {
    type: Object
  },
  index: {
    type: Number
  },
  editHangboard: {
    type: Boolean,
    default: false
  },
  editHand: {
    type: Boolean,
    default: false
  },
  hideRest: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="exercise-card">
    <v-card
      :variant="props.variant"
      v-if="!props.hideRest || (props.index !== 0 && !props.hideRest)"
      class="mb-8"
    >
      <v-card-title class="d-flex justify-space-between">
        <div>{{ t('Rest') }}</div>
        <div v-if="props.exercise">{{ time(props.exercise.pause) }}</div>
      </v-card-title>
    </v-card>

    <v-card :variant="props.variant" class="mb-8">
      <v-card-title v-if="props.exercise" class="d-flex justify-space-between">
        <div>
          <v-chip class="mr-2" color="primary">{{ props.index + 1 }}.</v-chip>
        </div>

        <div class="flex-grow-1 text-truncate">
          <exercise-name :exercise="props.exercise" hide-repeat></exercise-name>
        </div>

        <div>
          <v-chip v-if="props.exercise.repeat > 0" variant="outlined">
            {{ props.exercise.repeat + 1 }}x
          </v-chip>
          <v-chip v-else variant="outlined">1x</v-chip>
        </div>
      </v-card-title>

      <v-card-subtitle v-if="props.exercise">
        <div class="d-flex justify-space-between">
          <div>
            <span v-if="props.exercise.hold"
              >{{ t('Hang') }}:
              {{ time(Math.round(props.exercise.hold)) }}</span
            >
            <span v-if="props.exercise.repeat">
              | {{ t('Rest') }}:
              {{ time(Math.round(props.exercise.rest)) }}</span
            >
          </div>

          <v-chip
            size="x-small"
            v-if="props.exercise.weight && props.exercise?.weight !== 0"
          >
            {{ props.exercise.weight }}kg
          </v-chip>
        </div>
      </v-card-subtitle>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <exercise-hangboard
              v-if="props.hangboard && props.exercise"
              :exercise="props.exercise"
              :hangboard="{
                hangboard: props.hangboard.hangboard,
                company: props.hangboard.company
              }"
              :edit="editHangboard"
              @right="(hold) => emit('right', hold)"
              @left="(hold) => emit('left', hold)"
              @rotate="(rotate) => emit('rotate', rotate)"
            >
            </exercise-hangboard>
            <exercise-hand
              v-if="props.exercise"
              :exercise="props.exercise"
              :edit="editHand"
              :style="{ 'pointer-events': editHand ? 'auto' : 'none' }"
            ></exercise-hand>

            <v-row
              v-if="props.exercise?.notes && props.exercise.notes !== ''"
              justify="center"
              style="margin-top: -32px"
            >
              <v-col cols="8">
                <div class="text-center text-caption">
                  {{ props.exercise.notes }}
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
}
</style>
