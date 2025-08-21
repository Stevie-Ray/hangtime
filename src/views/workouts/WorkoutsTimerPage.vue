<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import WorkoutTimer from '@/components/organisms/WorkoutTimer/WorkoutTimer.vue'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import { useWorkoutsStore } from '@/stores/workouts.store'

const route = useRoute()

const { getWorkoutById } = useWorkoutsStore()

const workout = computed(() => getWorkoutById(route.params.id || ''))

useHead({
  title: () => workout.value?.name ?? '',
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container toolbar-prepend hide-footer>
    <template #title>
      <span v-if="workout">{{ workout.name }}</span>
    </template>

    <template #default>
      <workout-timer v-if="workout" v-model="workout" />
    </template>
  </app-container>
</template>
