<script setup>
import { defineEmits, defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import router from '@/router'
import { time, useRandomImage } from '@/helpers'
import { useAuthentication } from '@/stores/authentication'

const { t } = useI18n()

const emit = defineEmits(['show'])

const { user } = storeToRefs(useAuthentication())

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  workout: {
    type: Object
  },
  timeTotal: {
    type: Number
  },
  timeHanging: {
    type: Number
  }
})

const shareAPI = navigator.share

const shareExternal = () => {
  let title = t('I just did a quick workout for {time}', {
    time: time(props.timeTotal)
  })
  let text = `${title}. ${t('Where I hung for {time}', {
    time: time(props.timeHanging)
  })}. ${t('Join {appTitle}', { appTitle: 'HangTime' })}!`
  if (props.workout) {
    title = `${props.workout.name} | HangTime`
    text = `${t('I just completed {name}', {
      name: props.workout.name
    })}. ${t('Description')}: "${props.workout.description}". ${t(
      'Join {appTitle}',
      { appTitle: 'HangTime' }
    )}!`
  }
  navigator
    .share({
      title,
      text,
      url: document.location.href
    })
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('Thanks for sharing!')
    })
    .catch(
      // eslint-disable-next-line no-console
      console.error
    )
}

const closeModal = () => {
  emit('show', false)
  router.push('/activity')
}
</script>

<template>
  <v-dialog fullscreen :scrim="false" transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar>
        <v-toolbar-title>{{ t('Well done') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            v-if="shareAPI"
            icon="$exportVariant"
            color="text"
            @click="shareExternal"
          ></v-btn>
          <v-btn icon="$close" color="text" @click="closeModal"></v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-img class="align-end" height="50" :src="useRandomImage('dark')" cover>
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
              <div>{{ t('Hangboarding') }}: {{ time(timeHanging) }}</div>
            </div>

            <v-divider v-if="user?.completed" class="my-4"></v-divider>

            <v-list>
              <v-list-item v-if="user?.completed?.time !== null" class="px-0">
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
              <v-list-item v-if="user?.completed?.hold !== null" class="px-0">
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
              <v-list-item v-if="user?.completed?.amount !== null" class="px-0">
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
        <v-btn color="text" @click="router.go()">{{ t('Restart') }}</v-btn>
        <v-btn color="text" to="/activity">{{ t('Activty') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped></style>
