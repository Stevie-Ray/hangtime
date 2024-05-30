<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useUser } from '@/stores/user'
import { useWorkouts } from '@/stores/workouts'
import { useAuthentication } from '@/stores/authentication'
import { useApp } from '@/stores/app'
import ExerciseHangboard from '@/components/atoms/ExerciseHangboard/ExerciseHangboard.vue'
import WorkoutSubscribe from '@/components/atoms/WorkoutSubscribe/WorkoutSubscribe.vue'
import WorkoutCommunityFilter from '@/components/molecules/dialog/WorkoutCommunityFilter/WorkoutCommunityFilter.vue'
import Walkthrough from '@/components/molecules/dialog/Walkthrough/Walkthrough.vue'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import imgLogo from '@/assets/logo.svg'

import { time } from '@/helpers'

const { getUserHangboardCompany, getUserHangboard, getUserHangboards } = storeToRefs(useUser())
const { getHangboardNameByIds } = useUser()
const { t } = useI18n()
const { user } = storeToRefs(useAuthentication())
const { updateUser } = useAuthentication()
const { networkOnLine } = storeToRefs(useApp())
const { fetchCommunityWorkouts, fetchUserWorkouts } = useWorkouts()

const workouts = useWorkouts()
const route = useRoute()
const router = useRouter()

let shouldFetchUserWorkouts = true
let shouldFetchCommunityWorkouts = true

const showEmptySlot = ref(true)

const workoutsList = computed(() => {
  if (route.path === '/workouts') {
    return workouts.getWorkoutsBySelectedHangboard
  }
  return workouts.getWorkoutsByCommunity
})

const initialLength = workoutsList.value.length

