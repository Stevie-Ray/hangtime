<template>
  <v-main>
    <v-container class="fill-height">
      <v-row class="fill-height" no-gutters>
        <v-col cols="12">
          <div class="text-center pa-4">
            <div class="text-h4">{{ appTitle }}</div>
            <div class="subheading font-weight-light grey--text text--darken-2">
              Version {{ appVersion }}
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
              <div class="text-center ">Authenticating...</div>
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
                  @click="login('facebook')"
                >
                  <v-icon left>{{ mdi.facebook }}</v-icon> Login with Facebook
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
                  @click="login('google')"
                >
                  <v-icon left>{{ mdi.google }}</v-icon> Login with Google
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
import { mapState, mapMutations } from 'vuex'
import { isNil } from 'lodash'
import firebase from 'firebase/app'
import { desktop as isDekstop } from 'is_js'
import { getImg } from '@/misc/helpers'
import { mdiGoogle, mdiFacebook } from '@mdi/js'

export default {
  data: () => ({
    loginError: null,
    year: new Date().getFullYear(),
    mdi: {
      google: mdiGoogle,
      facebook: mdiFacebook
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
    getImg,
    async login(method) {
      this.loginError = null
      let provider = null

      if (method === 'google') {
        provider = new firebase.auth.GoogleAuthProvider()
      }
      if (method === 'facebook') {
        provider = new firebase.auth.FacebookAuthProvider()
      }

      this.setUser(undefined)

      try {
        // Firebase signin with popup is faster than redirect
        // but we can't use it on mobile because it's not well supported
        // when app is running as standalone on ios & android
        // eslint-disable-next-line no-unused-expressions
        isDekstop()
          ? await firebase.auth().signInWithPopup(provider)
          : await firebase.auth().signInWithPopup(provider)
      } catch (err) {
        this.loginError = err
        this.setUser(null)
      }
    }
  }
}
</script>
