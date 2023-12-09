<script setup>
import { useHead } from '@unhead/vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import urlParser from 'js-video-url-parser'

import WorkoutSave from '@/components/molecules/dialog/WorkoutSave/WorkoutSave.vue'
import MissingHangboard from '@/components/molecules/dialog/MissingHangboard/MissingHangboard.vue'
import ExerciseList from '@/components/organisms/ExerciseList/ExerciseList.vue'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'

import { useApp } from '@/stores/app'
import { useWorkouts } from '@/stores/workouts'
import { useAuthentication } from '@/stores/authentication'
import { useUser } from '@/stores/user'
import { time, useRandomImage } from '@/helpers'

const { t } = useI18n()

const { networkOnLine } = storeToRefs(useApp())

const { workouts } = storeToRefs(useWorkouts())

// router
const route = useRoute()
const router = useRouter()

// workout
const { fetchCommunityWorkouts, getWorkoutById, removeUserWorkoutById, updateWorkout } =
  useWorkouts()

const { getUserHangboards, getUserHangboardCompany, getUserHangboard } = storeToRefs(useUser())

const { user } = storeToRefs(useAuthentication())

const { updateUser } = useAuthentication()

const workout = computed(() => getWorkoutById(route.params.id ? route.params.id : 'new'))

// workout - edit
const editMode = ref(false)

// workout - save
const workoutSaveDialog = ref(false)

const exerciseAdd = () => {
  // create in function
  const exerciseNew = {
    exercise: 0,
    grip: 0,
    level: 0,
    left: 0,
    right: 0,
    pause: 10,
    hold: 7,
    pullups: 1,
    repeat: 0,
    rest: 3,
    weight: 0,
    notes: ''
  }
  // remove first exercise pause
  if (workout.value?.exercises?.length === 0) {
    exerciseNew.pause = 0
  }

  exerciseNew.time =
    (exerciseNew.hold + exerciseNew.rest) * (exerciseNew.repeat + 1) -
    exerciseNew.rest +
    exerciseNew.pause

  if (workout.value) {
    workout.value.time += exerciseNew.time

    workout.value.exercises.push(exerciseNew)
  }
}

onMounted(() => {
  if (route.path === '/workouts/new') {
    exerciseAdd()
    editMode.value = true
  }
})

// workout - remove
const removeWorkout = () => {
  removeUserWorkoutById(route.params.id)
  router.push('/workouts')
}

const missingHangboardDialog = computed(() => {
  if (!route.params.company || !route.params.hangboard) {
    return false
  }
  const company = parseInt(route.params.company, 10)
  const hangboard = parseInt(route.params.hangboard, 10)
  const exists = getUserHangboards.value.some(
    (el) => el.company === company && el.hangboard === hangboard
  )
  if (!exists) {
    // show dialog to add new hangboard
    return true
  }
  // if hangboard exists but is not selected, switch hangboard
  if (company !== getUserHangboardCompany && hangboard !== getUserHangboard) {
    const index = getUserHangboards.value.findIndex(
      (list) => list.company === company && list.hangboard === hangboard
    )
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    user.value.settings.selected = index
    updateUser()
    fetchCommunityWorkouts()
  }
  // do nothing
  return false
})

// workout - weight
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

// workout - share
const navigatorShare = navigator.share

const shareWorkout = async () => {
  const path =
    window.location.origin +
    router.resolve({
      name: 'WorkoutsDetailPage',
      params: {
        company: getUserHangboardCompany.value.id,
        hangboard: getUserHangboard.value.id,
        id: workout.value.id
      }
    }).href

  const shareData = {
    title: `${workout.value.name} | HangTime`,
    text: `${workout.value.name} | HangTime - ${workout.value.description}`,
    url: `${path}`
  }

  try {
    await navigator.share(shareData)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`Error: ${err}`)
  }
}

// workout - video
const parseVideo = (video) => {
  const videoData = urlParser.parse(video)
  if (videoData) {
    return urlParser.create({
      videoInfo: { ...videoData },
      format: 'embed'
    })
  }
  return ''
}

const startWorkoutButton = ref(false)

const onScroll = () => {
  startWorkoutButton.value = window.scrollY > 250
}

const goToTimer = () => {
  router.push(
    `/workouts/${getUserHangboard.value.id}/${getUserHangboardCompany.value.id}/${workout.value.id}/timer`
  )
}

useHead({
  title: () => workout?.value?.name,
  meta: [{ name: 'description', content: () => workout?.value?.description }]
})
</script>

