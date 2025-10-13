<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { event } from 'vue-gtag'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.store'
import { useUserStore } from '@/stores/user.store'
import type { IWorkout } from '@/interfaces/workout.interface'

const router = useRouter()

const { online } = storeToRefs(useAppStore())

const { getUserHangboardCompany, getUserHangboard } = storeToRefs(useUserStore())

const workout = defineModel<IWorkout>({ required: true })

const { size = 'default' } = defineProps<{
  size?: string
}>()

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
    event('share', { source: 'workout_share_button' })
  } catch (err) {
    console.log(`Error: ${err}`)
  }
}
</script>

<template>
  <v-btn
    v-if="workout?.share"
    color="text"
    icon="$shareVariant"
    variant="text"
    :disabled="!online || !navigatorShare"
    :size="size"
    :title="$t('Share')"
    @click="shareWorkout"
  ></v-btn>
</template>
