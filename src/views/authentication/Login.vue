<template>
  <v-main>
    <v-container class="fill-height">
      <v-row class="fill-height" no-gutters>
        <v-col cols="12">
          <div class="text-center pa-4">
            <div class="text-h4">{{ appTitle }}</div>
            <div class="subheading font-weight-light grey--text text--darken-2">
              {{ $t('Version {appVersion}', { appVersion: appVersion }) }}
            </div>

            <img
              height="144px"
              width="144px"
              :src="getImg('logo.svg')"
              :alt="appTitle"
              class="mt-10 mb-10"
            />

            <!-- Loader -->
            <div v-show="user === undefined" data-test="loader">
              <v-progress-circular :size="60" color="primary" indeterminate>
              </v-progress-circular>
              <div class="text-center ">{{ $t('Authenticating...') }}</div>
            </div>

            <!-- Offline instruction -->
            <div v-show="!networkOnLine" data-test="offline-instruction">
              Please check your connection, login feature is not available
              offline.
            </div>

            <div v-if="loginError">
              <p>{{ loginError }}</p>
            </div>
            <!-- Auth UI -->
            <v-row v-if="networkOnLine">
              <v-col cols="12" md="12">
                <v-btn
                  v-show="user !== undefined && !user && networkOnLine"
                  data-test="login-btn"
                  class="login-btn"
                  min-width="250"
                  tile
                  outlined
                  @click="connect('facebook')"
                >
                  <v-icon left>{{ mdi.facebook }}</v-icon>
                  {{ $t('Login with {medium}', { medium: 'Facebook' }) }}
                </v-btn>
              </v-col>
              <v-col cols="12" md="12">
                <v-btn
                  v-show="user !== undefined && !user && networkOnLine"
                  data-test="login-btn"
                  class="login-btn"
                  min-width="250"
                  tile
                  outlined
                  @click="connect('google')"
                >
                  <v-icon left>{{ mdi.google }}</v-icon>
                  {{ $t('Login with {medium}', { medium: 'Google' }) }}
                </v-btn>
              </v-col>
              <v-col cols="12" md="12">
                <v-btn
                  v-show="user !== undefined && !user && networkOnLine"
                  data-test="login-btn"
                  class="login-btn"
                  min-width="250"
                  tile
                  disabled
                  outlined
                  @click="connect('password')"
                >
                  <v-icon left>{{ mdi.key }}</v-icon>
                  {{ $t('Login with a password') }}
                </v-btn>
              </v-col>
              <v-col cols="12" md="12">
                <v-btn
                  v-show="user !== undefined && !user && networkOnLine"
                  data-test="login-btn"
                  class="login-btn"
                  min-width="250"
                  tile
                  disabled
                  outlined
                  @click="connect('anonymous')"
                >
                  <v-icon left>{{ mdi.incognito }}</v-icon>
                  {{ $t('Continue as Guest') }}
                </v-btn>
              </v-col>
            </v-row>

            <div
              class="text-caption grey--text text--darken-2 font-weight-light mt-4"
            >
              &copy; 2019 - {{ year }} {{ appTitle }}.
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { isNil } from 'lodash'
import firebase from 'firebase/app'
import { getImg } from '@/misc/helpers'
import { mdiGoogle, mdiFacebook, mdiIncognito, mdiKey } from '@mdi/js'

export default {
  data: () => ({
    loginError: null,
    year: new Date().getFullYear(),
    mdi: {
      google: mdiGoogle,
      facebook: mdiFacebook,
      incognito: mdiIncognito,
      key: mdiKey
    }
  }),
  head: {
    title: {
      inner: 'Login'
    },
    meta: [
      {
        name: 'description',
        content: 'Sign in or sign up',
        id: 'desc'
      }
    ]
  },
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('app', ['networkOnLine', 'appTitle', 'appVersion'])
  },
  watch: {
    user: {
      handler(user) {
        if (!isNil(user)) {
          const redirectUrl = isNil(this.$route.query.redirectUrl)
            ? '/workouts'
            : this.$route.query.redirectUrl
          this.$router.push(redirectUrl)
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations('authentication', ['setUser']),
    ...mapActions('authentication', ['login']),
    getImg,
    async connect(method) {
      this.loginError = null
      let provider = null

      if (method === 'google') {
        provider = new firebase.auth.GoogleAuthProvider()
        // provider.addScope('profile')
        // provider.addScope('email')
        // provider.addScope('https://www.googleapis.com/auth/user.birthday.read')
        // provider.addScope('https://www.googleapis.com/auth/user.gender.read')
      }
      if (method === 'facebook') {
        provider = new firebase.auth.FacebookAuthProvider()
      }
      if (method === 'anonymous') {
        firebase
          .auth()
          .signInAnonymously()
          .then(result => {
            console.log(result)
            this.$router.push('/workouts')
          })
          .catch(err => {
            this.loginError = err
          })
      }

      if (provider !== null) {
        this.setUser(undefined)

        try {
          // Firebase signin with popup is faster than redirect
          // but we can't use it on mobile because it's not well supported
          // when app is running as standalone on ios & android
          // eslint-disable-next-line no-unused-expressions
          await firebase.auth().signInWithPopup(provider)
          // Enable https://console.developers.google.com/apis/library/people.googleapis.com
          // .then(res => {
          //   fetch(
          //     `https://people.googleapis.com/v1/people/${res.additionalUserInfo.profile.id}?personFields=birthdays,genders&access_token=${res.credential.accessToken}`
          //   ).then(response => console.log(response))
          // })
        } catch (err) {
          this.loginError = err
          this.setUser(null)
        }
      }
    }
  }
}
</script>
