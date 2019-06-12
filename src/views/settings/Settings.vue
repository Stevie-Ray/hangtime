<template>
  <v-layout row class="settings">
    <v-app-bar color="primary" app fixed dark>
      <v-icon @click="$router.push({ name: 'workouts' })"
        >mdi-arrow-left</v-icon
      >
      <v-toolbar-title>
        Settings
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex xs12 sm8 md6>
            <v-list two-line>
              <v-list-item class="big py-2" to="/settings/profile">
                <v-list-item-avatar v-if="user" size="56">
                  <v-img
                    :src="user.photoURL"
                    :alt="user.displayName"
                    aspect-ratio="1"
                    class="grey lighten-2"
                  />
                </v-list-item-avatar>

                <v-list-item-content v-if="user">
                  <v-list-item-title>
                    {{ user.displayName }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ user.status }}
                  </v-list-item-subtitle>
                </v-list-item-content>

                <!--<Oauth :visible="showScheduleForm" @close="showScheduleForm=false"/>-->

                <!--<v-list-item-action>-->
                <!--<v-btn icon ripple v-show="!$auth.check()" @click="showScheduleForm = !showScheduleForm">-->
                <!--<v-icon>mdi-account-box</v-icon>-->
                <!--</v-btn>-->
                <!--</v-list-item-action>-->
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item to="/settings/hangboards">
                <!--                <v-btn text icon to="settings/hangboard">-->
                <!--                  <v-img :src="getImg('icons/hangboard-menu.svg')"/>-->
                <!--                </v-btn>-->
                <v-list-item-avatar>
                  <v-img
                    contain
                    transition="false"
                    max-height="32px"
                    max-width="32px"
                    :src="getImg('icons/hangboard-menu.svg')"
                  />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>Hangboards</v-list-item-title>
                  <v-list-item-subtitle
                    >Manage your hangboards</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>

              <v-divider inset></v-divider>

              <v-list-item to="/settings/workouts">
                <v-list-item-avatar>
                  <v-icon color="primary lighten-1">mdi-timer</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>Workouts</v-list-item-title>
                  <v-list-item-subtitle
                    >Sound, speak, vibrate</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>

              <v-divider inset></v-divider>

              <v-list-item disabled>
                <v-list-item-avatar>
                  <v-icon color="grey lighten-1">mdi-bell-ring</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>Notifications (soon)</v-list-item-title>
                  <v-list-item-subtitle>Workout reminders</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-divider inset></v-divider>

              <v-list-item to="/settings/help">
                <v-list-item-avatar>
                  <v-icon color="primary lighten-1"
                    >mdi-help-circle-outline</v-icon
                  >
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>Help</v-list-item-title>
                  <v-list-item-subtitle
                    >FAQ, contact us, privacy policy</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { getImg } from '@/misc/helpers'

export default {
  head: {
    title: {
      inner: 'Settings'
    },
    meta: [
      {
        name: 'description',
        content: 'HangTime settings',
        id: 'desc'
      }
    ]
  },
  computed: mapState('authentication', ['user']),
  methods: {
    getImg
  }
}
</script>

<style lang="scss" scoped></style>
