<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n'
import InlineSvg from 'vue-inline-svg'
import AppContainer from '@/components/organisms/AppContainer/AppContainer'
import { useActivities } from '@/stores/activities'

import { time, useRandomImage } from '@/helpers'
import { useAuthentication } from '@/stores/authentication'

const { t } = useI18n()

const notifications = ref(false)

const { user } = storeToRefs(useAuthentication())

const { activities } = storeToRefs(useActivities())

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

const slides = [
  {
    title: 'A new HangTime 🎉',
    subtitle: 'Welcome to the new and improved HangTime',
    text: 'A completely rewritten app. Found a bug or want to request a feature? Let me know!',
    button_text: 'Get in touch',
    external_link: 'mailto:mail@stevie-ray.nl?subject=Bug%20Report'
  },
  {
    title: 'Check our leaderboard',
    subtitle: 'Who trained longest or hung longest?',
    text: 'Our top 15 most active HangTime users in three categories.',
    button_text: 'Check your position',
    internal_link: '/activity/leaderboard'
  },
  {
    title: 'Do a quick workout',
    subtitle: 'No time to create a workout?',
    text: 'Just looking for a quick session? Adjust the timers and start hangboarding.',
    button_text: 'Get started',
    internal_link: '/workouts/quick'
  },
  {
    title: 'Use multiple hangboards',
    subtitle: 'Add your own and that of your gym',
    text: 'You can create workouts for multiple hangboards and share them with your friends.',
    button_text: 'Add Hangboards',
    internal_link: '/account/hangboards'
  }
]

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
            <v-carousel
              height="225"
              :show-arrows="false"
              cycle
              :interval="6000"
              hide-delimiters
              class="rounded-lg"
            >
              <v-carousel-item v-for="(slide, i) in slides" :key="i">
                <v-card class="mx-auto" max-height="225" max-width="100%">
                  <v-img :src="useRandomImage(true)" cover>
                    <v-card-title v-if="slide.title" class="text-white">{{
                      slide.title
                    }}</v-card-title>

                    <v-card-subtitle v-if="slide.subtitle" class="text-white">{{
                      slide.subtitle
                    }}</v-card-subtitle>

                    <v-card-text v-if="slide.text" class="text-white">
                      {{ slide.text }}
                    </v-card-text>

                    <v-card-actions>
                      <v-btn
                        v-if="
                          slide.button_text &&
                          (slide.internal_link || slide.external_link)
                        "
                        color="white"
                        variant="outlined"
                        class="mb-2"
                        :to="slide.internal_link"
                        :href="slide.external_link"
                      >
                        {{ slide.button_text }}
                      </v-btn>
                    </v-card-actions>
                  </v-img>
                </v-card>
              </v-carousel-item>
            </v-carousel>
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
