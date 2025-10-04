<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { time } from '@/helpers'

import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import NewsCards from '@/components/molecules/NewsCards/NewsCards.vue'
import SidebarStatistics from '@/components/molecules/SidebarStatistics/SidebarStatistics.vue'
import SidebarPremium from '@/components/molecules/SidebarPremium/SidebarPremium.vue'
import SidebarQuests from '@/components/molecules/SidebarQuests/SidebarQuests.vue'
import SidebarLeaderboard from '@/components/molecules/SidebarLeaderboard/SidebarLeaderboard.vue'
import SidebarLinks from '@/components/molecules/SidebarLinks/SidebarLinks.vue'

import { useActivitiesStore } from '@/stores/activities.store'
import { useAuthenticationStore } from '@/stores/authentication.store'

import type { IActivity } from '@/interfaces/activity.interface'
import { Levels } from '@/enums/levels'

const { activities } = storeToRefs(useActivitiesStore())
const { user } = storeToRefs(useAuthenticationStore())

const { t } = useI18n()

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
  <app-container>
    <template #sticky>
      <sidebar-statistics />
    </template>

    <template #default>
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
