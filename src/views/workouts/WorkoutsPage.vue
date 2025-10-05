<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useWorkoutsStore } from '@/stores/workouts.store'
import { useAuthenticationStore } from '@/stores/authentication.store'
import { useAppStore } from '@/stores/app.store'
import WorkoutSubscribe from '@/components/atoms/WorkoutSubscribe/WorkoutSubscribe.vue'
import WorkoutCommunityFilter from '@/components/molecules/dialog/WorkoutCommunityFilter/WorkoutCommunityFilter.vue'
import WalkthroughApp from '@/components/molecules/dialog/WalkthroughApp/WalkthroughApp.vue'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import SidebarStatistics from '@/components/molecules/SidebarStatistics/SidebarStatistics.vue'
import SidebarPremium from '@/components/molecules/SidebarPremium/SidebarPremium.vue'
import SidebarQuests from '@/components/molecules/SidebarQuests/SidebarQuests.vue'
import SidebarLeaderboard from '@/components/molecules/SidebarLeaderboard/SidebarLeaderboard.vue'
import SidebarLinks from '@/components/molecules/SidebarLinks/SidebarLinks.vue'
import SelectHangboard from '@/components/molecules/SelectHangboard/SelectHangboard.vue'
import imgLogo from '@/assets/logo.svg'

import { time } from '@/helpers'

const {
  workoutsCommunity,
  getWorkoutsBySelectedHangboard,
  reachedLastUserWorkouts,
  reachedLastCommunityWorkouts
} = storeToRefs(useWorkoutsStore())
const { t } = useI18n()
const { user } = storeToRefs(useAuthenticationStore())
const { online } = storeToRefs(useAppStore())
const { fetchCommunityWorkouts, fetchSubscribedWorkouts } = useWorkoutsStore()

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
    <template #sticky>
      <sidebar-statistics />
    </template>

    <template #default>
      <v-row>
        <!-- Hangboard -->
        <v-col cols="auto" class="flex-grow-1 w-0">
          <select-hangboard />
        </v-col>
        <v-col cols="auto" class="flex-shrink-0">
          <div class="d-flex ga-6">
            <v-btn
              v-if="isWorkoutsRoute"
              prepend-icon="$timerPlayOutline"
              color="surface"
              :title="t('Quick workout')"
              to="/workouts/quick"
            >
              <span class="d-none d-md-block">{{ t('Quick session') }}</span>
            </v-btn>
            <v-btn
              v-if="isWorkoutsRoute"
              :disabled="!online"
              prepend-icon="$plus"
              color="surface"
              :title="t('Add a workout')"
              to="/workouts/new"
              class="d-none d-md-flex"
            >
              {{ t('Workout') }}
            </v-btn>
            <workout-community-filter v-if="isWorkoutsCommunityRoute" />
          </div>
        </v-col>
        <!-- Tabs -->
        <v-col cols="12">
          <v-tabs grow bg-color="surface">
            <v-tab to="/workouts" color="text">
              <v-icon class="mr-1">$account</v-icon>
              <span>{{ t('My Workouts') }}</span>
            </v-tab>
            <v-tab to="/workouts/community" color="text">
              <v-icon class="mr-1">$accountGroup</v-icon>
              <span>{{ t('Community') }}</span>
            </v-tab>
          </v-tabs>

          <div class="position-relative" v-if="workoutsList.length">
            <v-list lines="two">
              <v-infinite-scroll :onLoad="fetchMoreWorkouts" side="end" :key="route.path">
                <template v-for="(workout, index) in workoutsList" :key="workout.id">
                  <v-list-item
                    v-if="workout"
                    :class="`v-list-item-${index}`"
                    :to="`/workouts/${workout.hangboard}/${workout.company}/${workout.id}`"
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
            <v-fab
              app
              to="/workouts/new"
              class="d-md-none"
              icon="$plus"
              size="large"
              style="bottom: 4rem"
              :title="t('Add a workout')"
            />
          </div>

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
          <sidebar-statistics />
        </v-col>
        <v-col cols="12">
          <sidebar-premium />
        </v-col>
        <v-col cols="12">
          <sidebar-leaderboard />
        </v-col>
        <v-col cols="12">
          <sidebar-quests />
        </v-col>
        <v-col cols="12">
          <sidebar-links />
        </v-col>
      </v-row>
    </template>
  </app-container>
</template>

<style lang="scss" scoped>
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
