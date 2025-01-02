<script setup lang="ts">
/// <reference types="digital-goods-browser" />
import { watch } from 'vue'
import { useTheme } from 'vuetify'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import roboto400 from '@fontsource/roboto/files/roboto-latin-400-normal.woff2'
import roboto500 from '@fontsource/roboto/files/roboto-latin-500-normal.woff2'
import roboto700 from '@fontsource/roboto/files/roboto-latin-700-normal.woff2'

import { useAppStore } from '@/stores/app'

import NewContentAvailable from '@/components/molecules/NewContentAvailable/NewContentAvailable.vue'
import { useAuthenticationStore } from '@/stores/authentication'
import { Theme } from '@/enums/theme'

// router
const route = useRoute()

useHead({
  titleTemplate: (title) => (title ? `${title} | HangTime` : `HangTime`),
  link: [
    {
      rel: 'preload',
      href: roboto400,
      as: 'font',
      crossorigin: 'anonymous',
      type: 'font/woff2'
    },
    {
      rel: 'preload',
      href: roboto500,
      as: 'font',
      crossorigin: 'anonymous',
      type: 'font/woff2'
    },
    {
      rel: 'preload',
      href: roboto700,
      as: 'font',
      crossorigin: 'anonymous',
      type: 'font/woff2'
    }
  ]
})

const { serviceWorkerSkipWaiting } = useAppStore()

const { newAppContent, refreshingApp } = storeToRefs(useAppStore())

const { user } = storeToRefs(useAuthenticationStore())

const theme = useTheme()

const prefersDark: MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')

prefersDark.addEventListener('change', (): void => {
  if (user.value?.settings?.theme && user.value.settings.theme > Theme.System) {
    theme.global.name.value = user.value?.settings.theme === Theme.Dark ? 'dark' : 'light'
  } else {
    theme.global.name.value = prefersDark.matches ? 'dark' : 'light'
  }
})

// watch works directly on a ref
watch(user, async (updatedUser): Promise<void> => {
  if (updatedUser?.settings?.theme && updatedUser.settings.theme > Theme.System) {
    theme.global.name.value = updatedUser.settings.theme === Theme.Dark ? 'dark' : 'light'
  } else {
    theme.global.name.value = prefersDark.matches ? 'dark' : 'light'
  }
})
</script>

<template>
  <v-app>
    <router-view></router-view>
    <new-content-available
      v-if="newAppContent && route.name !== 'WorkoutsTimerPage'"
      class="new-content-available"
      :refreshing-app="refreshingApp"
      @refresh="serviceWorkerSkipWaiting"
    ></new-content-available>
  </v-app>
</template>

<style lang="scss">
.v-toolbar__extension {
  .v-btn__overlay,
  .v-btn__underlay,
  .v-ripple__container {
    border-radius: 0;
  }
}

@media (min-width: 1280px) {
  .v-container {
    max-width: 900px;
  }
}
</style>
