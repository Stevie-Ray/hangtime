<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user.store'
import { useWorkoutsStore } from '@/stores/workouts.store'
import { useAuthenticationStore } from '@/stores/authentication.store'
import { useAppStore } from '@/stores/app.store'
import ExerciseHangboard from '@/components/atoms/ExerciseHangboard/ExerciseHangboard.vue'
import WorkoutSubscribe from '@/components/atoms/WorkoutSubscribe/WorkoutSubscribe.vue'
import WorkoutCommunityFilter from '@/components/molecules/dialog/WorkoutCommunityFilter/WorkoutCommunityFilter.vue'
import WalkthroughApp from '@/components/molecules/dialog/WalkthroughApp/WalkthroughApp.vue'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import imgLogo from '@/assets/logo.svg'

import { time } from '@/helpers'

const { getUserHangboardCompany, getUserHangboard, getUserHangboards } = storeToRefs(useUserStore())
const {
  workoutsCommunity,
  getWorkoutsBySelectedHangboard,
  reachedLastUserWorkouts,
  reachedLastCommunityWorkouts
} = storeToRefs(useWorkoutsStore())
const { getHangboardNameByIds } = useUserStore()
const { t } = useI18n()
const { user } = storeToRefs(useAuthenticationStore())
const { updateUser } = useAuthenticationStore()
const { online } = storeToRefs(useAppStore())
const { fetchCommunityWorkouts, fetchSubscribedWorkouts, resetCommunityWorkouts } =
  useWorkoutsStore()

const route = useRoute()
const router = useRouter()

const showEmptySlot = ref(true)

const isWorkoutsRoute = computed(() => {
  return route.path === '/workouts'
})

const isWorkoutsCommunityRoute = computed(() => {
  return route.path === '/workouts/community'
})

const workoutsList = computed(() => {
  if (isWorkoutsRoute.value) {
    return getWorkoutsBySelectedHangboard.value
  } else if (isWorkoutsCommunityRoute.value) {
    return workoutsCommunity.value
  }
  return []
})

const fetchMoreWorkouts = async ({
  done
}: {
  done: (status: 'ok' | 'empty' | 'loading' | 'error') => void
}) => {
  try {
    if (isWorkoutsRoute.value) {
      await fetchSubscribedWorkouts()
    } else if (isWorkoutsCommunityRoute.value) {
      await fetchCommunityWorkouts()
    }
  } catch (error) {
    // Something went wrong when adding content
    done('error')
    if (error instanceof Error) {
      console.error('Error fetching workouts:', error.message)
    }
  } finally {
    // There is no more content to fetch
    if (
      (isWorkoutsRoute.value && reachedLastUserWorkouts.value) ||
      (isWorkoutsCommunityRoute.value && reachedLastCommunityWorkouts.value)
    ) {
      done('empty')
      setTimeout(() => {
        showEmptySlot.value = false
      }, 2000)
    } else {
      // Content was added succesfully
      done('ok')
    }
  }
}

const hangboardMenu = ref(false)

const setHangboard = async () => {
  updateUser()
  workoutsCommunity.value = []
  resetCommunityWorkouts()
  await fetchCommunityWorkouts()
}

const levels = computed(() => [
  { name: t('easy'), value: 1 },
  { name: t('normal'), value: 2 },
  { name: t('hard'), value: 3 }
])

const difficultyById = (id: 1 | 2 | 3): string | undefined => {
  const level = levels.value.find((level) => level.value === id)
  return level ? level.name : undefined
}

