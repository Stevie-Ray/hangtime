<template>
  <app-container name="Profile" :back-link="{ path: '/settings' }">
    <template #icons>
      <v-btn v-if="networkOnLine" class="button-logout" icon @click="logout">
        <v-icon>{{ mdi.accountOff }}</v-icon>
      </v-btn>
    </template>
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
              <v-badge bottom overlap offset-x="24" offset-y="24">
                <v-btn slot="badge" icon @click="selectFile('user')">
                  <v-icon>{{ mdi.camera }}</v-icon>
                </v-btn>
                <v-avatar size="72" @click="selectFile(false)">
                  <img
                    v-if="user.photoURL || user.pictureURL"
                    :src="userPhoto"
                    :alt="user.displayName"
                  />
                </v-avatar>
              </v-badge>
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
                      {{ weightConverter(user.weight, user) }}{{ weightShort }}
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
                <v-icon color="primary lighten-1">{{ mdi.information }}</v-icon>
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
                    Once you delete your account, there is no going back. Please
                    be certain.
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
  </app-container>
</template>

<script>
import AppContainer from '@/components/molecules/AppContainer/AppContainer'
import firebase from 'firebase/app'
import 'firebase/storage'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import IRCRA from 'ircra'
import { count, getImg, shortDate, weightConverter } from '@/misc/helpers'
import countries from '@/misc/countries'

import {
  mdiAccountOff,
  mdiAccount,
  mdiChartTimelineVariant,
  mdiInformation,
  mdiEmail,
  mdiScaleBathroom,
  mdiGenderMaleFemale,
  mdiMapMarker,
  mdiCamera
} from '@mdi/js'

export default {
  components: {
    AppContainer
  },
  data: () => ({
    ircra: new IRCRA(),
    linkError: null,
    uploadValue: 0,
    pictureURL: '',
    countries,
    rules: {
      length: (len) => (v) =>
        (v || '').length <= len || `A maximum of  ${len} characters is allowed`,
      required: (v) => !!v || 'This field is required'
    },
    mdi: {
      accountOff: mdiAccountOff,
      account: mdiAccount,
      chartTimelineVariant: mdiChartTimelineVariant,
      email: mdiEmail,
      information: mdiInformation,
      scaleBathroom: mdiScaleBathroom,
      genderMaleFemale: mdiGenderMaleFemale,
      mapMarker: mdiMapMarker,
      camera: mdiCamera
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
    userPhoto() {
      if (this.user.pictureURL) {
        return this.user.pictureURL
      }
      if (this.pictureURL !== '') {
        return this.pictureURL
      }
      return this.user.photoURL
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
      'setUserPicture',
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
    },
    selectFile(capture) {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      if (capture) {
        input.capture = capture
      }
      input.onchange = (e) => {
        this.uploadValue = 0
        const file = e.target.files[0]
        if (file.size > 2 * 1024 * 1024) {
          // eslint-disable-next-line no-alert
          alert('File is too big, max. 2MB allowed')
          return
        }
        const storageRef = firebase.storage().ref()
        const userImagesRef = storageRef
          .child(`profile/${this.user.id}`)
          .put(file)
        userImagesRef.on(
          `state_changed`,
          (snapshot) => {
            this.uploadValue =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          },
          (error) => {
            console.log(error.message)
          },
          () => {
            this.uploadValue = 100
            userImagesRef.snapshot.ref.getDownloadURL().then((url) => {
              this.setUserPicture(url)
              this.pictureURL = url
              this.triggerUpdateUser()
            })
          }
        )
      }
      input.click()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.profile {
  .v-badge__badge {
    width: 36px;
    height: 36px;
    border-radius: 18px;
    padding: 0;
    .v-icon {
      height: 18px;
      width: 18px;
      font-size: 18px;
    }
  }
}
</style>
