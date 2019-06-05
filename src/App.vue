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

  .hangboard {
    padding: 0 16px;

    .leftside,
    .rightside {
      display: inline-block;
      width: 50%;
      text-align: right;
    }
    .rightside {
      transform: rotateY(180deg);
    }
  }

  .simple-svg-wrapper {
    &.h1 #h1,
    &.h2 #h2,
    &.h3 #h3,
    &.h4 #h4,
    &.h5 #h5,
    &.h6 #h6,
    &.h7 #h7,
    &.h8 #h8,
    &.h9 #h9,
    &.h10 #h10,
    &.h11 #h11,
    &.h12 #h12,
    &.h13 #h13,
    &.h14 #h14,
    &.h15 #h15 {
      fill: rgb(115, 146, 112);
    }
  }
}
</style>
