<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { event } from 'vue-gtag'
import { storeToRefs } from 'pinia'
import router from '@/router'
import { time, useRandomImage } from '@/helpers'
import { useAuthenticationStore } from '@/stores/authentication.store'
import { IWorkout } from '@/interfaces/workout.interface'

const { t } = useI18n()

const emit = defineEmits(['show'])

const { user } = storeToRefs(useAuthenticationStore())

const workout = defineModel<IWorkout>({ required: true })

const {
  showDialog = false,
  timeTotal,
  timeHanging
} = defineProps<{
  showDialog?: boolean
  timeTotal?: number
  timeHanging?: number
}>()

const shareAPI = navigator.share

const shareExternal = () => {
  let title = t('I just did a quick workout for {time}', {
    time: time(timeTotal)
  })
  let text = `${title}. ${t('Where I hung for {time}', {
    time: time(timeHanging)
  })}. ${t('Join {appTitle}', { appTitle: 'HangTime' })}!`
  if (workout.value) {
    title = `${workout.value.name} | HangTime`
    text = `${t('I just completed {name}', {
      name: workout.value.name
    })}. ${t('Description')}: "${workout.value.description}". ${t('Join {appTitle}', {
      appTitle: 'HangTime'
    })}!`
  }
  navigator
    .share({
      title,
      text,
      url: document.location.href
    })
    .then(() => {
      console.log('Thanks for sharing!')
      event('share', { source: 'workout_complete_dialog' })
    })
    .catch(console.error)
}

const closeModal = () => {
  emit('show', false)
  router.push('/activity')
}
</script>

<template>
  <v-dialog
    :model-value="showDialog"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar>
        <v-toolbar-title>{{ t('Well done') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            v-if="shareAPI !== undefined"
            icon="$exportVariant"
            color="text"
            @click="shareExternal"
          ></v-btn>
          <v-btn icon="$close" color="text" @click="closeModal"></v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-img class="align-end" height="50" :src="useRandomImage(true)" cover>
        <v-card-subtitle v-if="workout?.name">
          {{ t('You completed {name}') }}
        </v-card-subtitle>
        <v-card-title v-if="workout?.name" class="mb-2">
          {{ workout.name }}
        </v-card-title>
      </v-img>

      <v-card-text class="mt-4">
        <v-row>
          <v-col cols="12">
            <div class="pb-4">
              <div class="text-h5">
                {{ t('Time worked out') }}
              </div>
              <div class="text-h2 font-weight-bold">
                {{ time(timeTotal) }}
              </div>
              <div>{{ t('Time hangboarding') }}: {{ time(timeHanging) }}</div>
            </div>

            <v-divider v-if="user?.completed" class="my-4"></v-divider>

            <v-list>
              <v-list-item v-if="user?.completed && user.completed.time !== null" class="px-0">
                <v-list-item-title>
                  {{ t('Total time worked out') }}
                </v-list-item-title>
                <template v-slot:prepend>
                  <v-icon size="small" icon="$timer"></v-icon>
                </template>
                <template v-slot:append>
                  {{ time(user.completed.time) }}
                </template>
              </v-list-item>
              <v-list-item v-if="user?.completed && user.completed.hold !== null" class="px-0">
                <v-list-item-title>
                  {{ t('Total time hangboarding') }}
                </v-list-item-title>
                <template v-slot:prepend>
                  <v-icon size="small" icon="$keyboard"></v-icon>
                </template>
                <template v-slot:append>
                  {{ time(user.completed.hold) }}
                </template>
              </v-list-item>
              <v-list-item v-if="user?.completed && user.completed.amount !== null" class="px-0">
                <v-list-item-title>
                  {{ t('Workouts done') }}
                </v-list-item-title>
                <template v-slot:prepend>
                  <v-icon size="small" icon="$trophy"></v-icon>
                </template>
                <template v-slot:append>
                  {{ user.completed.amount }}
                </template>
              </v-list-item>
            </v-list>
            <v-divider v-if="user?.completed" class="my-4"></v-divider>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-end px-4">
        <v-btn color="text" @click="router.go(0)">{{ t('Restart') }}</v-btn>
        <v-btn color="text" to="/activity">{{ t('Stats') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped></style>
