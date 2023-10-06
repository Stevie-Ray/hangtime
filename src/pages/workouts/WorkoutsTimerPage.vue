<script setup>
import { useHead } from '@unhead/vue'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import WorkoutTimer from '@/components/organisms/WorkoutTimer/WorkoutTimer'
import AppContainer from '@/components/organisms/AppContainer/AppContainer'
import { useWorkouts } from '@/stores/workouts'

const route = useRoute()
const router = useRouter()

const { getWorkoutById } = useWorkouts()

const workout = computed(() => getWorkoutById(route.params.id))

useHead({
  title: () => workout?.value?.name,
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container prepend hide-footer>
    <template #prepend>
      <v-icon @click="router.go(-1)">mdi-arrow-left</v-icon>
    </template>

    <template #title>
      <span v-if="workout">{{ workout.name }}</span>
    </template>

    <template #default="">
      <workout-timer :workout="workout"></workout-timer>
    </template>
  </app-container>
</template>
