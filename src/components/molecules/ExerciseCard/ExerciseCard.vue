<script setup>
import { defineEmits, defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import ExerciseName from '@/components/atoms/ExerciseName/ExerciseName'
import ExerciseHand from '@/components/atoms/ExerciseHand/ExerciseHand'
import ExerciseHangboard from '@/components/atoms/ExerciseHangboard/ExerciseHangboard'
import { time, useExercises, useGrip } from '@/helpers'

const grip = useGrip()
const exercises = useExercises()

const { t } = useI18n()

const emit = defineEmits(['left', 'right', 'rotate'])

// eslint-disable-next-line no-unused-vars
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
  sort: {
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
      :variant="variant"
      v-if="!hideRest || (index !== 0 && !hideRest)"
      class="mb-8"
    >
      <v-card-title class="d-flex justify-space-between">
        <div>{{ t('Rest') }}</div>
        <div v-if="exercise">{{ time(exercise.pause) }}</div>
      </v-card-title>
    </v-card>

    <v-card :variant="variant" class="mb-8">
      <v-card-title v-if="exercise" class="d-flex justify-space-between">
        <div>
          <v-chip class="mr-2" color="primary">{{ index + 1 }}.</v-chip>
        </div>

        <div class="flex-grow-1 text-truncate" style="overflow: hidden">
          <v-dialog width="500">
            <template v-slot:activator="{ props }">
              <exercise-name
                :exercise="exercise"
                v-bind="props"
                hide-repeat
              ></exercise-name>
            </template>

            <template v-slot:default="{ isActive }">
              <v-card>
                <v-card-title>
                  <exercise-name
                    :exercise="exercise"
                    v-bind="props"
                    hide-repeat
                  ></exercise-name>
                </v-card-title>
                <v-card-text>
                  <div v-if="exercise.exercise === 0">
                    <div v-if="exercise.grip">
                      <div class="mb-8">
                        {{ grip[exercise.grip].description }}
                      </div>
                      <v-expansion-panels>
                        <v-expansion-panel
                          v-for="(step, index) in grip[exercise.grip].steps"
                          :key="index"
                          :title="step.name"
                          :text="step.description"
                        >
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </div>
                    <!-- fallback-->
                    <div v-else-if="grip[exercise.exercise] !== 0">
                      <div class="mb-8">
                        {{ grip[exercise.exercise].description }}
                      </div>
                      <v-expansion-panels>
                        <v-expansion-panel
                          v-for="(step, index) in grip[exercise.exercise].steps"
                          :key="index"
                          :title="step.name"
                          :text="step.description"
                        >
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </div>
                  </div>
                  <div v-else-if="exercise.grip !== 0">
                    <div v-if="exercise.grip">
                      <div class="mb-8">
                        {{ grip[exercise.grip].description }}
                      </div>
                      <v-expansion-panels>
                        <v-expansion-panel
                          v-for="(step, index) in grip[exercise.grip].steps"
                          :key="index"
                          :title="step.name"
                          :text="step.description"
                        >
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </div>
                    <!-- fallback-->
                    <div v-else-if="grip[exercise.exercise]">
                      <div class="mb-8">
                        {{ grip[exercise.exercise].description }}
                      </div>
                      <v-expansion-panels>
                        <v-expansion-panel
                          v-for="(step, index) in grip[exercise.exercise].steps"
                          :key="index"
                          :title="step.name"
                          :text="step.description"
                        >
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </div>
                  </div>
                  <div v-if="exercise.pullups > 0 && exercise.exercise > 0">
                    <div class="mb-8">
                      {{ exercises[exercise.exercise - 1].description }}
                    </div>
                    <v-expansion-panels>
                      <v-expansion-panel
                        v-for="(step, index) in exercises[exercise.exercise - 1]
                          .steps"
                        :key="index"
                        :title="step.name"
                        :text="step.description"
                      >
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </div>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn
                    :text="$t('Close')"
                    @click="isActive.value = false"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </div>

        <div>
          <v-chip v-if="exercise.repeat > 0" variant="outlined">
            {{ exercise.repeat + 1 }}x
          </v-chip>
          <v-chip v-else variant="outlined">1x</v-chip>
          <v-icon
            v-if="sort"
            size="x-large"
            class="handle"
            style="cursor: grab"
            icon="$drag"
          ></v-icon>
        </div>
      </v-card-title>

      <v-card-subtitle v-if="exercise">
        <div class="d-flex justify-space-between">
          <div style="font-size: 1rem">
            <span v-if="exercise.hold">
              <span>{{ t('Hang') }}: </span>
              <strong>{{ time(Math.round(exercise.hold)) }}</strong>
            </span>
            <span v-if="exercise.repeat">
              <span> | {{ t('Rest') }}: </span>
              <strong>{{ time(Math.round(exercise.rest)) }}</strong>
            </span>
          </div>

          <v-chip
            size="x-small"
            v-if="exercise.weight && exercise?.weight !== 0"
          >
            {{ exercise.weight }}kg
          </v-chip>
        </div>
      </v-card-subtitle>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <exercise-hangboard
              v-if="hangboard && exercise"
              :exercise="exercise"
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
              :exercise="exercise"
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
    &:after {
      display: none;
    }
  }
}
</style>
