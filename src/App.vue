<template>
  <v-app id="app">
    <router-view />

    <new-content-available
      v-if="newContentAvailable"
      class="new-content-available"
      :refreshing-app="refreshingApp"
      @refresh="serviceWorkerSkipWaiting"
    ></new-content-available>
    <apple-add-to-home-screen-modal
      v-if="showAddToHomeScreenModalForApple"
      class="apple-add-to-home-screen-modal"
      @close="closeAddToHomeScreenModalForApple(false)"
    >
    </apple-add-to-home-screen-modal>
  </v-app>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import NewContentAvailable from '@/components/NewContentAvailable'
import AppleAddToHomeScreenModal from '@/components/AppleAddToHomeScreenModal'

export default {
  components: { NewContentAvailable, AppleAddToHomeScreenModal },
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
