<script setup>
import { useHead } from '@vueuse/head'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { reactive } from 'vue'
import AppContainer from '@/components/organisms/AppContainer/AppContainer'
import ExerciseCounter from '@/components/molecules/ExerciseCounter/ExerciseCounter'
import WorkoutTimer from '@/components/organisms/WorkoutTimer/WorkoutTimer'

const { t } = useI18n()

const router = useRouter()

const exercises = reactive([
  {
    hold: 7,
    rest: 3,
    repeat: 9
  }
])

useHead({
  title: 'Quick Workouts',
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container prepend hide-footer>
    <template #prepend>
      <v-icon @click="router.go(-1)">mdi-arrow-left</v-icon>
    </template>

    <template #title>{{ t('Quick workout') }}</template>

    <template #default>
      <workout-timer :exercises="exercises">
        <template #default>
          <!--              :disabled="play"-->
          <exercise-counter
            title="Hang"
            :value="exercises[0].hold"
            :min="3"
            :max="180"
            @input="(value) => (exercises[0].hold = value)"
          >
          </exercise-counter>

          <!--              :disabled="play"-->
          <exercise-counter
            title="Repeat"
            :value="exercises[0].repeat"
            :timer="false"
            :min="0"
            :max="14"
            @input="(value) => (exercises[0].repeat = value)"
          >
            <template #default>{{ exercises[0].repeat + 1 }}x</template>
          </exercise-counter>

          <exercise-counter
            v-if="exercises[0].repeat > 0"
            title="Rest"
            :value="exercises[0].rest"
            :min="3"
            :disabled="exercises[0].repeat === 0"
            @input="(value) => (exercises[0].rest = value)"
          >
          </exercise-counter>
        </template>
      </workout-timer>
    </template>
  </app-container>
</template>

<style lang="scss" scoped></style>
