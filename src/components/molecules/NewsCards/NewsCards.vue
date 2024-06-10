<script setup lang="ts">
import { useRandomImage } from '@/helpers'
import { useUserStore } from '@/stores/user'
import countries from '@/helpers/countries'

const { getCompanies } = useUserStore()

interface Slide {
  title: string
  subtitle: string
  image: string
  text: string
  button_text: string
  internal_link?: string
  external_link?: string
}

const slides: Slide[] = [
  {
    title: '🏆 Check the leaderboard',
    subtitle: 'Who trained longest or hung longest?',
    image: useRandomImage(true),
    text: 'The top 15 most active HangTime users in three categories.',
    button_text: 'Check your position',
    internal_link: '/activity/leaderboard'
  },
  {
    title: '🏃 Do a quick workout',
    subtitle: 'No time to create a workout?',
    image: useRandomImage(true),
    text: 'Just looking for a quick session? Adjust the timers and start hangboarding.',
    button_text: 'Get started',
    internal_link: '/workouts/quick'
  },
  {
    title: '🛠️ Use multiple hangboards',
    subtitle: 'Add your own and that of your gym',
    image: useRandomImage(true),
    text: 'You can create workouts for multiple hangboards and share them with your friends.',
    button_text: 'Add Hangboards',
    internal_link: '/account/hangboards'
  },
  {
    title: '🐜 Found a bug?',
    subtitle: 'Help improve HangTime by reporting the issue',
    image: useRandomImage(true),
    text: 'Found a bug or want to request a feature? Or know a missing hangboard? Help HangTime improve!',
    button_text: 'Get in touch',
    external_link: 'mailto:mail@stevie-ray.nl?subject=Bug%20Report'
  }
]

let newCompanies = []
// eslint-disable-next-line no-restricted-syntax
for (const company of getCompanies()) {
  if (company?.id >= getCompanies.length - 5) {
    newCompanies.push(company)
  }
}

newCompanies = newCompanies.sort((a, b) => (a.id > b.id ? 1 : -1)).reverse()

let index = 0
// eslint-disable-next-line no-restricted-syntax
for (const newCompany of newCompanies) {
  slides.splice(index, 0, {
    title: `${
      newCompany?.country
        ? countries.find((country) => country.alpha2 === newCompany.country)?.emoji
        : ''
    } ${newCompany.name}`,
    subtitle: 'New in HangTime',
    image: useRandomImage(true),
    text: newCompany.description,
    button_text: 'View Hangboards',
    internal_link: newCompany.name
      ? `/brands/${encodeURIComponent(newCompany.name.replace(/\s+/g, '-').toLowerCase())}`
      : undefined
  })
  index += 2
}
</script>

<template>
  <v-carousel
    height="225"
    :show-arrows="false"
    cycle
    :interval="6000"
    hide-delimiters
    class="rounded-lg"
  >
    <v-carousel-item v-for="(slide, i) in slides" :key="i">
      <v-card class="mx-auto" max-width="100%">
        <v-img :src="slide.image" cover>
          <v-card-title v-if="slide.title" class="text-white">
            {{ slide.title }}
          </v-card-title>

          <v-card-subtitle v-if="slide.subtitle" class="text-white">
            {{ slide.subtitle }}
          </v-card-subtitle>

          <v-card-text v-if="slide.text" class="text-white" style="height: 92px">
            {{ slide.text }}
          </v-card-text>

          <v-card-actions class="mt-auto">
            <v-btn
              v-if="slide.button_text && (slide.internal_link || slide.external_link)"
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
</template>

<style lang="scss" scoped></style>
