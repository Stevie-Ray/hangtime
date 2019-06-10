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
import NewContentAvailable from '@/components/NewContentAvailable'
import AppleAddToHomeScreenModal from '@/components/AppleAddToHomeScreenModal'
import { mapState, mapActions, mapGetters } from 'vuex'

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
.theme {
  &--light.application {
    background-color: #ffffff;
  }

  &--dark.application {
    background-color: #424242;
  }
}

#app {
  // vuetify 2.0.0-beta0 fix
  .v-tab:hover:before {
    opacity: 0;
  }

  .v-toolbar {
    max-width: 100vw;
  }

  .v-content__wrap > .container {
    padding: 0;
  }

  .v-content .theme--light.v-divider {
    border-color: rgba(0, 0, 0, 0.08);
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .v-toolbar {
    &__title {
      line-height: 1.25;
      margin-left: 13px;

      .subheading {
        font-size: 12px !important;
      }
    }

    &__content > .v-icon {
      margin-left: -4px;
    }
  }
}
</style>
