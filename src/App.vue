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
import NewContentAvailable from '@/components/NewContentAvailable'
import DialogAppleAddToHomeScreen from '@/components/DialogAppleAddToHomeScreen'

export default {
  components: { NewContentAvailable, DialogAppleAddToHomeScreen },
  computed: {
    ...mapGetters('app', ['newContentAvailable']),
    ...mapState('app', ['showAddToHomeScreenModalForApple', 'refreshingApp'])
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