const fetchMoreWorkouts = async ({ done }) => {
  if (route.path === '/workouts') {
    if (!shouldFetchUserWorkouts) {
      done('empty')
      // setTimeout(() => {
      //   showEmptySlot.value = false
      // }, 2000)
      return
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (!shouldFetchCommunityWorkouts) {
      done('empty')
      return
    }
  }

  try {
    if (route.path === '/workouts') {
      await fetchUserWorkouts()
    } else {
      await fetchCommunityWorkouts()
    }
  } catch (error) {
    // Something went wrong when adding content
    done('error')
    console.error('Error fetching workouts:', error.message)
  } finally {
    const updatedLength = workoutsList.value.length
    if (updatedLength === initialLength) {
      // There is no more content to fetch
      done('empty')
      if (route.path === '/workouts') {
        shouldFetchUserWorkouts = false
      } else {
        shouldFetchCommunityWorkouts = false
      }
      // setTimeout(() => {
      //   showEmptySlot.value = false
      // }, 2000)
    } else {
      // Content was added succesfully
      done('ok')
    }
  }
}

const hangboardMenu = ref(false)

const setHangboard = () => {
  updateUser()
  workouts.workoutsCommunity = []
  shouldFetchCommunityWorkouts = true
  fetchCommunityWorkouts()
}

const levels = [
  { name: t('easy'), value: 1 },
  { name: t('normal'), value: 2 },
  { name: t('hard'), value: 3 }
]

const difficultyById = (id) => levels.find((level) => level.value === id).name

useHead({
  title: 'Workouts',
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container extension>
    <template #title>
      <v-menu v-model="hangboardMenu">
        <template v-slot:activator="{ props }">
          <div v-bind="props" class="hangboard-select">
            <span v-if="getUserHangboardCompany">
              {{ `${getUserHangboardCompany.name} - ${getUserHangboard.name}` }}
            </span>
            <span v-if="hangboardMenu && getUserHangboards?.length > 1"
              ><v-icon>$chevronUp</v-icon></span
            >
            <span v-if="!hangboardMenu && getUserHangboards?.length > 1"
              ><v-icon>$chevronDown</v-icon></span
            >
          </div>
        </template>

        <v-card v-if="getUserHangboards?.length > 1" :max-width="600">
          <v-card-text>
            <exercise-hangboard
              :hangboard="{
                hangboard: getUserHangboard.id,
                company: getUserHangboardCompany.id
              }"
            />
            <v-divider class="my-4" />

            <v-radio-group
              v-if="getUserHangboards?.length > 0"
              v-model="user.settings.selected"
              :disabled="!networkOnLine"
              @update:modelValue="setHangboard"
              mandatory
            >
              <v-radio
                v-for="(hangboard, index) in getUserHangboards"
                :key="index"
                :label="getHangboardNameByIds(hangboard.company, hangboard.hangboard)"
                :value="index"
              ></v-radio>
            </v-radio-group>

            <v-btn
              variant="outlined"
              color="text"
              size="small"
              class="mr-2"
              to="/account/hangboards"
            >
              <v-icon class="mr-1">$keyboardOutline</v-icon>
              <span>{{ t('Hangboards') }}</span>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-menu>
    </template>

    <template #icons>
      <v-btn
        v-if="route.path === '/workouts'"
        icon="$timerPlayOutline"
        color="text"
        to="/workouts/quick"
      ></v-btn>
      <v-btn
        v-if="route.path === '/workouts'"
        :disabled="!networkOnLine"
        icon="$plus"
        color="text"
        to="/workouts/new"
      ></v-btn>
      <workout-community-filter
        v-if="route.path === '/workouts/community'"
      ></workout-community-filter>
    </template>

    <template #extension>
      <v-tabs grow>
        <v-tab to="/workouts" color="text">
          <v-icon class="mr-1">$account</v-icon>
          <span>{{ t('My Workouts') }}</span>
        </v-tab>
        <v-tab to="/workouts/community" color="text">
          <v-icon class="mr-1">$accountGroup</v-icon>
          <span>{{ t('Community') }}</span>
        </v-tab>
      </v-tabs>
    </template>

    <template #default>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-list v-if="workoutsList.length">
              <v-infinite-scroll :onLoad="fetchMoreWorkouts">
                <template v-for="(workout, index) in workoutsList" :key="workout.id">
                  <v-list-item
                    :class="`v-list-item-${index}`"
                    :to="`/workouts/${getUserHangboard.id}/${getUserHangboardCompany.id}/${workout.id}`"
                  >
                    <template #prepend>
                      <v-avatar v-if="workout.user" color="grey-darken-1">
                        <v-img
                          :src="workout.user.photoURL"
                          :alt="workout.user.displayName"
                          width="40"
                          height="40"
                        ></v-img>
                      </v-avatar>
                    </template>

                    <v-list-item-title>
                      <span>{{ workout.name }}</span>
                    </v-list-item-title>

                    <v-list-item-subtitle>
                      <span>{{ time(workout.time) }} - </span>
                      <span v-if="workout.video"><v-icon>$video</v-icon> - </span>
                      <span>{{ workout.description }}</span>
                    </v-list-item-subtitle>

                    <template #append>
                      <v-list-item-action end class="flex-column">
                        <v-chip size="x-small" color="text" variant="outlined">{{
                          difficultyById(workout.level)
                        }}</v-chip>
                        <div class="subscribers">
                          <workout-subscribe size="x-small" :workout="workout" :clickable="false" />
                        </div>
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                  <v-divider inset v-if="index !== workoutsList.length - 1"></v-divider>
                </template>
                <template v-slot:empty>
                  <div v-show="showEmptySlot">{{ t('No workouts found') }}</div>
                </template>
              </v-infinite-scroll>
            </v-list>
            <v-empty-state
              v-else
              to="/workouts/new"
              headline="No workouts found"
              title="Community-based hangboard app"
              text="Our workouts are community-driven and unique for each hangboard. Explore the 'Community' tab or create your own to share with fellow climbers."
              :image="imgLogo"
              action-text="Create a Workout"
              @click:action="router.push('/workouts/new')"
            >
            </v-empty-state>
          </v-col>
        </v-row>
      </v-container>

      <walkthrough v-if="!user?.settings?.walkthrough" ref="walkthrough"></walkthrough>
    </template>
  </app-container>
</template>

<style lang="scss" scoped>
.hangboard-select {
  cursor: pointer;
}
.v-theme--dark {
  .v-empty-state {
    &:deep(.v-empty-state__media) {
      filter: invert(100%);
    }
  }
}
.v-list-item {
  min-height: 64px;
  padding-top: 16px;
  padding-bottom: 16px;
  &:deep(.v-list-item__prepend) {
    align-self: center;
  }
  &:deep(.v-list-item-action) {
    align-items: end;
  }
}
</style>