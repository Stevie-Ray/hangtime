<template>
  <v-layout class="profile">
    <v-app-bar color="primary" app fixed dark>
      <v-icon @click="$router.push({ name: 'settings' })"
        >mdi-arrow-left</v-icon
      >
      <v-toolbar-title>
        General
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <v-container>
        <v-row justify="center" align="start">
          <v-col cols="12">
            <v-list two-line>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon color="primary lighten-1">mdi-chart-gantt</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-select
                    v-model="settingsScale"
                    :items="scale"
                    item-text="name"
                    item-value="value"
                    label="Grading scale"
                    @change="triggerUpdateUser"
                  ></v-select>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-avatar>
                  <v-icon color="primary lighten-1"
                    >mdi-theme-light-dark</v-icon
                  >
                </v-list-item-avatar>

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
                <v-list-item-avatar>
                  <v-icon color="primary lighten-1">mdi-cellphone-link</v-icon>
                </v-list-item-avatar>

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
    </v-content>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import IRCRA from 'ircra'
import { getImg } from '@/misc/helpers'

export default {
  data: () => ({
    scale: new IRCRA().scale(),
    mq: window.matchMedia('(prefers-color-scheme: dark)')
  }),
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
        if (value === true) {
          this.$vuetify.theme.dark = this.mq.matches
        } else {
          this.$vuetify.theme.dark = false
        }
        this.setScheme(value)
      }
    }
  },
  methods: {
    getImg,
    ...mapActions('authentication', ['triggerUpdateUser']),
    ...mapMutations('authentication', ['setScale', 'setTheme', 'setScheme'])
  },
  head: {
    title: {
      inner: 'General'
    },
    meta: [
      {
        name: 'description',
        content: 'HangTime settings',
        id: 'desc'
      }
    ]
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
