<template>
  <v-app id="app">
    <router-view />

    <new-content-available
      v-if="newContentAvailable"
      class="new-content-available"
      :refreshing-app="refreshingApp"
      @refresh="serviceWorkerSkipWaiting"
    ></new-content-available>
    <dialog-apple-add-to-home-screen
      v-if="showAddToHomeScreenModalForApple"
      class="apple-add-to-home-screen-modal"
      @close="closeAddToHomeScreenModalForApple(false)"
    >
    </dialog-apple-add-to-home-screen>
  </v-app>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import NewContentAvailable from '@/components/molecules/NewContentAvailable/NewContentAvailable'
import DialogAppleAddToHomeScreen from '@/components/molecules/DialogAppleAddToHomeScreen/DialogAppleAddToHomeScreen'

export default {
  components: {
    NewContentAvailable,
    DialogAppleAddToHomeScreen
  },
  data: () => ({
    mq: window.matchMedia('(prefers-color-scheme: dark)')
  }),
  computed: {
    ...mapGetters('app', ['newContentAvailable']),
    ...mapState('app', ['showAddToHomeScreenModalForApple', 'refreshingApp']),
    ...mapState('authentication', ['user']),
    setTheme() {
      if (this.user) {
        if (this.user.settings.scheme) {
          const mq = window.matchMedia('(prefers-color-scheme: dark)')
          return mq.matches
        }
        if (this.user.settings.theme) {
          return this.user.settings.theme
        }
      }
      return false
    }
  },
  mounted() {
    const self = this
    if (this.mq) {
      this.mq.addEventListener('change', () => {
        if (self.user && self.user.settings.scheme) {
          self.$vuetify.theme.dark = window.matchMedia(
            '(prefers-color-scheme: dark)'
          ).matches
        }
      })
    }
  },
  updated() {
    this.$vuetify.theme.dark = this.setTheme
  },
  methods: mapActions('app', [
    'closeAddToHomeScreenModalForApple',
    'serviceWorkerSkipWaiting'
  ])
}
</script>

<style lang="scss">
@import '@/theme/global.scss';
</style>
