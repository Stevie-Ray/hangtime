<template>
  <v-layout class="settings">
    <v-app-bar color="primary" app fixed dark>
      <v-icon @click="$router.push({ name: 'workouts' })">{{
        mdi.arrowLeft
      }}</v-icon>
      <v-toolbar-title>
        {{ $t('Settings') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row justify="center" align="start">
          <v-col cols="12">
            <v-list two-line>
              <v-list-item class="big py-2 pt-0" to="/settings/profile">
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
                <!--<v-icon>{{ mdi.accountBox }}</v-icon>-->
                <!--</v-btn>-->
                <!--</v-list-item-action>-->
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item to="/settings/general">
                <v-list-item-icon>
                  <v-icon color="primary lighten-1" v-text="mdi.cog"></v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ $t('General') }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ $t('Language, grading scale, weight, dark mode') }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-divider inset></v-divider>

              <v-list-item to="/settings/hangboards">
                <v-list-item-icon>
                  <span class="v-icon notranslate v-icon--svg">
                    <svg-inline
                      :src="getImg('icons/hangboard-menu.svg')"
                      width="24"
                    />
                  </span>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ $t('Hangboards') }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ $t('Manage your hangboards') }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-divider inset></v-divider>

              <v-list-item to="/settings/workouts">
                <v-list-item-icon>
                  <v-icon color="primary lighten-1">{{ mdi.timer }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ $t('Workouts') }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ $t('Sound, speech, vibrate') }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-divider inset></v-divider>

              <v-list-item disabled>
                <v-list-item-icon>
                  <v-icon color="grey lighten-1">{{ mdi.bellRing }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title
                    >{{ $t('Notifications') }} ({{
                      $t('soon')
                    }})</v-list-item-title
                  >
                  <v-list-item-subtitle>
                    {{ $t('Workout reminders') }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-divider inset></v-divider>

              <v-list-item to="/settings/help">
                <v-list-item-icon>
                  <v-icon color="primary lighten-1">{{
                    mdi.helpCircleOutline
                  }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ $t('Help') }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ $t('FAQ, exercises, privacy, contact') }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { getImg } from '@/misc/helpers'
import { SimpleSVG } from 'vue-simple-svg'
import {
  mdiArrowLeft,
  mdiCog,
  mdiTimer,
  mdiBellRing,
  mdiHelpCircleOutline
} from '@mdi/js'

export default {
  components: { 'svg-inline': SimpleSVG },
  data: () => ({
    mdi: {
      arrowLeft: mdiArrowLeft,
      cog: mdiCog,
      timer: mdiTimer,
      bellRing: mdiBellRing,
      helpCircleOutline: mdiHelpCircleOutline
    }
  }),
  head: {
    title: {
      inner: 'Settings'
    },
    meta: [
      {
        name: 'description',
        content: 'App Settings',
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
