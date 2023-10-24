<script setup>
import { useHead } from '@unhead/vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import draggable from 'vuedraggable'
import { event } from 'vue-gtag'

import urlParser from 'js-video-url-parser'
import AppContainer from '@/components/organisms/AppContainer/AppContainer'
import ExerciseCard from '@/components/molecules/ExerciseCard/ExerciseCard'
import ExerciseCounter from '@/components/molecules/ExerciseCounter/ExerciseCounter'
import ExerciseHand from '@/components/atoms/ExerciseHand/ExerciseHand'

import { useApp } from '@/stores/app'
import { useWorkouts } from '@/stores/workouts'
import { useAuthentication } from '@/stores/authentication'
import { useUser } from '@/stores/user'

import {
  time,
  useExercises,
  useGrip,
  useRandomImage,
  weightConverter
} from '@/helpers'

const { t } = useI18n()

const { networkOnLine } = storeToRefs(useApp())

const { workouts } = storeToRefs(useWorkouts())

// helpers
const grip = useGrip()
const exercises = useExercises()

// router
const route = useRoute()
const router = useRouter()

// workout
const {
  fetchCommunityWorkouts,
  getWorkoutById,
  removeUserWorkoutById,
  createUserWorkout,
  updateUserWorkout,
  updateWorkout
} = useWorkouts()

const { getUserHangboards, getUserHangboardCompany, getUserHangboard } =
  storeToRefs(useUser())

const { getHangboardNameByIds } = useUser()

const { user } = storeToRefs(useAuthentication())

const { updateUser } = useAuthentication()

const workout = computed(() =>
  getWorkoutById(route.params.id ? route.params.id : 'new')
)

// workout - edit
const editMode = ref(false)

const editWorkout = () => {
  editMode.value = true
}

// workout - exercise
const exerciseEditDialog = ref(false)
const workoutSaveDialog = ref(false)
const exerciseIndex = ref(0)

const exercise = computed(() => workout.value.exercises[exerciseIndex.value])

// eslint-disable-next-line no-shadow
const exerciseEdit = (timer, time) => {
  exercise.value[timer] = time
  workout.value.time -= exercise.value.time
  exercise.value.time =
    (exercise.value.hold + exercise.value.rest) * (exercise.value.repeat + 1) -
    exercise.value.rest +
    exercise.value.pause
  workout.value.time += exercise.value.time
}

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

const exerciseRemove = () => {
  workout.value.exercises.splice(exerciseIndex.value)
  exerciseIndex.value = 0
  exerciseEditDialog.value = false
}

const exerciseCopy = () => {
  workout.value.exercises.splice(
    exerciseIndex.value,
    0,
    structuredClone(workout.value.exercises[exerciseIndex.value])
  )
  exerciseIndex.value = 0
  exerciseEditDialog.value = false
}

const exerciseByType = (typeId) =>
  // eslint-disable-next-line no-shadow
  exercises.filter((exercise) => exercise.type === typeId)

const exerciseFilter = (type) => {
  if (exercise.value.grip && grip[exercise.value.grip].disabledExercises) {
    return exerciseByType(type).map((obj) => ({
      ...obj,
      disabled: grip[exercise.value.grip].disabledExercises.includes(obj.id)
    }))
  }
  return exerciseByType(type)
}

const openExerciseEditDialog = (index) => {
  if (editMode.value === true) {
    exerciseIndex.value = index
    exerciseEditDialog.value = true
  }
}

// workout - save
const workoutSave = () => {
  if (!workout.value.id) {
    // new workout
    createUserWorkout(workout.value)
  } else {
    // existing workout
    updateUserWorkout(workout.value)
  }

  workoutSaveDialog.value = false

  editMode.value = false

  router.push('/workouts')
}

// workout - remove
const removeWorkout = () => {
  removeUserWorkoutById(route.params.id)
  router.push('/workouts')
}

