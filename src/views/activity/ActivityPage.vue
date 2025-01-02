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

import { useActivitiesStore } from '@/stores/activities'
import { useAuthenticationStore } from '@/stores/authentication'

import { IActivity } from '@/interfaces/activity.interface'
import { Levels } from '@/enums/levels'

const { activities } = storeToRefs(useActivitiesStore())
const { user } = storeToRefs(useAuthenticationStore())

const { t } = useI18n()

const notifications = ref(false)

const levels = [
  { name: t('easy'), value: Levels.Easy },
  { name: t('normal'), value: Levels.Normal },
  { name: t('hard'), value: Levels.Hard }
]

const difficultyById = (id: number): string | undefined =>
  levels.find((level) => level.value === id)?.name

const activitiesByDay = computed(() => {
  return activities.value.reduce((days: Record<string, IActivity[]>, activity: IActivity) => {
    const dateString =
      activity.start_date_local?.toLocaleDateString(user?.value?.settings?.locale ?? 'en-US') || ''
    if (!days[dateString]) {
      days[dateString] = []
    }
    days[dateString].push(activity)
    return days
  }, {})
})

const activityDate = (date: string): string => {
  const timestamp = Date.parse(date)
  if (!isNaN(timestamp)) {
    return new Date(timestamp).toLocaleDateString('default')
  }
  return date
}

const activityUrl = (activity: IActivity): string => {
  if (activity.company && activity.hangboard && activity.workout) {
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
        :to="notifications ? '/activity/notifications' : undefined"
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
            <news-cards />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card v-for="(dates, date) in activitiesByDay" :key="date" class="mb-4 pb-2">
              <v-list lines="two">
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
