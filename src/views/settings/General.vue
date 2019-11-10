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
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex xs12 sm8 md6>
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

                <v-list-item-content
                  @click="$vuetify.theme.dark = !$vuetify.theme.dark"
                >
                  <v-list-item-title>Dark mode</v-list-item-title>
                  <v-list-item-subtitle>Enable dark mode</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-checkbox v-model="$vuetify.theme.dark"></v-checkbox>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-flex>
        </v-layout>
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
    scale: new IRCRA().scale()
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
    }
  },
  methods: {
    getImg,
    ...mapActions('authentication', ['triggerUpdateUser']),
    ...mapMutations('authentication', ['setScale'])
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
