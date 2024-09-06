<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import WorkoutTimer from '@/components/organisms/WorkoutTimer/WorkoutTimer.vue'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import { useWorkoutsStore } from '@/stores/workouts'

const route = useRoute()
const router = useRouter()

const { getWorkoutById } = useWorkoutsStore()

const workout = computed(() => getWorkoutById(route.params.id))

useHead({
  title: () => workout.value?.name ?? '',
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container prepend hide-footer>
    <template #prepend>
      <v-icon @click="router.go(-1)">$arrowLeft</v-icon>
    </template>

    <template #title>
      <span v-if="workout">{{ workout.name }}</span>
    </template>

    <template #default>
      <workout-timer v-if="workout" v-model="workout" />
    </template>
  </app-container>
</template>
