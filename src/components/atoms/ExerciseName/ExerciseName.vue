<script setup lang="ts">
import { useExercises, useGrip, useGripPosition } from '@/helpers'
import { IExercise } from '@/interfaces/workout.interface'

const grip = useGrip()
const gripPosition = useGripPosition()
const exercises = useExercises()

const exercise = defineModel<IExercise>({ required: true })

const { hideRepeat = false } = defineProps<{
  hideRepeat?: boolean
}>()
</script>

<template>
  <span v-if="exercise">
    <span v-if="exercise.max">Max </span>
    <span v-if="exercise.repeat > 0 && !hideRepeat && !exercise.max">
      {{ exercise.repeat + 1 }}x
    </span>
    <span v-if="exercise.pullups > 1 && !exercise.max"> {{ exercise.pullups + ' ' }}</span>
    <span v-if="exercise.gripPosition !== undefined && exercise.gripPosition !== null">
      {{ gripPosition[exercise.gripPosition].name + ' ' }}
    </span>
    <span v-if="exercise.left === null || exercise.right === null">One-Arm </span>
    <span v-if="exercise.exercise === 0">
      <span v-if="exercise.grip !== undefined">
        {{ grip[exercise.grip].name }}
      </span>
      <!-- fallback-->
      <span v-else-if="grip[exercise.exercise] !== null">{{ grip[exercise.exercise].name }}</span>
    </span>
    <span v-else-if="exercise.grip !== 0">
      <span v-if="exercise.grip !== undefined">{{ grip[exercise.grip].short + ' ' }}</span>
      <!-- fallback-->
      <span v-else-if="grip[exercise.exercise]">{{ grip[exercise.exercise].name }}</span>
    </span>
    <span v-if="exercise.pullups > 0 && exercise.exercise > 0">
      {{ exercises[exercise.exercise - 1].name }}
    </span>
    <span
      v-if="
        (exercise.pullups > 1 && exercise.exercise > 0) || (exercise.max && exercise.exercise > 0)
      "
      >s</span
    >
  </span>
</template>
