<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n'
import InlineSvg from 'vue-inline-svg'
import { time } from '@/helpers'

import AppContainer from '@/components/organisms/AppContainer/AppContainer'
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
            <inline-svg
              class="v-img__img v-img__img--contain"
              :src="require(`@/assets/logo.svg`)"
              alt="logo"
            />
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
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>
    </template>

    <template #extension>
      <v-tabs grow>
        <v-tab to="/activity" color="text">
          <v-icon class="mr-1">mdi-clipboard-text-clock</v-icon>
          <span>{{ t('History') }}</span>
        </v-tab>
        <v-tab to="/activity/leaderboard" color="text">
          <v-icon class="mr-1">mdi-podium-gold</v-icon>
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
            <v-card
              v-for="(activity, date) in activitiesByDay"
              :key="date"
              class="mb-4"
              disabled
            >
              <v-list lines="one">
                <v-list-subheader>{{ date }}</v-list-subheader>

                <v-list-item
                  v-for="(activity, j) in activity"
                  :key="j"
                  class="mb-4"
                >
                  <template #prepend>
                    <v-avatar color="grey-darken-1"></v-avatar>
                  </template>

                  <template v-if="activity.type !== 'quick'" #append>
                    <div class="d-flex flex-column">
                      <v-chip
                        v-if="activity.difficulty"
                        size="x-small"
                        variant="outlined"
                      >
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
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-container>
</template>
