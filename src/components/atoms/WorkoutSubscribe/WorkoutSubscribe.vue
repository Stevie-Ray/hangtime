<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkoutsStore } from '@/stores/workouts'
import { useAuthenticationStore } from '@/stores/authentication'
import { useAppStore } from '@/stores/app'
import { Workout } from '@/interfaces/workouts.interface'

const { updateWorkout } = useWorkoutsStore()

const { workouts } = storeToRefs(useWorkoutsStore())

const { online } = storeToRefs(useAppStore())

const { user } = storeToRefs(useAuthenticationStore())

const props = defineProps({
  workout: {
    type: Object as () => Workout
  },
  size: {
    type: String,
    default: 'default'
  },
  clickable: {
    type: Boolean,
    default: true
  }
})

const workout = ref(props.workout)

watch(
  () => props.workout,
  (newValue) => {
    workout.value = newValue
  }
)

const isHearted = computed(() => {
  if (!workout.value || !workout.value.subscribers || !user.value) return false
  return workout.value.subscribers.includes(user.value.id)
})

const workoutSubscriber = () => {
  if (!workout.value || !user.value) return

  const subscribers = [...workout.value.subscribers] // Create a copy for modification
  const userId = user.value.id

  if (!isHearted.value) {
    subscribers.unshift(userId)
  } else {
    // Prevent users from unsubscribing from their own workouts
    if (workout.value.user?.id === userId) return

    const userIndex = subscribers.indexOf(userId)
    if (userIndex !== -1) {
      subscribers.splice(userIndex, 1)
    }
  }

  // Update workout value and trigger reactivity
  workout.value.subscribers = subscribers
  workouts.value = workouts.value.slice()

  if (workout.value.user) {
    workout.value.subscribers_count = workout.value.subscribers.length - 1
    updateWorkout({ userId: workout.value.user.id, workout: workout.value })
  }
}
</script>

<template>
  <v-btn
    v-if="workout?.subscribers"
    :append-icon="isHearted ? '$heart' : '$heartOutline'"
    :disabled="!online"
    color="text"
    variant="text"
    :size="size"
    @click="clickable ? workoutSubscriber() : null"
  >
    {{ workout.subscribers_count ? workout.subscribers_count : workout.subscribers.length - 1 }}
  </v-btn>
</template>
