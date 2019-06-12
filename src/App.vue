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
  &--light {
    .v-sheet,
    .v-list {
      background-color: #fafafa;
    }
  }

  &--dark {
    &.application {
      background-color: #424242;
    }
  }
}

#app {
  // vuetify 2.0.0-beta0 fix
  .v-tab:hover:before {
    opacity: 0;
  }

  .v-content__wrap > .container {
    padding: 0;
  }

  .v-content .theme--light.v-divider {
    border-color: rgba(0, 0, 0, 0.08);
  }

  /* global hangboard css */
  .hangboard {
    padding: 0 16px;
    margin: 0 auto;
    max-width: 500px;

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

  img {
    max-width: 100%;
    height: auto;
  }

  .v-toolbar {
    display: flex;
    flex: 0 1 auto;
    flex-direction: row;
    max-width: 100vw;
    flex-wrap: wrap;
    justify-content: center;
    &__title {
      line-height: 1.25;
      margin-left: 13px;

      .subheading {
        font-size: 12px !important;
      }
    }

    &__content,
    &__extension {
      flex: 0 0 auto;
      flex-basis: 100%;
      max-width: 100%;
      // sm
      @media (min-width: 600px) {
        flex-basis: 66.6666666667%;
        max-width: 66.6666666667%;
      }
      @media (min-width: 960px) {
        flex-basis: 50.1%;
        max-width: 50.1%;
      }
    }

    &__content > .v-icon {
      margin-left: -4px;
    }
  }
  .tabs {
    .v-toolbar__title {
      margin-left: 0;
      font-weight: 700;
    }
  }
  /* run + record templates */
  .canvas {
    &:not(.column) {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      grid-template-areas: 'Counter Hangboard' 'Counter Title';
      height: inherit;
      @media (min-width: 960px) {
        padding-top: 40px;
        padding-bottom: 40px;
      }
    }
    .Counter {
      grid-area: Counter;
    }

    .Hangboard {
      grid-area: Hangboard;
      width: 100%;
    }

    .Title {
      grid-area: Title;
    }
  }
}
</style>