const hasHangboardDialog = computed(() => {
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
const addHangboard = () => {
  const company = parseInt(route.params.company, 10)
  const hangboard = parseInt(route.params.hangboard, 10)
  event('add_hangboard', {
    hangboard: getHangboardNameByIds(company, hangboard)
  })
  // add the newly selected board and set it
  user.value.settings.hangboards.push({ company, hangboard })
  user.value.settings.selected = user.value.settings.hangboards.length - 1
}

// workout - weight
const isHearted = computed(() => {
  if (!workout?.value?.subscribers?.length || !user.value) return false
  return workout.value.subscribers.some(
    (subscriber) => subscriber === user.value.id
  )
})

const workoutSubscriber = () => {
  if (!isHearted.value) {
    workout?.value.subscribers.unshift(user.value.id)
    // push to workouts
    workouts?.value.unshift(workout?.value)
  } else {
    const userIndex = workout?.value.subscribers.indexOf(user.value.id)
    workout?.value.subscribers.splice(userIndex, 1)
    // remove from workouts
    const index = workouts?.value.findIndex(
      (item) => item.id === workout?.value.id
    )
    workouts?.value.splice(index, 1)
  }
  updateWorkout({ userId: workout.value.user.id, workout: workout.value })
}

// workout - weight
const weightLabel = computed(() => {
  if (user?.value?.weight && exercise.value.weight !== 0) {
    return `Your weight: ${user.value.weight}kg.
     Training weight: ${user.value.weight + exercise.value.weight}kg.`
  }
  return 'Adjust using kettle/dumb-bells or pulley system'
})

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

const rules = {
  number: (v) => !v.isNaN || 'NaN',
  required: (v) => !!v || 'This field is required',
  length: (length) => (v) =>
    (v || '').length <= length || `Max ${length} characters`,
  min: (min) => (v) => v >= min || `A minimun of  ${min} is allowed`,
  max: (max) => (v) => v <= max || `A maximum of  ${max} is allowed`
}

useHead({
  title: () => workout?.value?.name,
  meta: [{ name: 'description', content: '' }]
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
        @click="editWorkout"
      ></v-btn>
      <v-btn
        v-if="editMode"
        icon="$contentSaveOutline"
        color="text"
        @click="workoutSaveDialog = true"
      ></v-btn>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            v-if="editMode"
            icon="$dotsVertical"
            color="text"
            v-bind="props"
          ></v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title @click="workoutSaveDialog = true">{{
              t('Rename workout')
            }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title @click="removeWorkout">{{
              t('Delete workout')
            }}</v-list-item-title>
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
                  <v-card
                    class="mx-auto"
                    min-height="144"
                    max-width="100%"
                    theme="light"
                  >
                    <v-img :src="useRandomImage()" cover>
                      <v-card-text>
                        <div class="text-subtitle-1 mb-4">
                          {{ workout.description }}
                        </div>
                        <div
                          class="d-flex align-center mt-2"
                          v-if="workout.user"
                        >
                          <div>
                            <v-avatar
                              size="small"
                              color="grey-darken-1"
                              class="mr-2"
                            >
                              <v-img
                                :src="workout.user.photoURL"
                                :alt="workout.user.displayName"
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
                    <draggable
                      v-model="workout.exercises"
                      item-key="id"
                      class="draggable"
                      ghost-class="ghost"
                      :animation="0"
                      :scroll="true"
                      :scrollSensitivity="120"
                      :disabled="!networkOnLine"
                      handle=".handle"
                    >
                      <template #item="{ element, index }">
                        <exercise-card
                          :exercise="element"
                          :hangboard="{
                            hangboard: workout.hangboard,
                            company: workout.company
                          }"
                          :index="index"
                          :key="index"
                          :hide-rest="index === 0"
                          :sort="editMode"
                          @click="openExerciseEditDialog(index)"
                        >
                        </exercise-card>
                      </template>
                    </draggable>

                    <v-card
                      v-if="editMode"
                      variant="tonal"
                      @click="exerciseAdd"
                    >
                      <v-card-title class="text-center">
                        <v-icon
                          icon="$plus"
                          size="x-small"
                          class="mr-2"
                        ></v-icon>
                        <span>{{ t('Add exercise') }}</span>
                      </v-card-title>
                    </v-card>

                    <!-- edit -->
                    <v-dialog
                      v-model="exerciseEditDialog"
                      :scrim="false"
                      fullscreen
                      transition="dialog-bottom-transition"
                    >
                      <v-card>
                        <v-toolbar>
                          <v-btn
                            icon="$close"
                            color="text"
                            @click="exerciseEditDialog = false"
                          ></v-btn>
                          <v-toolbar-title>
                            {{ t('Edit exercise') }}
                          </v-toolbar-title>

                          <v-toolbar-items>
                            <v-btn
                              v-if="exerciseIndex !== 0"
                              icon="$deleteOutline"
                              @click="exerciseRemove"
                            ></v-btn>
                            <v-btn
                              icon="$contentCopy"
                              @click="exerciseCopy"
                            ></v-btn>
                            <v-btn
                              icon="$contentSaveOutline"
                              @click="exerciseEditDialog = false"
                            ></v-btn>
                          </v-toolbar-items>
                        </v-toolbar>
                        <v-container>
                          <v-row>
                            <v-col cols="12">
                              <v-expansion-panels variant="accordion">
                                <exercise-card
                                  :index="exerciseIndex"
                                  :exercise="exercise"
                                  :hangboard="{
                                    hangboard: workout.hangboard,
                                    company: workout.company
                                  }"
                                  edit-hangboard
                                  :hide-rest="exerciseIndex === 0"
                                  @right="
                                    (hold) =>
                                      exercise.right === hold &&
                                      exercise.left !== null
                                        ? (exercise.right = null)
                                        : (exercise.right = hold)
                                  "
                                  @left="
                                    (hold) =>
                                      exercise.left === hold &&
                                      exercise.right !== null
                                        ? (exercise.left = null)
                                        : (exercise.left = hold)
                                  "
                                  @rotate="
                                    (rotate) => (exercise.rotate = rotate)
                                  "
                                ></exercise-card>

                                <v-expansion-panel>
                                  <v-expansion-panel-title>
                                    <v-icon icon="$numeric1BoxOutline"></v-icon>
                                    <span class="ml-2">{{
                                      t('Exercise')
                                    }}</span>
                                  </v-expansion-panel-title>
                                  <v-expansion-panel-text>
                                    <v-row>
                                      <v-col cols="12">
                                        <v-select
                                          v-model="exercise.grip"
                                          :items="grip"
                                          :label="t('Hang / Lock off')"
                                          item-title="name"
                                          item-value="id"
                                          required
                                        >
                                          <template #append>
                                            <v-tooltip location="bottom">
                                              <template #activator="{ props }">
                                                <v-icon v-bind="props">
                                                  $helpCircleOutline
                                                </v-icon>
                                              </template>
                                              <span
                                                v-if="
                                                  !isNaN(exercise.grip) &&
                                                  grip[exercise.grip] !== null
                                                "
                                              >
                                                {{
                                                  grip[exercise.grip]
                                                    .description
                                                }}
                                              </span>
                                            </v-tooltip>
                                          </template>
                                        </v-select>
                                      </v-col>
                                    </v-row>

                                    <div class="text-caption">
                                      {{ t('Optional') }}
                                    </div>

                                    <v-row>
                                      <v-col cols="6">
                                        <v-select
                                          v-model="exercise.exercise"
                                          :items="exerciseFilter('arms')"
                                          :label="t('Arms')"
                                          item-title="name"
                                          item-value="id"
                                          single-line
                                        >
                                          <template #selection="data">
                                            <span
                                              class="text-truncate"
                                              v-if="data.item.raw.type"
                                              v-text="data.item.title"
                                            ></span>
                                          </template>
                                          <template #append>
                                            <v-row
                                              align="center"
                                              justify="center"
                                            >
                                              <v-col cols="12">
                                                {{ t('or') }}
                                              </v-col>
                                            </v-row>
                                          </template>
                                        </v-select>
                                      </v-col>

                                      <v-col cols="6">
                                        <v-select
                                          v-model="exercise.exercise"
                                          :items="exerciseFilter('legs')"
                                          :label="t('Legs')"
                                          item-title="name"
                                          item-value="id"
                                        >
                                          <template #selection="data">
                                            <span
                                              class="text-truncate"
                                              v-if="data.item.raw.type"
                                              v-text="data.item.title"
                                            ></span>
                                          </template>
                                          <template #append>
                                            <v-tooltip
                                              v-if="exercise.exercise === 0"
                                              location="bottom"
                                            >
                                              <template #activator="{ props }">
                                                <v-icon v-bind="props">
                                                  $helpCircleOutline
                                                </v-icon>
                                              </template>
                                              <span>{{
                                                t(
                                                  'Select an optional arm or leg exercise to perform'
                                                )
                                              }}</span>
                                            </v-tooltip>
                                            <div v-else>
                                              <v-icon
                                                @click="
                                                  ;(exercise.exercise = 0),
                                                    (exercise.pullups = 1)
                                                "
                                              >
                                                $undo
                                              </v-icon>
                                            </div>
                                          </template>
                                        </v-select>
                                      </v-col>
                                    </v-row>

                                    <div v-if="exercise.exercise !== 0">
                                      <exercise-counter
                                        :title="`${
                                          exercises[exercise.exercise - 1].name
                                        }s`"
                                        :value="exercise.pullups"
                                        :disabled="exercise.exercise === 0"
                                        :max="30"
                                        :timer="false"
                                        @input="
                                          (value) => (exercise.pullups = value)
                                        "
                                      >
                                      </exercise-counter>
                                    </div>
                                  </v-expansion-panel-text>
                                </v-expansion-panel>
                                <v-expansion-panel>
                                  <v-expansion-panel-title>
                                    <v-icon icon="$numeric2BoxOutline"></v-icon>
                                    <span
                                      :class="{
                                        'text--secondary':
                                          exercise?.repeat === 0
                                      }"
                                      class="ml-2"
                                    >
                                      {{ t('Timers') }}
                                    </span>
                                  </v-expansion-panel-title>
                                  <v-expansion-panel-text>
                                    <exercise-counter
                                      v-if="exerciseIndex !== 0"
                                      title="Rest"
                                      subtitle="Before hang"
                                      :value="exercise.pause"
                                      :min="3"
                                      :max="300"
                                      @input="
                                        (value) => exerciseEdit('pause', value)
                                      "
                                    >
                                    </exercise-counter>

                                    <exercise-counter
                                      title="Hang"
                                      :value="exercise.hold"
                                      :min="3"
                                      :max="180"
                                      @input="
                                        (value) => exerciseEdit('hold', value)
                                      "
                                    >
                                    </exercise-counter>

                                    <exercise-counter
                                      title="Repeat"
                                      subtitle="1x = No repeat"
                                      :value="exercise.repeat"
                                      :timer="false"
                                      :min="0"
                                      :max="24"
                                      @input="
                                        (value) => exerciseEdit('repeat', value)
                                      "
                                    >
                                      <template #default
                                        >{{ exercise.repeat + 1 }}x</template
                                      >
                                    </exercise-counter>

                                    <exercise-counter
                                      v-if="exercise.repeat > 0"
                                      title="Rest"
                                      subtitle="After repeats"
                                      :value="exercise.rest"
                                      :min="3"
                                      :max="180"
                                      :disabled="exercise.repeat === 0"
                                      @input="
                                        (value) => exerciseEdit('rest', value)
                                      "
                                    >
                                    </exercise-counter>
                                  </v-expansion-panel-text>
                                </v-expansion-panel>
                                <v-expansion-panel>
                                  <v-expansion-panel-title>
                                    <v-icon icon="$numeric3BoxOutline"></v-icon>
                                    <span
                                      :class="{
                                        'text--secondary':
                                          (exercise?.leftHand &&
                                            exercise?.rightHand &&
                                            !exercise?.leftHand.length &&
                                            !exercise?.rightHand.length) ||
                                          (!exercise?.leftHand &&
                                            !exercise?.rightHand)
                                      }"
                                      class="ml-2"
                                      >{{ t('Fingers') }}</span
                                    >
                                  </v-expansion-panel-title>
                                  <v-expansion-panel-text>
                                    <exercise-hand
                                      :exercise="exercise"
                                      @left="
                                        (finger) => (exercise.leftHand = finger)
                                      "
                                      @right="
                                        (finger) =>
                                          (exercise.rightHand = finger)
                                      "
                                      edit
                                    ></exercise-hand>
                                  </v-expansion-panel-text>
                                </v-expansion-panel>
                                <v-expansion-panel>
                                  <v-expansion-panel-title>
                                    <v-icon icon="$numeric4BoxOutline"></v-icon>
                                    <span
                                      :class="{
                                        'text--secondary':
                                          exercise?.weight === 0 ||
                                          !exercise?.weight
                                      }"
                                      class="ml-2"
                                    >
                                      {{ t('Weight') }}</span
                                    >
                                  </v-expansion-panel-title>
                                  <v-expansion-panel-text>
                                    <div class="text-caption mb-4">
                                      {{ weightLabel }}
                                    </div>

                                    <exercise-counter
                                      title="Weight"
                                      :value="exercise.weight"
                                      :min="-50"
                                      :max="50"
                                      @input="
                                        (value) => (exercise.weight = value)
                                      "
                                      :timer="false"
                                      suffix="kg"
                                    >
                                      <template #default
                                        >{{
                                          weightConverter(
                                            exercise.weight,
                                            user
                                          )
                                        }}kg</template
                                      >
                                    </exercise-counter>
                                  </v-expansion-panel-text>
                                </v-expansion-panel>
                                <v-expansion-panel>
                                  <v-expansion-panel-title>
                                    <v-icon icon="$numeric5BoxOutline"></v-icon>
                                    <span
                                      :class="{
                                        'text--secondary':
                                          exercise?.notes === '' ||
                                          !exercise?.notes
                                      }"
                                      class="ml-2"
                                      >{{ t('Notes') }}</span
                                    >
                                  </v-expansion-panel-title>
                                  <v-expansion-panel-text>
                                    <v-textarea
                                      v-model="exercise.notes"
                                      :rules="[rules.length(140)]"
                                      auto-grow
                                      counter="140"
                                      filled
                                      row-height="24"
                                      rows="2"
                                    ></v-textarea>
                                  </v-expansion-panel-text>
                                </v-expansion-panel>
                              </v-expansion-panels>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card>
                    </v-dialog>

                    <!-- save -->
                    <v-dialog
                      v-model="workoutSaveDialog"
                      :scrim="false"
                      fullscreen
                      transition="dialog-bottom-transition"
                    >
                      <v-card>
                        <v-toolbar>
                          <v-btn
                            icon="$close"
                            color="text"
                            @click="workoutSaveDialog = false"
                          ></v-btn>
                          <v-toolbar-title>
                            {{ t("You're almost there") }}!
                          </v-toolbar-title>

                          <v-toolbar-items>
                            <v-btn
                              icon="$contentSaveOutline"
                              :disabled="
                                workout.name === '' ||
                                typeof workout.name === 'undefined' ||
                                workout.description === '' ||
                                typeof workout.description === 'undefined' ||
                                typeof workout.level === 'undefined'
                              "
                              @click="workoutSave"
                            ></v-btn>
                          </v-toolbar-items>
                        </v-toolbar>
                        <v-container>
                          <v-row>
                            <v-col cols="12">
                              <v-label
                                >{{
                                  t('Name your workout and get going')
                                }}.</v-label
                              >

                              <v-divider thickness="0" class="mb-4"></v-divider>

                              <v-text-field
                                v-model="workout.name"
                                :placeholder="t('New workout')"
                                counter="36"
                                :rules="[rules.required, rules.length(36)]"
                                :label="t('Name')"
                                required
                                class="required"
                              >
                              </v-text-field>

                              <v-textarea
                                v-model="workout.description"
                                counter="140"
                                rows="3"
                                :rules="[rules.required, rules.length(140)]"
                                :placeholder="
                                  t(
                                    'For example indicate when this workout is most beneficial'
                                  )
                                "
                                :label="t('Description')"
                                required
                                class="required"
                              ></v-textarea>

                              <v-text-field
                                v-model="workout.video"
                                placeholder="https://www.youtube.com/watch?v=xxxxxxxx"
                                :label="t('Video')"
                              >
                              </v-text-field>

                              <v-label>{{ t('Difficulty') }}</v-label>
                              <v-chip-group
                                v-model="workout.level"
                                class="required"
                              >
                                <v-chip :value="1">{{ t('easy') }}</v-chip>
                                <v-chip :value="2">{{ t('normal') }}</v-chip>
                                <v-chip :value="3">{{ t('hard') }}</v-chip>
                              </v-chip-group>

                              <v-checkbox
                                v-model="workout.share"
                                hide-details="auto"
                                :label="t('Share with the community')"
                              ></v-checkbox>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card>
                    </v-dialog>
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

              <!-- has hangboard -->
              <v-dialog
                v-model="hasHangboardDialog"
                :scrim="false"
                fullscreen
                transition="dialog-bottom-transition"
              >
                <v-card>
                  <v-toolbar>
                    <v-btn icon="$close" color="text" to="/workouts"></v-btn>
                    <v-toolbar-title>
                      {{ t('You are not using this hangboard') }}!
                    </v-toolbar-title>

                    <v-toolbar-items>
                      <v-btn
                        icon="$contentSaveOutline"
                        @click="addHangboard"
                      ></v-btn>
                    </v-toolbar-items>
                  </v-toolbar>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        {{
                          t(
                            "To view this workout we'll add this hangboard to your hangboards"
                          )
                        }}
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-dialog>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-container>
</template>

<style lang="scss" scoped>
@use 'vuetify/settings';

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

.exercise-card:last-child:deep(.v-card):last-child:after {
  border: none;
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
.required :deep(label::after) {
  content: '*';
  margin-left: settings.$spacer;
  color: rgb(var(--v-theme-error));
}
</style>
