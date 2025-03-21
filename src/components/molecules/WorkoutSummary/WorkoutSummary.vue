<script setup lang="ts">
import urlParser from 'js-video-url-parser'
import { ref, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { time, useRandomImage } from '@/helpers'
import { useUserStore } from '@/stores/user.store'
import ExerciseName from '@/components/atoms/ExerciseName/ExerciseName.vue'
import { IWorkout } from '@/interfaces/workout.interface'

const { t } = useI18n()

const { getUserHangboardCompany, getUserHangboard } = storeToRefs(useUserStore())

const workout = defineModel<IWorkout>({ required: true })

const { edit = false } = defineProps<{
  edit?: boolean
}>()

const emit = defineEmits(['save'])

const contentToggle: Ref<boolean> = ref(true)

// workout - video
const parseVideo = (video: string) => {
  const videoData = urlParser.parse(video)
  if (videoData) {
    return urlParser.create({
      videoInfo: { ...videoData },
      format: 'embed'
    })
  }
  return ''
}
</script>

<template>
  <v-row v-if="workout">
    <v-col cols="12">
      <v-card class="mx-auto" :image="contentToggle ? useRandomImage() : undefined" theme="light">
        <v-card-text v-if="contentToggle" style="min-height: 72px">
          <div
            class="text-subtitle-1 mb-4"
            :class="{ 'mr-12': workout.video && parseVideo(workout.video) }"
          >
            {{ workout.description }}
          </div>
        </v-card-text>
        <v-card-actions v-if="contentToggle" class="justify-space-between">
          <div v-if="workout.user" class="d-flex align-center mt-2">
            <div>
              <v-avatar class="mr-2" color="grey-darken-1" size="small">
                <v-img
                  :alt="workout.user.displayName"
                  :src="workout.user.photoURL"
                  :title="workout.user.id"
                  height="40"
                  width="40"
                ></v-img>
              </v-avatar>
            </div>
            <div>{{ workout.user.displayName }}</div>
          </div>
          <v-btn
            v-if="!edit && getUserHangboard && getUserHangboardCompany && workout?.id"
            :to="`/workouts/${getUserHangboard.id}/${getUserHangboardCompany.id}/${workout.id}/timer`"
            class="mb-1"
            color="text"
            size="large"
            variant="outlined"
          >
            {{ t('Start workout') }}
          </v-btn>
          <v-btn
            v-else-if="edit"
            class="mb-1"
            color="text"
            size="large"
            variant="outlined"
            @click="emit('save')"
          >
            {{ t('Save workout') }}
          </v-btn>
        </v-card-actions>

        <v-responsive
          v-if="!contentToggle && workout.video && parseVideo(workout.video)"
          :aspect-ratio="16 / 9"
          class="rounded-lg"
          cover
        >
          <iframe
            :src="parseVideo(workout.video)"
            frameborder="0"
            height="100%"
            width="100%"
          ></iframe>
        </v-responsive>

        <v-btn
          v-if="workout.video && parseVideo(workout.video)"
          @click="contentToggle = !contentToggle"
          :icon="contentToggle ? '$video' : '$videoOff'"
          color="text"
          class="position-absolute"
          size="small"
          style="right: 16px; top: 16px"
        />
      </v-card>
    </v-col>
  </v-row>

  <v-row v-if="workout">
    <v-col cols="6">
      <v-card v-if="workout.time !== null" class="py-4">
        <v-card-title class="text-center">
          <v-icon size="small">$clockOutline</v-icon>
          {{ time(workout.time) }}
        </v-card-title>
      </v-card>
    </v-col>
    <v-col cols="6">
      <v-card v-if="workout.exercises" class="py-4">
        <v-card-title class="text-center">
          <v-icon size="small">$repeat</v-icon>
          {{ workout.exercises.length }} {{ t('Set', workout.exercises.length) }}
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>

  <v-row v-if="workout" class="hidden-sm-and-down">
    <v-col cols="12">
      <v-card class="summary">
        <v-list class="rounded-lg">
          <template v-for="(exercise, index) in workout.exercises" :key="index">
            <v-list-item>
              <template #prepend>
                <v-chip class="mr-2" color="primary">{{ index + 1 }}.</v-chip>
              </template>
              <template #title>
                <strong>
                  <exercise-name :model-value="exercise" />
                </strong>
              </template>
              <template #append>
                <div class="d-flex flex-column text-right">
                  <div class="v-list-item-title" v-if="exercise.hold">
                    <span v-if="exercise.hold && exercise.exercise === 0 && !exercise.max">
                      <span>{{ t('Hang') }}: </span>
                      <strong>{{ time(Math.round(exercise.hold)) }}</strong>
                    </span>
                    <span
                      v-if="
                        exercise.hold && exercise.exercise === 0 && !exercise.max && exercise.repeat
                      "
                    >
                      |
                    </span>
                    <span v-if="exercise.repeat">
                      <span>{{ t('Rest') }}: </span>
                      <strong>{{ time(Math.round(exercise.rest)) }}</strong>
                    </span>
                  </div>
                  <div class="v-list-item-subtitle">
                    <span v-if="workout.exercises[index + 1]">
                      {{ t('Pause') }}: {{ time(workout.exercises[index + 1].pause) }}
                    </span>
                    <span v-else>
                      {{ t('Done') }}
                    </span>
                  </div>
                </div>
              </template>
            </v-list-item>
            <v-divider v-if="workout.exercises[index + 1]" class="my-2"></v-divider>
          </template>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
// video
.v-expansion-panels--variant-accordion {
  & > :last-child {
    border-top-left-radius: 8px !important;
    border-top-right-radius: 8px !important;
  }

  & > :first-child {
    border-bottom-left-radius: 8px !important;
    border-bottom-right-radius: 8px !important;
  }
}

.v-expansion-panel-text:deep(.v-expansion-panel-text__wrapper) {
  padding: 8px 16px 16px;
}

.summary {
  .v-list {
    @media (min-width: 960px) {
      max-height: 320px;
    }
  }
}
</style>
