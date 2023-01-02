<script setup>
import { defineEmits, defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { time } from '@/helpers'
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
            icon="mdi-export-variant"
            color="text"
            @click="shareExternal"
            >{{ t('Share') }}
          </v-btn>
          <v-btn
            icon="mdi-close"
            color="text"
            @click="emit('show', false)"
          ></v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col cols="12">
            <p v-if="workout?.name">
              {{
                t('You completed {name}', {
                  name: workout.name
                })
              }}
            </p>

            <div class="subtitle-1">
              {{ t('Time worked out') }}
            </div>
            <div class="text-h2 font-weight-bold">
              {{ time(timeTotal) }}
            </div>
            <div>{{ t('Hangboarding') }}: {{ time(timeHanging) }}</div>

            <v-divider v-if="user?.completed" class="my-4"></v-divider>

            <div v-if="user?.completed?.time !== null" class="subtitle-2">
              {{ t('Total time worked out') }}:
              {{ time(user.completed.time) }}
            </div>
            <div v-if="user?.completed?.hold !== null" class="subtitle-2">
              {{ t('Total time hangboarding') }}:
              {{ time(user.completed.hold) }}
            </div>
            <div v-if="user?.completed?.amount !== null" class="subtitle-2">
              {{ t('Workouts done') }}: {{ user.completed.amount }}
            </div>
            <v-divider v-if="user?.completed" class="my-4"></v-divider>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped></style>
