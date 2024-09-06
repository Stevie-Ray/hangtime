<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useWorkoutsStore } from '@/stores/workouts'
import { useAuthenticationStore } from '@/stores/authentication'
import { useAppStore } from '@/stores/app'
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
const { fetchCommunityWorkouts, fetchUserWorkouts, resetCommunityWorkouts } = useWorkoutsStore()

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
      await fetchUserWorkouts()
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
      // BUG: done('empty')
      done('ok')
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
  <app-container extension>
    <template #title>
      <v-menu v-model="hangboardMenu">
        <template v-slot:activator="{ props }">
          <div v-bind="props" class="hangboard-select">
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
    </template>

    <template #icons>
      <v-btn v-if="isWorkoutsRoute" icon="$timerPlayOutline" color="text" to="/workouts/quick" />
      <v-btn
        v-if="isWorkoutsRoute"
        :disabled="!online"
        icon="$plus"
        color="text"
        to="/workouts/new"
      />
      <workout-community-filter v-if="isWorkoutsCommunityRoute" />
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
            <v-list lines="two" v-if="workoutsList.length">
              <v-infinite-scroll :onLoad="fetchMoreWorkouts" side="end">
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
                  <div v-if="showEmptySlot">{{ t('No workouts found') }}</div>
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
      </v-container>

      <walkthrough-app v-if="!user?.settings?.walkthrough" ref="walkthrough" />
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
  &:deep(.v-infinite-scroll-intersect) {
    height: auto;
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
