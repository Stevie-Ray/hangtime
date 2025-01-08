<script setup lang="ts">
import { reactive } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import ExerciseCounter from '@/components/molecules/ExerciseCounter/ExerciseCounter.vue'
import WorkoutTimer from '@/components/organisms/WorkoutTimer/WorkoutTimer.vue'
import { Workout } from '@/models/workout.model'

const { t } = useI18n()

const workout = reactive(
  new Workout({
    name: 'Quick workout',
    description: 'Just a simple timer go get you going'
  })
)

workout.addExercise({
  pause: 0,
  repeat: 9,
  pullups: 0
})

useHead({
  title: t('Quick workout'),
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container toolbar-prepend hide-footer>
    <template #title>{{ t('Quick workout') }}</template>

    <template #default>
      <workout-timer v-if="workout?.exercises?.length" v-model="workout" quick>
        <template #default>
          <exercise-counter
            title="Hang"
            :value="workout.exercises[0].hold"
            :min="3"
            :max="180"
            timer
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
            timer
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
