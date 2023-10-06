<script setup>
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import AppContainer from '@/components/organisms/AppContainer/AppContainer'
import WorkoutCommunityFilter from '@/components/molecules/dialog/WorkoutCommunityFilter/WorkoutCommunityFilter'
import Walkthrough from '@/components/molecules/dialog/Walkthrough/Walkthrough'
import { useUser } from '@/stores/user'
import { useWorkouts } from '@/stores/workouts'

import { time } from '@/helpers'
import { useAuthentication } from '@/stores/authentication'

import ExerciseHangboard from '@/components/atoms/ExerciseHangboard/ExerciseHangboard'
import { useApp } from '@/stores/app'

const { getUserHangboardCompany, getUserHangboard, getUserHangboards } =
  storeToRefs(useUser())

const { getHangboardNameByIds } = useUser()

const { t } = useI18n()

const { user } = storeToRefs(useAuthentication())

const { updateUser } = useAuthentication()

const { networkOnLine } = storeToRefs(useApp())

const { fetchCommunityWorkouts } = useWorkouts()

const workouts = useWorkouts()

const route = useRoute()

const workoutsList = computed(() =>
  route.path === '/workouts'
    ? workouts.getWorkoutsBySelectedHangboard
    : workouts.getWorkoutsByCommunity
)

const hangboardMenu = ref(false)

const setHangboard = () => {
  updateUser()
  fetchCommunityWorkouts()
}

const isHearted = (subscribers) => {
  if (!subscribers?.length || user.value);
  subscribers.some((subscriber) => subscriber === user.value.id)
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
              ><v-icon>mdi-chevron-up</v-icon></span
            >
            <span v-if="!hangboardMenu && getUserHangboards?.length > 1"
              ><v-icon>mdi-chevron-down</v-icon></span
            >
          </div>
        </template>

        <v-card v-if="getUserHangboards?.length > 1">
          <v-card-text>
            <exercise-hangboard
              :hangboard="{
                hangboard: getUserHangboard.id,
                company: getUserHangboardCompany.id
              }"
            ></exercise-hangboard>

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
                :label="
                  getHangboardNameByIds(hangboard.company, hangboard.hangboard)
                "
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
              <v-icon class="mr-1">mdi-keyboard-outline</v-icon>
              <span>{{ t('Hangboards') }}</span>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-menu>
    </template>

    <template #icons>
      <v-btn
        v-if="route.path === '/workouts'"
        icon="mdi-timer-play-outline"
        color="text"
        to="/workouts/quick"
      ></v-btn>
      <v-btn
        v-if="route.path === '/workouts'"
        :disabled="!networkOnLine"
        icon="mdi-plus"
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
          <v-icon class="mr-1">mdi-account</v-icon>
          <span>{{ t('Your Workouts') }}</span>
        </v-tab>
        <v-tab to="/workouts/community" color="text">
          <v-icon class="mr-1">mdi-account-group</v-icon>
          <span>{{ t('Community') }}</span>
        </v-tab>
      </v-tabs>
    </template>

    <template #default>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-list v-if="workoutsList.length">
              <template
                v-for="(workout, index) in workoutsList"
                :key="workout.id"
              >
                <v-list-item :to="`/workouts/${workout.id}`">
                  <template #prepend>
                    <v-avatar color="grey-darken-1">
                      <v-img
                        :src="workout.user.photoURL"
                        :alt="workout.user.displayName"
                      ></v-img>
                    </v-avatar>
                  </template>

                  <v-list-item-title>
                    <span>{{ workout.name }}</span>
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    <span>{{ time(workout.time) }} - </span>
                    <span v-if="workout.video"
                      ><v-icon>mdi-video</v-icon> -
                    </span>
                    <span>{{ workout.description }}</span>
                  </v-list-item-subtitle>

                  <template #append>
                    <v-list-item-action end class="flex-column">
                      <v-chip size="x-small" color="text" variant="outlined">{{
                        difficultyById(workout.level)
                      }}</v-chip>
                      <div class="subscribers">
                        <v-btn
                          variant="text"
                          color="text"
                          size="x-small"
                          :append-icon="
                            isHearted(workout.subscribers)
                              ? 'mdi-heart'
                              : 'mdi-heart-outline'
                          "
                        >
                          {{ workout?.subscribers?.length - 1 }}
                        </v-btn>
                      </div>
                    </v-list-item-action>
                  </template>
                </v-list-item>
                <v-divider
                  inset
                  v-if="index !== workoutsList.length - 1"
                ></v-divider>
              </template>
            </v-list>
            <v-list v-else>
              <v-list-item v-if="workoutsList?.length === 0" to="/workouts/new">
                <v-list-item-title>
                  {{ t('No workouts found') }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ t('Check the community or create your own') }}
                </v-list-item-subtitle>
                <template #append>
                  <v-btn variant="text" color="text" icon="mdi-plus"></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>

      <walkthrough
        v-if="!user?.settings?.walkthrough"
        ref="walkthrough"
      ></walkthrough>
    </template>
  </app-container>
</template>

<style lang="scss" scoped>
.hangboard-select {
  cursor: pointer;
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
