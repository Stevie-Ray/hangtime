<template>
  <v-layout class="tabs">
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
      <v-img
        class="app-logo mr-1"
        :src="getImg('icons/logo.svg')"
        :alt="appTitle"
        contain
      />

      <v-toolbar-title to="/">
        {{ appTitle }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!--      <v-btn icon>-->
      <!--      <v-icon>{{ mdi.magnify }}</v-icon>-->
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
        <template #activator="{ on }">
          <v-btn dark icon v-on="on">
            <v-icon>{{ mdi.dotsVertical }}</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-if="user && user.settings.hangboards.length > 1"
            @click="hangboardDialog = true"
          >
            <v-list-item-title>{{ $t('Switch hangboard') }}</v-list-item-title>
          </v-list-item>
          <v-list-item to="/quick-workout">
            <v-list-item-title>{{ $t('Quick workout') }}</v-list-item-title>
          </v-list-item>
          <v-list-item to="/leaderboard">
            <v-list-item-title>{{ $t('Leaderboard') }}</v-list-item-title>
          </v-list-item>
          <v-list-item to="/grades">
            <v-list-item-title>{{ $t('Grade conversion') }}</v-list-item-title>
          </v-list-item>
          <v-list-item to="/settings">
            <v-list-item-title>{{ $t('Settings') }}</v-list-item-title>
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
          {{ $t(tab.name) }}
        </v-tab>
      </v-tabs>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height">
        <v-row justify="center" align="start" class="fill-height" no-gutters>
          <v-col cols="12" class="fill-height">
            <v-tabs-items
              v-model="activeTab"
              class="fill-height"
              @change="updateRouter($event)"
            >
              <v-tab-item
                v-for="tab of tabs"
                :key="tab.id"
                class="fill-height"
                :value="tab.route"
              >
                <router-view></router-view>
              </v-tab-item>
            </v-tabs-items>

            <v-fab-transition>
              <v-btn
                v-if="networkOnLine && activeFab.click !== null"
                :key="activeFab.icon"
                fixed
                fab
                bottom
                right
                color="secondary"
                @click="fabResolver"
              >
                <v-icon v-if="activeFab.icon != ''">{{
                  activeFab.icon
                }}</v-icon>
              </v-btn>
            </v-fab-transition>

            <dialog-hangboard-switch
              v-model="hangboardDialog"
            ></dialog-hangboard-switch>

            <dialog-community-filter v-model="filterDialog">
            </dialog-community-filter>

            <dialog-walkthrough
              v-if="user && !user.settings.walkthrough"
              v-model="walkthroughDialog"
            ></dialog-walkthrough>

            <dialog-add-progress
              v-model="addProgressDialog"
            ></dialog-add-progress>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
import { getImg } from '@/misc/helpers'
import DialogHangboardSwitch from '@/components/DialogHangboardSwitch'
import DialogCommunityFilter from '@/components/DialogCommunityFilter'
import DialogWalkthrough from '@/components/DialogWalkthrough'
import DialogAddProgress from '@/components/DialogAddProgress'
import { mdiTune, mdiPlus, mdiDotsVertical } from '@mdi/js'

export default {
  components: {
    DialogHangboardSwitch,
    DialogWalkthrough,
    DialogCommunityFilter,
    DialogAddProgress
  },
  data: () => ({
    walkthroughDialog: true,
    filterDialog: false,
    addProgressDialog: false,
    hangboardDialog: false,
    tabs: [
      { id: 0, name: 'workout', route: `/` },
      { id: 1, name: 'community', route: `/community` },
      { id: 2, name: 'progress', route: `/progress` }
    ],
    mdi: {
      plus: mdiPlus,
      tune: mdiTune,
      dotsVertical: mdiDotsVertical
    }
  }),
  computed: {
    ...mapGetters('authentication', ['isUserLoggedIn']),
    ...mapState('authentication', ['user']),
    ...mapState('workouts', ['communityWorkouts']),
    ...mapState('app', ['networkOnLine', 'appTitle', 'currentTab']),
    activeFab() {
      let data = 1
      if (this.communityWorkouts && !this.communityWorkouts.length) {
        data = null
      }
      switch (this.activeTab) {
        case '/':
          return { route: `/${this.user.id}/workout/new`, icon: this.mdi.plus }
        case '/community':
          return { click: data, icon: this.mdi.tune }
        case '/progress':
          return { click: 2, icon: this.mdi.plus }
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
    fabResolver() {
      if (this.activeFab.click === 2) {
        this.addProgressDialog = true
      } else if (this.activeFab.click === 1) {
        this.filterDialog = true
      } else {
        this.updateRouter(this.activeFab.route)
      }
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
