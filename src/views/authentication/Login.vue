<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout justify-center>
        <v-flex text-center xs12 sm8 md6>
          <v-flex class="mx-auto pa-4">
            <div class="title font-weight-light mb-2">{{ appTitle }}</div>
            <div class="subheading font-weight-light grey--text mb-4">
              Version {{ appVersion }}
            </div>

            <img
              height="144px"
              width="144px"
              :src="getImg('logo.svg')"
              class="mb-4"
            />

            <!-- Loader -->
            <div v-show="user === undefined" data-test="loader">
              <v-progress-circular :size="60" color="primary" indeterminate>
              </v-progress-circular>
              <div class="text-center">Authenticating...</div>
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
            <v-flex xs12 class="my-3">
              <v-btn
                v-show="user !== undefined && !user && networkOnLine"
                data-test="login-btn"
                class="login-btn"
                @click="login('facebook')"
              >
                Login with Facebook
              </v-btn>
            </v-flex>
            <v-flex xs12 class="my-3">
              <v-btn
                v-show="user !== undefined && !user && networkOnLine"
                data-test="login-btn"
                class="login-btn"
                @click="login('google')"
              >
                Login with Google
              </v-btn>
            </v-flex>

            <v-flex xs12 class="mt-5 caption grey--text font-weight-light">
              &copy; 2019 HangTime.<br /><br />
              Development:
              <a href="https://stevie-ray.nl/" target="_blank">
                Stevie-Ray Hartog
              </a>
              <br />
              Illustrations:
              <a href="https://dribbble.com/jurrienvrijsen" target="_blank">
                Jurriën Vrijsen
              </a>
            </v-flex>
          </v-flex>
        </v-flex>
      </v-layout>
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
  data: () => ({ loginError: null }),
  head: {
    title: {
      inner: 'Login'
    },
    meta: [
      {
        name: 'description',
        content: 'Sign in or sign up to HangTime',
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
          : await firebase.auth().signInWithRedirect(provider)
      } catch (err) {
        this.loginError = err
        this.setUser(null)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
