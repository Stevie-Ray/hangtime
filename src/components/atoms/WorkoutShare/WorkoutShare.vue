<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { Workout } from '@/interfaces/workouts.interface'

const router = useRouter()

const { networkOnLine } = storeToRefs(useAppStore())

const { getUserHangboardCompany, getUserHangboard } = storeToRefs(useUserStore())

const props = defineProps({
  workout: {
    type: Object as () => Workout
  },
  size: {
    type: String,
    default: 'default'
  }
})

const workout = ref(props.workout)

watch(
  () => props.workout,
  (newValue) => {
    workout.value = newValue
  }
)

const navigatorShare = navigator.share

const shareWorkout = async () => {
  const path =
    window.location.origin +
    router.resolve({
      name: 'WorkoutsDetailPage',
      params: {
        company: getUserHangboardCompany.value?.id,
        hangboard: getUserHangboard.value?.id,
        id: workout.value?.id
      }
    }).href

  const shareData = {
    title: `${workout.value?.name} | HangTime`,
    text: `${workout.value?.name} | HangTime - ${workout.value?.description}`,
    url: `${path}`
  }

  try {
    await navigator.share(shareData)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`Error: ${err}`)
  }
}
</script>

<template>
  <v-btn
    v-if="workout?.share"
    :disabled="!networkOnLine || !navigatorShare"
    color="text"
    variant="text"
    :size="size"
    icon="$shareVariant"
    @click="shareWorkout"
  ></v-btn>
</template>
