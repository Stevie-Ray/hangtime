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

      <v-btn v-if="networkOnLine" class="button-logout" icon @click="logout">
        <v-icon>{{ mdi.accountOff }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
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
                <v-avatar aspect-ratio="1" class="grey lighten-2" size="64">
                  <img
                    v-if="user.photoURL"
                    :src="user.photoURL"
                    :alt="user.displayName"
                  />
                </v-avatar>
              </v-col>
              <v-col class="text-left">
                <div class="text-overline">{{ $t('Workouts') }}</div>
                <div v-if="user && user.completed && user.completed.amount">
                  {{ user.completed.amount }}
                </div>
                <div v-else>0</div>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text class="pa-0">
            <div>{{ user.status }}</div>
          </v-card-text>

          <v-card-subtitle v-if="user.createTimestamp" class="mt-0">
            {{ $t('Started') }}:
            {{ shortDate(user.createTimestamp.toDate()) }}
          </v-card-subtitle>
        </v-img>
      </v-card>
      <v-container>
        <v-row justify="center" align="start">
          <v-col cols="12">
            <v-list one-line>
              <v-list-item v-if="user && user.displayName">
                <v-list-item-icon>
                  <v-icon color="primary lighten-1">{{ mdi.account }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ user.displayName }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="user && user.email">
                <v-list-item-icon>
                  <v-icon color="primary lighten-1">{{ mdi.email }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>
                    {{ user.email }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-list two-line>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary lighten-1">{{
                    mdi.genderMaleFemale
                  }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content style="overflow: visible">
                  <v-radio-group
                    v-model="userGender"
                    row
                    class="mt-1"
                    @change="triggerUpdateUser"
                  >
                    <v-radio :label="$t('Male')" value="male"></v-radio>
                    <v-radio :label="$t('Female')" value="female"></v-radio>
                    <v-radio :label="$t('Other')" value="other"></v-radio>
                  </v-radio-group>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary lighten-1">{{ mdi.mapMarker }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-autocomplete
                    v-model="userCountry"
                    class="mt-1 pt-0"
                    :label="$t('Country')"
                    :items="countries"
                    item-text="name"
                    item-value="alpha2"
                    return-object
                    @change="triggerUpdateUser"
                  ></v-autocomplete>
                </v-list-item-content>
              </v-list-item>

              <v-list-item v-if="user && user.settings.scale">
                <v-list-item-icon>
                  <v-icon color="primary lighten-1">{{
                    mdi.scaleBathroom
                  }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content style="overflow: visible">
                  <v-slider
                    v-model="userWeight"
                    :max="150"
                    :min="50"
                    step="1"
                    ticks
                    always-dirty
                    persistent-hint
                    :label="$t('Weight')"
                    thumb-size="48"
                    :hint="
                      $t(
                        'Set your weight to use with a kettle/dumb-bells or pulley system'
                      )
                    "
                    @end="triggerUpdateUser"
                  >
                    <template #thumb-label="props">
                      {{ weightConverter(props.value, user) }}{{ weightShort }}
                    </template>
                    <template #append>
                      <v-label v-if="user && user.weight">
                        {{ weightConverter(user.weight, user)
                        }}{{ weightShort }}
                      </v-label>
                      <v-label v-else>
                        {{ weightConverter(userWeight, user) }}{{ weightShort }}
                      </v-label>
                    </template>
                  </v-slider>
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
            </v-list>
            <v-list two-line>
              <v-list-item>
                <v-list-item-title
                  ><strong>Link Accounts (Beta)</strong></v-list-item-title
                >
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Google</v-list-item-title>
                <v-list-item-action>
                  <v-btn icon @click="login('google')">
                    <v-icon small>
                      {{ mdi.account }}
                    </v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Facebook</v-list-item-title>
                <v-list-item-action>
                  <v-btn icon @click="login('facebook')">
                    <v-icon small>
                      {{ mdi.account }}
                    </v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-list-item v-if="linkError">
                <v-list-item-title>
                  {{ linkError }}
                </v-list-item-title>
              </v-list-item>
              <v-row align="center" justify="center">
                <v-col cols="12">
                  <v-card flat>
                    <v-card-title>Delete account</v-card-title>
                    <v-card-text>
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </v-card-text>
                    <v-card-actions>
                      <v-btn color="error" @click="deleteAccount"
                        >Delete your account</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import firebase from 'firebase/app'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import IRCRA from 'ircra'
import { count, getImg, shortDate, weightConverter } from '@/misc/helpers'
import countries from '@/misc/countries'

import {
  mdiArrowLeft,
  mdiAccountOff,
  mdiAccount,
  mdiChartTimelineVariant,
  mdiInformation,
  mdiEmail,
  mdiScaleBathroom,
  mdiGenderMaleFemale,
  mdiMapMarker
} from '@mdi/js'

export default {
  data: () => ({
    ircra: new IRCRA(),
    linkError: null,
    countries,
    rules: {
      length: (len) => (v) =>
        (v || '').length <= len || `A maximum of  ${len} characters is allowed`,
      required: (v) => !!v || 'This field is required'
    },
    mdi: {
      arrowLeft: mdiArrowLeft,
      accountOff: mdiAccountOff,
      account: mdiAccount,
      chartTimelineVariant: mdiChartTimelineVariant,
      email: mdiEmail,
      information: mdiInformation,
      scaleBathroom: mdiScaleBathroom,
      genderMaleFemale: mdiGenderMaleFemale,
      mapMarker: mdiMapMarker
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
    ...mapGetters('authentication', ['weightShort']),
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
    userCountry: {
      get() {
        return this.user.country
      },
      set(value) {
        this.setUserCountry(value)
      }
    },
    userGender: {
      get() {
        return this.user.gender
      },
      set(value) {
        this.setUserGender(value)
      }
    },
    userStatus: {
      get() {
        return this.user.status
      },
      set(value) {
        this.setUserStatus(value)
      }
    },
    userWeight: {
      get() {
        if (this.user.weight) {
          return this.user.weight
        }
        return 65
      },
      set(value) {
        this.setUserWeight(value)
      }
    },
    grades() {
      return this.ircra.get(this.user.settings.scale).filter((n) => n)
    }
  },
  methods: {
    count,
    shortDate,
    getImg,
    weightConverter,
    ...mapActions('authentication', ['triggerUpdateUser']),
    ...mapMutations('authentication', [
      'setUserStatus',
      'setUserWeight',
      'setUserGender',
      'setUserCountry',
      'setGrade'
    ]),
    async logout() {
      await firebase.auth().signOut()
    },
    async login(method) {
      let provider = null
      console.log(firebase.auth().currentUser)

      if (method === 'google') {
        provider = new firebase.auth.GoogleAuthProvider()
      }
      if (method === 'facebook') {
        provider = new firebase.auth.FacebookAuthProvider()
      }

      if (provider !== null) {
        try {
          await firebase
            .auth()
            .currentUser.linkWithPopup(provider)
            .then(
              (result) => {
                const { credential } = result
                const { user } = result
                console.log(credential)
                console.log(user)
              },
              (error) => {
                console.log(error)
                this.linkError = error
              }
            )
        } catch (error) {
          this.linkError = error
        }
      }
    },
    async deleteAccount() {
      await firebase
        .auth()
        .currentUser.delete()
        .then(() => {
          this.$router.push('/')
        })
        .catch((error) => {
          console.log(error)
        })
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