<template>
  <app-container prepend>
    <template #prepend>
      <v-icon @click="router.go(-1)">$arrowLeft</v-icon>
    </template>

    <template #title>
      <span v-if="workout">{{ workout.name }}</span>
      <span v-else>{{ t('No workouts found') }}</span>
    </template>

    <template #icons>
      <v-btn
        v-if="workout?.subscribers && !editMode"
        :disabled="!networkOnLine"
        size="x-large"
        color="text"
        :append-icon="isHearted ? '$heart' : '$heartOutline'"
        @click="workoutSubscriber"
      >
        {{ workout?.subscribers?.length - 1 }}
      </v-btn>
      <v-btn
        v-if="workout?.share && navigatorShare && !editMode"
        icon="$shareVariant"
        color="text"
        @click="shareWorkout"
      ></v-btn>
      <v-btn
        v-if="workout?.user?.id === user?.id && !editMode"
        :disabled="!networkOnLine"
        icon="$pencil"
        color="text"
        @click="editMode = true"
      ></v-btn>
      <v-btn
        v-if="editMode"
        icon="$contentSaveOutline"
        color="text"
        @click="workoutSaveDialog = true"
      ></v-btn>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-if="editMode" icon="$dotsVertical" color="text" v-bind="props"></v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title @click="workoutSaveDialog = true">{{
              t('Rename workout')
            }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title @click="removeWorkout">{{ t('Delete workout') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>

    <template #default>
      <v-container>
        <v-row>
          <v-col cols="12">
            <div v-if="workout">
              <v-row class="mb-4">
                <v-col cols="12">
                  <v-card class="mx-auto" min-height="144" max-width="100%" theme="light">
                    <v-img :src="useRandomImage()" cover>
                      <v-card-text>
                        <div class="text-subtitle-1 mb-4">
                          {{ workout.description }}
                        </div>
                        <div class="d-flex align-center mt-2" v-if="workout.user">
                          <div>
                            <v-avatar size="small" color="grey-darken-1" class="mr-2">
                              <v-img
                                :src="workout.user.photoURL"
                                :alt="workout.user.displayName"
                                height="40"
                                width="40"
                              ></v-img>
                            </v-avatar>
                          </div>
                          <div>{{ workout.user.displayName }}</div>
                        </div>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                          v-if="!editMode"
                          :to="`/workouts/${getUserHangboard.id}/${getUserHangboardCompany.id}/${workout.id}/timer`"
                          class="mb-1"
                          color="text"
                          size="large"
                          variant="outlined"
                        >
                          {{ t('Start workout') }}
                        </v-btn>
                        <v-btn
                          v-else
                          class="mb-1"
                          color="text"
                          size="large"
                          variant="outlined"
                          @click="workoutSaveDialog = true"
                        >
                          {{ t('Save workout') }}
                        </v-btn>
                      </v-card-actions>
                    </v-img>
                  </v-card>
                </v-col>
              </v-row>

              <v-row v-if="workout.video" class="mb-4">
                <v-col cols="12">
                  <v-expansion-panels variant="accordion">
                    <v-expansion-panel>
                      <v-expansion-panel-title>
                        <v-icon class="mr-2">$video</v-icon>Video
                      </v-expansion-panel-title>

                      <v-expansion-panel-text>
                        <v-responsive
                          v-if="workout.video && parseVideo(workout.video)"
                          :aspect-ratio="16 / 9"
                          class="rounded-lg"
                        >
                          <iframe
                            width="100%"
                            height="100%"
                            :src="parseVideo(workout.video)"
                            frameborder="0"
                          ></iframe>
                        </v-responsive>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
              </v-row>

              <v-row class="mb-4">
                <v-col cols="6">
                  <v-card v-if="workout?.time !== null" class="py-4">
                    <v-card-title class="text-center">
                      <v-icon size="small">$clockOutline</v-icon>
                      {{ time(workout.time) }}
                    </v-card-title>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card v-if="workout?.exercises" class="py-4">
                    <v-card-title class="text-center">
                      <v-icon size="small">$repeat</v-icon>
                      {{ workout.exercises.length }} sets
                    </v-card-title>
                  </v-card>
                </v-col>
              </v-row>

              <v-row class="mb-4">
                <v-col cols="12">
                  <div class="workout">
                    <exercise-list :workout="workout" :edit="editMode" @add="exerciseAdd" />

                    <!-- save dialog -->
                    <workout-save
                      v-model="workoutSaveDialog"
                      :workout="workout"
                      @show="workoutSaveDialog = !workoutSaveDialog"
                    />
                  </div>
                </v-col>
              </v-row>

              <div v-show="!editMode" v-scroll="onScroll" class="fab text-end">
                <div class="mx-4">
                  <v-fab-transition>
                    <v-btn
                      v-show="startWorkoutButton"
                      :to="`/workouts/${getUserHangboard.id}/${getUserHangboardCompany.id}/${workout.id}/timer`"
                      size="x-large"
                      rounded="lg"
                      @click="goToTimer"
                    >
                      {{ t('Start workout') }}
                    </v-btn>
                  </v-fab-transition>
                </div>
              </div>
            </div>

            <div v-else>
              {{ t('No workouts found') }}

              <missing-hangboard
                v-model="missingHangboardDialog"
                @show="missingHangboardDialog = !missingHangboardDialog"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-container>
</template>

<style lang="scss" scoped>
.fab {
  bottom: 56px;
  z-index: 1007;
  transform: translateY(0%);
  position: fixed;
  height: 80px;
  left: 0;
  width: calc((100% - 0px) - 0px);
  pointer-events: none;
  .v-btn {
    background-color: rgb(var(--v-theme-accent));
    z-index: 1008;
    --v-btn-height: 56px;
    pointer-events: initial;
  }
}
.v-expansion-panel-text:deep(.v-expansion-panel-text__wrapper) {
  padding: 8px 16px 16px;
}
.v-toolbar .v-btn--size-x-large {
  min-width: 64px;
  padding: 0 12px;
}
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
</style>
