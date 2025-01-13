<script setup lang="ts">
import { useExercises, useGrip } from '@/helpers'
import { IExercise } from '@/interfaces/workout.interface'

const grip = useGrip()
const exercises = useExercises()

const exercise = defineModel<IExercise>({ required: true })
</script>

<template>
  <div>
    <div v-if="exercise.exercise === 0">
      <div v-if="exercise.grip !== undefined">
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
      <div v-else-if="grip[exercise.exercise] !== null">
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
      <div v-if="exercise.grip !== undefined">
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
      <div v-else-if="grip[exercise.exercise] !== null">
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
      <ul class="list-none px-4">
        <li
          v-for="(step, index) in exercises[exercise.exercise - 1].instructions"
          :key="index"
          class="mb-2"
        >
          {{ step }}
        </li>
      </ul>
    </div>
  </div>
</template>
