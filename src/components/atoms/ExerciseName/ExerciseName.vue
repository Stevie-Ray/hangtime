<script setup>
import { useExercises, useGrip } from '@/helpers'

const grip = useGrip()
const exercises = useExercises()

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  exercise: {
    type: Object
  },
  hideRepeat: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <span v-if="exercise">
    <span v-if="exercise.repeat > 0 && !hideRepeat">{{ exercise.repeat + 1 }}x </span>
    <span v-if="exercise.pullups > 1"> {{ exercise.pullups }}&nbsp; </span>
    <span v-if="exercise.left === null || exercise.right === null">One-Arm </span>
    <span v-if="exercise.exercise === 0">
      <span v-if="exercise.grip">
        {{ grip[exercise.grip].name }}
      </span>
      <!-- fallback-->
      <span v-else-if="grip[exercise.exercise] !== 0">{{ grip[exercise.exercise].name }}</span>
    </span>
    <span v-else-if="exercise.grip !== 0">
      <span v-if="exercise.grip"> {{ grip[exercise.grip].short }}&nbsp; </span>
      <!-- fallback-->
      <span v-else-if="grip[exercise.exercise]">{{ grip[exercise.exercise].name }}</span>
    </span>
    <span v-if="exercise.pullups > 0 && exercise.exercise > 0">
      {{ exercises[exercise.exercise - 1].name }}
    </span>
    <span v-if="exercise.pullups > 1 && exercise.exercise > 0">s</span>
  </span>
</template>
