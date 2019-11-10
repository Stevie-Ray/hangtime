<template>
  <v-layout class="tabs">
    <!-- app: Designates the component as part of the application layout. Used for dynamically adjusting content sizing. Components using this prop should reside outside of v-content to function properly-->
    <v-app-bar
      app
      fixed
      tabs
      dark
      color="primary"
      hide-on-scroll
      extended
      :class="{ offline: !networkOnLine }"
    >
      <v-img class="app-logo mr-1" :src="getImg('icons/logo.svg')" contain />

      <v-toolbar-title to="/">
        {{ appTitle }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!--      <v-btn icon>-->
      <!--      <v-icon>mdi-magnify</v-icon>-->
      <!--      </v-btn>-->
      <v-chip
        v-if="!networkOnLine"
        label
        small
        outlined
        disabled
        color="white"
        class="text-uppercase"
        >Offline
      </v-chip>

      <!--      <v-avatar-->
      <!--        v-if="isUserLoggedIn && networkOnLine"-->
      <!--        :size="32"-->
      <!--        color="grey lighten-2"-->
      <!--      >-->
      <!--        <img :src="user.photoURL" :alt="user.displayName" />-->
      <!--      </v-avatar>-->

      <v-menu bottom left min-width="200">
        <template v-slot:activator="{ on }">
          <v-btn dark icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-if="user && user.settings.hangboards.length > 1"
            @click="hangboardDialog = true"
          >
            <v-list-item-title>Switch hangboard</v-list-item-title>
          </v-list-item>
          <v-list-item to="/settings">
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-tabs
        slot="extension"
        v-model="activeTab"
        centered
        grow
        background-color="primary"
        color="white"
        exact
        slider-color="white"
      >
        <v-tab v-for="tab of tabs" :key="tab.id" :to="tab.route">
          {{ tab.name }}
        </v-tab>
      </v-tabs>
    </v-app-bar>

    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex xs12 sm8 md6>
            <v-tabs-items
              v-model="activeTab"
              fill-height
              @change="updateRouter($event)"
            >
              <v-tab-item v-for="tab of tabs" :key="tab.id" :value="tab.route">
                <router-view></router-view>
              </v-tab-item>
            </v-tabs-items>

            <v-fab-transition>
              <v-btn
                v-if="networkOnLine && activeFab.icon !== ''"
                :key="activeFab.icon"
                fixed
                fab
                bottom
                right
                color="secondary"
                @click="
                  activeFab.click
                    ? (dialog = true)
                    : updateRouter(activeFab.route)
                "
              >
                <v-icon v-if="activeFab.icon != ''">{{
                  activeFab.icon
                }}</v-icon>
              </v-btn>
            </v-fab-transition>

            <dialog-hangboard-switch
              v-model="hangboardDialog"
            ></dialog-hangboard-switch>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-layout>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
import { getImg } from '@/misc/helpers'
import DialogHangboardSwitch from '@/components/DialogHangboardSwitch'

export default {
  components: {
    DialogHangboardSwitch
  },
  data: () => ({
    hangboardDialog: false,
    tabs: [
      { id: 0, name: 'workouts', route: `/` },
      { id: 1, name: 'community', route: `/community` },
      { id: 2, name: 'progress', route: `/progress` }
    ]
  }),
  computed: {
    ...mapGetters('authentication', ['isUserLoggedIn']),
    ...mapState('authentication', ['user']),
    ...mapState('app', ['networkOnLine', 'appTitle', 'currentTab']),
    activeFab() {
      switch (this.activeTab) {
        case '/':
          return { route: `/${this.user.id}/workout/new`, icon: 'mdi-plus' }
        case '/community':
          return { route: '/community', icon: '' }
        case '/progress':
          return { route: '/progress', icon: '' }
        default:
          return {}
      }
    },
    activeTab: {
      get() {
        return this.currentTab
      },
      set(value) {
        this.setTab(value)
      }
    }
  },
  methods: {
    ...mapMutations('app', ['setTab']),
    updateRouter(val) {
      this.$router.push(val)
    },
    getImg
  }
}
</script>

<style lang="scss">
@import '@/theme/variables.scss';
.tabs {
  &.offline {
    /*background: #FFF;*/
  }

  .app-logo {
    width: 30px;
    height: 30px;
    max-width: 30px;
    max-height: 30px;
  }

  .v-window {
    height: 100%;
  }

  .offline-label {
    padding: 0 10px;
    border: 1px solid white;
    border-radius: 5px;
    margin-left: 1.5rem;
  }
}
</style>
