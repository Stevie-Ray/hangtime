<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkouts } from '@/stores/workouts'
import { useAuthentication } from '@/stores/authentication'
import { useApp } from '@/stores/app'

const { workouts } = storeToRefs(useWorkouts())

const { updateWorkout } = useWorkouts()

const { networkOnLine } = storeToRefs(useApp())

const { user } = storeToRefs(useAuthentication())

const props = defineProps({
  workout: {
    type: Object
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
  if (!workout?.value?.subscribers?.length || !user.value) return false
  return workout.value.subscribers.some((subscriber) => subscriber === user.value.id)
})

const workoutSubscriber = () => {
  if (!isHearted.value) {
    workout?.value.subscribers.unshift(user.value.id)
    // push to workouts
    workouts?.value.unshift(workout?.value)
  } else {
    // do not allow users to unsubscribe from self-created workouts
    if (workout?.value?.user?.id === user?.value?.id) return
    const userIndex = workout?.value.subscribers.indexOf(user.value.id)
    workout?.value.subscribers.splice(userIndex, 1)
    // remove from workouts
    const index = workouts?.value.findIndex((item) => item.id === workout?.value.id)
    workouts?.value.splice(index, 1)
  }
  if (workout.value?.user) {
    updateWorkout({ userId: workout.value.user.id, workout: workout.value })
  }
}
</script>

<template>
  <v-btn
    v-if="workout?.subscribers"
    :append-icon="isHearted ? '$heart' : '$heartOutline'"
    :disabled="!networkOnLine"
    color="text"
    variant="text"
    :size="size"
    @click="clickable ? workoutSubscriber() : null"
  >
    {{ workout?.subscribers?.length - 1 }}
  </v-btn>
</template>
