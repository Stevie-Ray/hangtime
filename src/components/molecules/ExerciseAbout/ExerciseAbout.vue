<script setup lang="ts">
import { useExercises, useGrip } from '@/helpers'
import { Exercise } from '@/interfaces/workouts.interface'

const grip = useGrip()
const exercises = useExercises()
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  exercise: {
    type: Object as () => Exercise
  }
})
</script>

<template>
  <div v-if="exercise && exercise.exercise === 0">
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
    <div v-else-if="exercise && grip[exercise.exercise].id !== 0">
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
  <div v-else-if="exercise && exercise.grip !== 0">
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
  <div v-if="exercise && exercise.pullups > 0 && exercise.exercise > 0">
    <div class="mb-8">
      {{ exercises[exercise.exercise - 1].description }}
    </div>
    <v-expansion-panels>
      <v-expansion-panel
        v-for="(step, index) in exercises[exercise.exercise - 1].steps"
        :key="index"
        :title="step.name"
        :text="step.description"
      >
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
