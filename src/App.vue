<script setup>
import { watch } from 'vue'
import { useTheme } from 'vuetify'
import { storeToRefs } from 'pinia'
import { useApp } from '@/stores/app'

import NewContentAvailable from '@/components/molecules/NewContentAvailable/NewContentAvailable'
import { useAuthentication } from '@/stores/authentication'

const { serviceWorkerSkipWaiting } = useApp()

const { newAppContent, refreshingApp } = storeToRefs(useApp())

const { user } = storeToRefs(useAuthentication())

const theme = useTheme()

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')

prefersDark.addEventListener('change', () => {
  if (user.value.settings.theme > 0) {
    theme.global.name.value = user.value.settings.theme === 2 ? 'dark' : 'light'
  } else {
    theme.global.name.value = prefersDark.matches ? 'dark' : 'light'
  }
})

// watch works directly on a ref
watch(user, async (updatedUser) => {
  if (updatedUser?.settings?.theme > 0) {
    theme.global.name.value =
      updatedUser.settings.theme === 2 ? 'dark' : 'light'
  } else {
    theme.global.name.value = prefersDark.matches ? 'dark' : 'light'
  }
})
</script>

<template>
  <v-app>
    <router-view></router-view>
    <new-content-available
      v-if="newAppContent"
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
