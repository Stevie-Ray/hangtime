<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import InlineSvg from 'vue-inline-svg'
import { time } from '@/helpers'
import imgLogo from '@/assets/logo.svg'

import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import NewsCards from '@/components/molecules/NewsCards/NewsCards.vue'

import { useActivities } from '@/stores/activities'

import { useAuthentication } from '@/stores/authentication'

const { activities } = storeToRefs(useActivities())

const { user } = storeToRefs(useAuthentication())

const { t } = useI18n()

const notifications = ref(false)

const levels = [
  { name: t('easy'), value: 1 },
  { name: t('normal'), value: 2 },
  { name: t('hard'), value: 3 }
]

const difficultyById = (id) => levels.find((level) => level.value === id).name

const activitiesByDay = computed(() =>
  activities.value.reduce((days, activity) => {
    // Get the date of the current card as a string in the format "YYYY-MM-DD"
    const dateString = activity.start_date_local?.toLocaleDateString(
      user?.value?.settings?.locale ? user.value.settings.locale : 'en-US'
    )
    // Check if we have already added a sub-array for the current date
    if (!days[dateString]) {
      // If not, create a new sub-array for the current date
      days[dateString] = []
    }
    // Add the current card to the sub-array for its date
    days[dateString].push(activity)
    // Return the modified days object
    return days
  }, {})
)

const activityDate = (date) => {
  const timestamp = Date.parse(date)
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(timestamp) === false) {
    return new Date(timestamp).toLocaleDateString('default')
  }
  return date
}
const activityUrl = (activity) => {
  if (
    activity.company !== null &&
    activity.company !== '' &&
    activity.hangboard !== null &&
    activity.hangboard !== '' &&
    activity.workout !== null &&
    activity.workout !== ''
  ) {
    return `/workouts/${activity.company}/${activity.hangboard}/${activity.workout}`
  }
  return ''
}
useHead({
  title: 'Activity',
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container extension>
    <template #title>
      <div class="d-flex align-center">
        <div>
          <div
            class="v-responsive v-img"
            aria-label="logo"
            role="img"
            style="height: 28px; width: 28px"
          >
            <div class="v-responsive__sizer" style="padding-bottom: 100%"></div>
            <inline-svg class="v-img__img v-img__img--contain" :src="imgLogo" alt="logo" />
          </div>
        </div>
        <div>HangTime</div>
      </div>
    </template>

    <template #icons>
      <v-btn
        class="text-none"
        color="text"
        :disabled="!notifications"
        icon
        :to="notifications ? '/activity/notifications' : null"
      >
        <v-badge dot color="secondary">
          <v-icon>$bellOutline</v-icon>
        </v-badge>
      </v-btn>
    </template>

    <template #extension>
      <v-tabs grow>
        <v-tab to="/activity" color="text">
          <v-icon class="mr-1">$clipboardTextClock</v-icon>
          <span>{{ t('History') }}</span>
        </v-tab>
        <v-tab to="/activity/leaderboard" color="text">
          <v-icon class="mr-1">$podiumGold</v-icon>
          <span>{{ t('Leaderboard') }}</span>
        </v-tab>
      </v-tabs>
    </template>

    <template #default>
      <v-container>
        <v-row>
          <v-col cols="12">
            <news-cards></news-cards>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card v-for="(dates, date) in activitiesByDay" :key="date" class="mb-4 pb-2">
              <v-list>
                <v-list-subheader>{{ activityDate(date) }}</v-list-subheader>
                <template v-for="(activity, j) in dates" :key="j">
                  <v-list-item :to="activityUrl(activity)">
                    <template #prepend>
                      <v-avatar color="grey-darken-1"></v-avatar>
                    </template>

                    <template v-if="activity.type !== 'quick'" #append>
                      <div class="d-flex flex-column">
                        <v-chip v-if="activity.difficulty" size="x-small" variant="outlined">
                          {{ difficultyById(activity.difficulty) }}
                        </v-chip>
                      </div>
                    </template>

                    <v-list-item-title>{{ activity.name }}</v-list-item-title>

                    <v-list-item-subtitle
                      >{{ time(activity.elapsed_time) }} -
                      {{ activity.description }}</v-list-item-subtitle
                    >
                  </v-list-item>
                  <v-divider inset v-if="j !== dates.length - 1"></v-divider>
                </template>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-container>
</template>

<style lang="scss" scoped>
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