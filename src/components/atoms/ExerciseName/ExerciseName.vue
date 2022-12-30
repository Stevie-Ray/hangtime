<script setup>
import { defineProps } from 'vue'
import { useExercises, useGrip } from '@/helpers'

const grip = useGrip()
const exercises = useExercises()

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
  <span v-if="props.exercise">
    <span v-if="props.exercise.repeat > 0 && !props.hideRepeat"
      >{{ props.exercise.repeat + 1 }}x
    </span>
    <span v-if="props.exercise.pullups > 1"
      >{{ props.exercise.pullups }}&nbsp;</span
    >
    <span v-if="props.exercise.left === null || props.exercise.right === null"
      >One-Arm
    </span>
    <span v-if="props.exercise.exercise === 0">
      <span v-if="props.exercise.grip">{{ grip[exercise.grip].name }}</span>
      <!-- fallback-->
      <span v-else-if="grip[props.exercise.exercise] !== 0">{{
        grip[props.exercise.exercise].name
      }}</span>
    </span>
    <span v-else-if="props.exercise.grip !== 0">
      <span v-if="props.exercise.grip"
        >{{ grip[props.exercise.grip].short }}&nbsp;</span
      >
      <!-- fallback-->
      <span v-else-if="grip[props.exercise.exercise]">{{
        grip[props.exercise.exercise].name
      }}</span>
    </span>
    <span v-if="props.exercise.pullups > 0 && props.exercise.exercise > 0">
      {{ exercises[props.exercise.exercise - 1].name }}
    </span>
    <span v-if="props.exercise.pullups > 1 && props.exercise.exercise > 0"
      >s</span
    >
  </span>
</template>
