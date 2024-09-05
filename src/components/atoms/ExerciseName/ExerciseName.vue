<script setup lang="ts">
import { useExercises, useGrip } from '@/helpers'
import { Exercise } from '@/interfaces/workouts.interface'

const grip = useGrip()
const exercises = useExercises()

const { exercise, hideRepeat = false } = defineProps<{
  exercise?: Exercise
  hideRepeat?: boolean
}>()
</script>

<template>
  <span v-if="exercise">
    <span v-if="exercise.max">Max </span>
    <span v-if="exercise.repeat > 0 && !hideRepeat && !exercise.max">
      {{ exercise.repeat + 1 }}x
    </span>
    <span v-if="exercise.pullups > 1 && !exercise.max"> {{ exercise.pullups }}&nbsp;</span>
    <span v-if="exercise.left === null || exercise.right === null">One-Arm </span>
    <span v-if="exercise.exercise === 0">
      <span v-if="exercise.grip !== undefined">
        {{ grip[exercise.grip].name }}
      </span>
      <!-- fallback-->
      <span v-else-if="grip[exercise.exercise].id !== 0">{{ grip[exercise.exercise].name }}</span>
    </span>
    <span v-else-if="exercise.grip !== 0">
      <span v-if="exercise.grip !== undefined">{{ grip[exercise.grip].short }}&nbsp;</span>
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