useHead({
  title: 'Workouts',
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container>
    <template #default>
      <div class="position-sticky bg-surface top-0 pa-3 mt-2 d-md-none" style="z-index: 1">
        Sticky content
      </div>

      <v-row>
        <v-col>
          <v-menu v-model="hangboardMenu">
            <template v-slot:activator="{ props }">
              <div v-bind="props" class="hangboard-select" :title="t('Select your hangboard')">
                <span v-if="getUserHangboardCompany && getUserHangboard">
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
                  v-if="getUserHangboard && getUserHangboardCompany"
                  :hangboard="{
                    hangboard: getUserHangboard.id,
                    company: getUserHangboardCompany.id
                  }"
                />
                <v-divider class="my-4" />

                <v-radio-group
                  v-if="user && getUserHangboards?.length > 0"
                  v-model="user.settings.selected"
                  :disabled="!online"
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
        </v-col>
        <v-col>
          <v-btn
            v-if="isWorkoutsRoute"
            icon="$timerPlayOutline"
            color="text"
            :title="t('Quick workout')"
            to="/workouts/quick"
          />
          <v-btn
            v-if="isWorkoutsRoute"
            :disabled="!online"
            icon="$plus"
            color="text"
            :title="t('Add a workout')"
            to="/workouts/new"
          />
          <workout-community-filter v-if="isWorkoutsCommunityRoute" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
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
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-alert icon="$forumOutline" variant="tonal" type="info">
            We are on Discord!
            <template #append>
              <v-btn color="info" href="https://discord.gg/f7QQnEBQQt" target="_blank">Join </v-btn>
            </template>
          </v-alert>
          <v-list lines="two" v-if="workoutsList.length">
            <v-infinite-scroll :onLoad="fetchMoreWorkouts" side="end" :key="route.path">
              <template v-for="(workout, index) in workoutsList" :key="workout.id">
                <v-list-item
                  v-if="getUserHangboard && getUserHangboardCompany && workout"
                  :class="`v-list-item-${index}`"
                  :to="`/workouts/${getUserHangboard.id}/${getUserHangboardCompany.id}/${workout.id}`"
                >
                  <template #prepend>
                    <v-avatar v-if="workout.user" color="grey-darken-1">
                      <v-img
                        :src="workout.user.photoURL"
                        :alt="workout.user.displayName"
                        :title="workout.user.id"
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
                        <workout-subscribe
                          :model-value="workout"
                          size="x-small"
                          :clickable="false"
                        />
                      </div>
                    </v-list-item-action>
                  </template>
                </v-list-item>
                <v-divider inset v-if="index !== workoutsList.length - 1"></v-divider>
              </template>
              <template v-slot:empty>
                <div v-show="showEmptySlot">{{ t('No more workouts found') }}</div>
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
          />
        </v-col>
      </v-row>

      <walkthrough-app v-if="!user?.settings?.walkthrough" ref="walkthrough" />
    </template>

    <template #sidebar>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title> Probeer Premium gratis </v-card-title>
            <v-card-text>
              Geen advertenties, persoonlijke oefeningen en onbeperkt Legendarisch!
            </v-card-text>
            <v-card-actions>
              <v-btn color="secondary" variant="elevated"> Probeer 30 minuten gratis </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card class="mx-auto">
            <template #prepend>
              <v-icon>mdi-trophy</v-icon>
            </template>

            <template #title>
              <span>Je staat op plek #1</span>
            </template>

            <v-card-text> Je hebt deze week tot nu toe 336 punten verdiend </v-card-text>
            <v-card-actions>
              <v-btn color="primary" to="/leaderboard"> Ranglijst bekijken </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-title> Weekelijkse missies </v-card-title>
            <v-card-text>
              <div class="text-h6">Doe 3 workouts</div>
              <v-progress-linear color="primary" height="24" :model-value="(2 / 3) * 100">
                <template #default="{ value }">
                  <strong>{{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>

              <div class="my-2" />
              <div class="text-h6">Train 30 minuten</div>
              <v-progress-linear color="primary" height="24" :model-value="(24 / 30) * 100">
                <template #default="{ value }">
                  <strong>{{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>

              <div class="my-2" />
              <div class="text-h6">Doe 50 pullups</div>
              <v-progress-linear color="primary" height="24" :model-value="(16 / 50) * 100">
                <template #default="{ value }">
                  <strong>{{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" to="/quests"> Bekijk alle </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12"> Voorwaarden </v-col>
      </v-row>
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
.v-infinite-scroll {
  overflow-y: hidden;
}
.v-list {
  padding: 0;
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
