<template>
  <v-layout class="profile">
    <v-app-bar color="primary" app fixed dark>
      <v-icon @click="$router.push({ name: 'settings' })">{{
        mdi.arrowLeft
      }}</v-icon>
      <v-toolbar-title>
        {{ $t('Profile') }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!--      <v-btn v-if="!isUserLoggedIn && networkOnLine" to="/login">-->
      <!--        <v-icon>{{ mdi.account }}</v-icon>-->
      <!--      </v-btn>-->

      <v-btn v-if="networkOnLine" icon @click="logout">
        <v-icon>{{ mdi.accountOff }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card flat class="mx-auto" tile dark>
              <v-img
                class="white--text justify-center align-center text-center"
                height="200px"
                gradient="to bottom, rgba(1,46,64,.66), rgba(0,0,0,.33)"
              >
                <v-card-title class="justify-center align-center">
                  <v-row>
                    <v-col class="text-right">
                      <div class="text-overline">{{ $t('Grade') }}</div>
                      <div>
                        {{
                          ircra
                            .convert('ircra', user.settings.grade)
                            .to(user.settings.scale)[user.settings.scale]
                        }}
                      </div>
                    </v-col>
                    <v-col cols="3">
                      <v-avatar
                        aspect-ratio="1"
                        class="grey lighten-2"
                        size="64"
                      >
                        <img :src="user.photoURL" :alt="user.displayName" />
                      </v-avatar>
                    </v-col>
                    <v-col class="text-left">
                      <div class="text-overline">{{ $t('Workouts') }}</div>
                      <div
                        v-if="user && user.completed && user.completed.amount"
                      >
                        {{ user.completed.amount }}
                      </div>
                      <div v-else>0</div>
                    </v-col>
                  </v-row>
                </v-card-title>
                <v-card-text class="pa-0">
                  <div>{{ user.status }}</div>
                </v-card-text>

                <v-card-subtitle class="mt-0">
                  {{ $t('Started') }}:
                  {{ shortDate(user.createTimestamp.toDate()) }}
                </v-card-subtitle>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
        <v-row justify="center" align="start">
          <v-col cols="12">
            <v-list two-line>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary lighten-1">{{ mdi.account }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content v-if="user">
                  <v-list-item-title>{{ user.displayName }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary lighten-1">
                    {{ mdi.timer }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    v-if="user && user.completed && user.completed.time"
                    class="my-0"
                  >
                    <strong>{{ $t('Total time worked out') }}:</strong>
                    {{ count(user.completed.time) }}
                  </v-list-item-title>
                  <v-list-item-subtitle
                    v-if="user && user.completed && user.completed.hold"
                    class="my-0"
                  >
                    {{ $t('Total time hangboarding') }}:
                    {{ count(user.completed.hold) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary lighten-1">{{
                    mdi.chartTimelineVariant
                  }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-select
                    v-if="user"
                    v-model="settingsGrade"
                    :items="grades"
                    :item-text="user.settings.scale"
                    item-value="ircra"
                    :label="$t('Grade')"
                    persistent-hint
                    :hint="$t('What grade are you currently climbing?')"
                    @change="triggerUpdateUser"
                  ></v-select>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary lighten-1">{{
                    mdi.information
                  }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-text-field
                    v-if="user"
                    v-model="userStatus"
                    :placeholder="$t('In the climbing gym')"
                    :rules="[rules.required, rules.length(24)]"
                    counter="24"
                    required
                    :label="$t('Status')"
                    @change="triggerUpdateUser"
                  >
                  </v-text-field>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary lighten-1">{{ mdi.email }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title v-if="user">{{
                    user.email
                  }}</v-list-item-title>
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
import firebase from 'firebase/app'
import { mapState, mapActions, mapMutations } from 'vuex'
import IRCRA from 'ircra'
import { count, getImg, shortDate } from '@/misc/helpers'
import {
  mdiArrowLeft,
  mdiAccountOff,
  mdiAccount,
  mdiChartTimelineVariant,
  mdiInformation,
  mdiEmail,
  mdiTimer
} from '@mdi/js'

export default {
  data: () => ({
    ircra: new IRCRA(),
    rules: {
      length: len => v =>
        (v || '').length <= len || `A maximum of  ${len} characters is allowed`,
      required: v => !!v || 'This field is required'
    },
    mdi: {
      arrowLeft: mdiArrowLeft,
      accountOff: mdiAccountOff,
      account: mdiAccount,
      chartTimelineVariant: mdiChartTimelineVariant,
      email: mdiEmail,
      information: mdiInformation,
      timer: mdiTimer
    }
  }),
  head: {
    title: {
      inner: 'Profile'
    },
    meta: [
      {
        name: 'description',
        content: 'User profile',
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
    settingsGrade: {
      get() {
        const ircraGrade = this.ircra
          .convert('ircra', this.user.settings.grade)
          .to(this.user.settings.scale)[this.user.settings.scale]
        return ircraGrade
      },
      set(value) {
        const ircraGrade = this.ircra
          .convert(this.user.settings.scale, value)
          .to('ircra').ircra
        this.setGrade(ircraGrade)
      }
    },
    userStatus: {
      get() {
        return this.user.status
      },
      set(value) {
        this.setStatus(value)
      }
    },
    grades() {
      return this.ircra.get(this.user.settings.scale).filter(n => n)
    }
  },
  methods: {
    count,
    shortDate,
    getImg,
    ...mapActions('authentication', ['triggerUpdateUser']),
    ...mapMutations('authentication', ['setStatus', 'setGrade']),
    async logout() {
      await firebase.auth().signOut()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.profile {
  .v-badge__badge {
    width: 48px;
    height: 48px;

    .v-icon {
      font-size: 24px;
    }
  }

  .v-badge--overlap.v-badge--bottom .v-badge__badge {
    bottom: 16px;
    right: 16px;
  }

  .v-avatar {
    overflow: hidden;

    img {
      height: auto;
      min-height: 100%;
    }
  }
}
</style>
