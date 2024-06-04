<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import WorkoutSummary from '@/components/molecules/WorkoutSummary/WorkoutSummary.vue'
import WorkoutSave from '@/components/molecules/dialog/WorkoutSave/WorkoutSave.vue'
import MissingHangboard from '@/components/molecules/dialog/MissingHangboard/MissingHangboard.vue'
import ExerciseList from '@/components/organisms/ExerciseList/ExerciseList.vue'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'

import { useApp } from '@/stores/app'
import { useWorkouts } from '@/stores/workouts'
import { useAuthentication } from '@/stores/authentication'
import { useUser } from '@/stores/user'
import WorkoutSubscribe from '@/components/atoms/WorkoutSubscribe/WorkoutSubscribe.vue'
import WorkoutShare from '@/components/atoms/WorkoutShare/WorkoutShare.vue'
import { Exercise } from '@/interfaces/workouts.interface'

const { t } = useI18n()

const { networkOnLine } = storeToRefs(useApp())

// router
const route = useRoute()
const router = useRouter()

// workout
const { fetchCommunityWorkouts, getWorkoutById, removeUserWorkoutById } = useWorkouts()

const { getUserHangboards, getUserHangboardCompany, getUserHangboard } = storeToRefs(useUser())

const { user } = storeToRefs(useAuthentication())

const { updateUser } = useAuthentication()

const workout = computed(() => getWorkoutById(route.params.id ? route.params.id : 'new'))

// workout - edit
const edit = ref(false)

// workout - save
const workoutSaveDialog = ref(false)

const exerciseAdd = () => {
  // create in function
  const exerciseNew: Exercise = {
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
    edit.value = true
  }
})

// workout - remove
const removeWorkout = () => {
  removeUserWorkoutById(route.params.id.toString())
  router.push('/workouts')
}

const missingHangboardDialog = computed(() => {
  if (!route.params.company || !route.params.hangboard) {
    return false
  }
  const company = parseInt(route.params.company.toString(), 10)
  const hangboard = parseInt(route.params.hangboard.toString(), 10)
  // if hangboard exists but is not selected, switch hangboard
  if (
    getUserHangboardCompany.value &&
    company !== getUserHangboardCompany.value.id &&
    getUserHangboard.value &&
    hangboard !== getUserHangboard.value.id
  ) {
    const index = getUserHangboards.value?.findIndex(
      (list) => list.company === company && list.hangboard === hangboard
    )
    if (user.value) {
      // Ensure that index is defined before setting user settings
      if (index !== undefined) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        user.value.settings.selected = index
        updateUser()
        fetchCommunityWorkouts()
      }
    }
  }
  // do nothing
  return false
})

const startWorkoutButton = ref(false)

const onScroll = () => {
  startWorkoutButton.value = window.scrollY > 250
}

useHead({
  title: () => workout.value?.name ?? '',
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
      <workout-subscribe size="x-large" :workout="workout" />
      <workout-share :workout="workout" />
      <v-btn
        v-if="workout?.user?.id === user?.id && !edit"
        :disabled="!networkOnLine"
        color="text"
        icon="$pencil"
        @click="edit = true"
      ></v-btn>
      <v-btn
        v-if="edit"
        color="text"
        icon="$contentSaveOutline"
        @click="workoutSaveDialog = true"
      ></v-btn>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-if="edit" color="text" icon="$dotsVertical" v-bind="props"></v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title @click="workoutSaveDialog = true"
              >{{ t('Rename workout') }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title @click="removeWorkout">{{ t('Delete workout') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>

    <template #default>
      <v-container>
        <v-row v-if="workout">
          <v-col cols="12" md="5" order-md="last">
            <div class="sticky">
              <workout-summary :edit="edit" :workout="workout" @save="workoutSaveDialog = true" />
            </div>
          </v-col>

          <v-col cols="12" md="7" order-md="first">
            <div class="workout">
              <exercise-list :edit="edit" :workout="workout" @add="exerciseAdd" />

              <!-- save dialog -->
              <workout-save
                v-model="workoutSaveDialog"
                :workout="workout"
                @show="workoutSaveDialog = !workoutSaveDialog"
              />
            </div>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12">
            {{ t('No workouts found') }}

            <missing-hangboard
              v-model="missingHangboardDialog"
              @show="missingHangboardDialog = !missingHangboardDialog"
            />
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template #fab>
      <div v-show="!edit" v-scroll="onScroll" class="hidden-md-and-up">
        <v-fab-transition>
          <v-fab
            v-if="getUserHangboard && getUserHangboardCompany && workout"
            :active="startWorkoutButton"
            :to="`/workouts/${getUserHangboard.id}/${getUserHangboardCompany.id}/${workout.id}/timer`"
            location="end"
            position="fixed"
            size="x-large"
            extended
            app
            :text="t('Start workout')"
            style="bottom: 56px"
          ></v-fab>
        </v-fab-transition>
      </div>
    </template>
  </app-container>
</template>

<style lang="scss" scoped>
.sticky {
  @media (min-width: 960px) {
    position: sticky;
    top: 68px;
  }
}

.v-toolbar .v-btn--size-x-large {
  min-width: 64px;
  padding: 0 12px;
}
</style>

<style lang="scss">
.v-fab__container {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  align-self: initial !important;
  justify-content: flex-end;
}
</style>
