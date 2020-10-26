<template>
  <v-layout class="profile">
    <v-app-bar color="primary" app fixed dark>
      <v-icon @click="$router.push({ name: 'settings' })">{{
        mdi.arrowLeft
      }}</v-icon>
      <v-toolbar-title>
        General
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row justify="center" align="start">
          <v-col cols="12">
            <v-list two-line>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary lighten-1">{{
                    mdi.chartGantt
                  }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-select
                    v-model="settingsScale"
                    :items="scale"
                    item-text="name"
                    item-value="value"
                    label="Grading system"
                    @change="triggerUpdateUser"
                  ></v-select>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary lighten-1">{{
                    mdi.themeLightDark
                  }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Dark mode</v-list-item-title>
                  <v-list-item-subtitle>Enable dark mode</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-checkbox
                    v-model="settingsTheme"
                    @change="triggerUpdateUser"
                  ></v-checkbox>
                </v-list-item-action>
              </v-list-item>

              <v-list-item three-line>
                <v-list-item-icon>
                  <v-icon color="primary lighten-1">{{
                    mdi.cellphoneLink
                  }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Use system mode</v-list-item-title>
                  <v-list-item-subtitle
                    >overwrites manual dark mode setting based on device
                    settings</v-list-item-subtitle
                  >
                </v-list-item-content>

                <v-list-item-action>
                  <v-checkbox
                    v-model="settingsScheme"
                    @change="triggerUpdateUser"
                  ></v-checkbox>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import IRCRA from 'ircra'
import { getImg } from '@/misc/helpers'
import {
  mdiArrowLeft,
  mdiChartGantt,
  mdiThemeLightDark,
  mdiCellphoneLink
} from '@mdi/js'

export default {
  data: () => ({
    scale: new IRCRA().scale(),
    mq: window.matchMedia('(prefers-color-scheme: dark)'),
    mdi: {
      arrowLeft: mdiArrowLeft,
      chartGantt: mdiChartGantt,
      themeLightDark: mdiThemeLightDark,
      cellphoneLink: mdiCellphoneLink
    }
  }),
  head: {
    title: {
      inner: 'General'
    },
    meta: [
      {
        name: 'description',
        content: 'General Settings',
        id: 'desc'
      }
    ]
  },
  computed: {
    ...mapState('app', ['networkOnLine']),
    ...mapState('authentication', ['user']),
    settingsScale: {
      get() {
        return this.user.settings.scale
      },
      set(value) {
        // this.scaleSelected = value
        this.setScale(value)
      }
    },
    settingsTheme: {
      get() {
        return this.user.settings.theme
      },
      set(value) {
        if (!this.settingsScheme) {
          this.$vuetify.theme.dark = value
        }
        this.setTheme(value)
      }
    },
    settingsScheme: {
      get() {
        return this.user.settings.scheme
      },
      set(value) {
        if (value === true && this.mq) {
          this.$vuetify.theme.dark = window.matchMedia(
            '(prefers-color-scheme: dark)'
          ).matches
        } else {
          this.$vuetify.theme.dark = false
        }
        if (value === false) {
          this.$vuetify.theme.dark = this.settingsTheme
        }
        this.setScheme(value)
      }
    }
  },
  methods: {
    getImg,
    ...mapActions('authentication', ['triggerUpdateUser']),
    ...mapMutations('authentication', ['setScale', 'setTheme', 'setScheme'])
  }
}
</script>
