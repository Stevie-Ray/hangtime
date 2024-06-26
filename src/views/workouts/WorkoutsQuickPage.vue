<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { reactive } from 'vue'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import ExerciseCounter from '@/components/molecules/ExerciseCounter/ExerciseCounter.vue'
import WorkoutTimer from '@/components/organisms/WorkoutTimer/WorkoutTimer.vue'
import { Workout } from '@/interfaces/workouts.interface'

const { t } = useI18n()

const router = useRouter()

const workout = reactive<Workout>({
  name: 'Quick workout',
  description: 'Just a simple timer go get you going',
  exercises: [
    {
      hold: 7,
      rest: 3,
      repeat: 9,
      exercise: 0,
      grip: 0,
      level: 0,
      left: 0,
      right: 0,
      pause: 0,
      pullups: 0,
      weight: 0,
      notes: ''
    }
  ],
  level: 1,
  hangboard: 0,
  company: 0,
  time: 0,
  share: false,
  video: '',
  subscribers: [],
  user: {
    displayName: '',
    grade: 0,
    id: '',
    photoURL: ''
  }
})

useHead({
  title: t('Quick workout'),
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container prepend hide-footer>
    <template #prepend>
      <v-icon @click="router.go(-1)">$arrowLeft</v-icon>
    </template>

    <template #title>{{ t('Quick workout') }}</template>

    <template #default>
      <workout-timer v-if="workout?.exercises?.length" :workout="workout" :quick="true">
        <template #default>
          <exercise-counter
            title="Hang"
            :value="workout.exercises[0].hold"
            :min="3"
            :max="180"
            @input="(value) => (workout.exercises[0].hold = value)"
          >
          </exercise-counter>

          <exercise-counter
            title="Repeat"
            :value="workout.exercises[0].repeat"
            :timer="false"
            :min="0"
            :max="24"
            @input="(value) => (workout.exercises[0].repeat = value)"
          >
            <template #default>{{ workout.exercises[0].repeat + 1 }}x</template>
          </exercise-counter>

          <exercise-counter
            v-if="workout.exercises[0].repeat > 0"
            title="Rest"
            :value="workout.exercises[0].rest"
            :min="3"
            :disabled="workout.exercises[0].repeat === 0"
            @input="(value) => (workout.exercises[0].rest = value)"
          >
          </exercise-counter>
        </template>
      </workout-timer>
    </template>
  </app-container>
</template>

<style lang="scss" scoped></style>
