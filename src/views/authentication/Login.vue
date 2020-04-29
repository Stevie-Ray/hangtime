<template>
  <v-content>
    <v-container class="fill-height">
      <v-row class="fill-height" no-gutters>
        <v-col cols="12">
          <div class="text-center pa-4">
            <div class="display-1">{{ appTitle }}</div>
            <div class="subheading font-weight-light grey--text">
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
              <v-col cols="12">
                <v-btn
                  v-show="user !== undefined && !user && networkOnLine"
                  data-test="login-btn"
                  class="login-btn mb-4"
                  min-width="250"
                  tile
                  outlined
                  @click="login('facebook')"
                >
                  <v-icon left>mdi-facebook</v-icon> Login with Facebook
                </v-btn>
                <v-btn
                  v-show="user !== undefined && !user && networkOnLine"
                  data-test="login-btn"
                  class="login-btn mb-4"
                  min-width="250"
                  tile
                  outlined
                  @click="login('google')"
                >
                  <v-icon left>mdi-google</v-icon> Login with Google
                </v-btn>
              </v-col>
            </v-row>

            <div class="caption grey--text darken-1 font-weight-light">
              &copy; 2020 {{ appTitle }}.
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { isNil } from 'lodash'
import firebase from 'firebase/app'
import { desktop as isDekstop } from 'is_js'
import { getImg } from '@/misc/helpers'

export default {
  data: () => ({
    loginError: null
  }),
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
  },
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
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
