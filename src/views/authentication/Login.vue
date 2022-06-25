<template>
  <v-main class="login-screen">
    <v-container class="fill-height">
      <v-row class="fill-height">
        <v-col cols="12">
          <div class="text-center">
            <v-row no-gutters justify="center" class="logo-container">
              <v-col class="flex-grow-0">
                <v-img
                  class="app-logo mr-1"
                  height="36"
                  width="36"
                  :src="getImg('icons/logo.svg')"
                  :alt="appTitle"
                  contain
                />
              </v-col>
              <v-col class="flex-grow-0">
                <div class="white--text text-h4">{{ appTitle }}</div>
              </v-col>
            </v-row>

            <v-card
              elevation="2"
              class="d-flex justify-center align-center"
              max-width="500"
              min-height="250"
              style="margin: 0 auto"
            >
              <!-- Loader -->
              <div v-show="user === undefined" data-test="loader">
                <v-progress-circular :size="48" color="primary" indeterminate>
                </v-progress-circular>
                <div class="text-center">{{ $t('Authenticating...') }}</div>
              </div>

              <!-- Offline instruction -->
              <div v-show="!networkOnLine" data-test="offline-instruction">
                Please check your connection, login feature is not available
                offline.
              </div>

              <!-- Forms -->
              <div v-show="user !== undefined && !user && networkOnLine">
                <v-card-title class="justify-center">
                  {{ $t('Welcome') }}
                </v-card-title>
                <v-card-subtitle class="text-center">
                  {{ $t('Continue with') }}
                </v-card-subtitle>
                <v-card-text>
                  <!-- Auth UI -->
                  <v-row v-if="networkOnLine">
                    <v-col cols="6">
                      <div class="text-center">
                        <v-btn
                          v-show="user !== undefined && !user && networkOnLine"
                          data-test="login-btn"
                          elevation="1"
                          dark
                          large
                          block
                          color="#1877F2"
                          @click="connect('facebook')"
                        >
                          <v-icon dark left>
                            {{ mdi.facebook }}
                          </v-icon>
                          <span class="social-login-text"> Facebook </span>
                        </v-btn>
                      </div>
                    </v-col>
                    <v-col cols="6">
                      <v-btn
                        v-show="user !== undefined && !user && networkOnLine"
                        data-test="login-btn"
                        elevation="1"
                        block
                        dark
                        large
                        color="#DB4437"
                        @click="connect('google')"
                      >
                        <v-icon dark left>{{ mdi.google }}</v-icon>
                        <span class="social-login-text"> Google </span>
                      </v-btn>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12">
                      <div
                        class="text-center subtitle-2 text-uppercase side-lines"
                      >
                        {{ $t('Or') }}
                      </div>
                      <!-- Login -->
                      <v-form
                        v-if="!switchForm"
                        ref="login"
                        v-model="valid"
                        :disabled="formDisabled"
                        lazy-validation
                      >
                        <v-text-field
                          v-model="email"
                          label="E-mail"
                          class="input-email"
                          autocomplete="email"
                          :rules="[rules.requiredRule]"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="password"
                          class="input-password"
                          autocomplete="current-password"
                          :rules="[rules.requiredRule]"
                          label="Password"
                          type="password"
                          required
                        ></v-text-field>

                        <v-btn
                          v-show="user !== undefined && !user && networkOnLine"
                          block
                          color="primary"
                          large
                          data-test="login-btn"
                          class="mt-2 mb-4"
                          @click="validateLogin"
                        >
                          <v-icon left>{{ mdi.key }}</v-icon>
                          {{ $t('Login') }}
                        </v-btn>
                        <v-btn text x-small @click="switchForm = !switchForm">
                          {{ $t("Don't have an account?") }} {{ $t('Sign up') }}
                        </v-btn>
                      </v-form>
                      <!-- Register -->
                      <v-form
                        v-if="switchForm"
                        ref="register"
                        v-model="valid"
                        :disabled="formDisabled"
                        lazy-validation
                      >
                        <v-text-field
                          v-model="displayName"
                          label="Name"
                          class="input-name"
                          placeholder="John Doe"
                          autocomplete="name"
                          :rules="[rules.requiredRule]"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="email"
                          label="E-mail"
                          class="input-email"
                          autocomplete="email"
                          :rules="[rules.requiredRule]"
                          :hint="
                            $t(
                              'A verification link will be sent to your email account'
                            )
                          "
                          persistent-hint
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="password"
                          autocomplete="new-password"
                          class="input-password"
                          :rules="[rules.requiredRule]"
                          label="Password"
                          type="password"
                          required
                        ></v-text-field>
                        <v-btn
                          v-show="user !== undefined && !user && networkOnLine"
                          block
                          color="primary"
                          large
                          class="mt-2 mb-4"
                          @click="validateRegister"
                        >
                          <v-icon left>{{ mdi.key }}</v-icon>
                          {{ $t('Register') }}
                        </v-btn>
                        <v-btn text x-small @click="switchForm = !switchForm">
                          {{ $t('Back') }}
                        </v-btn>
                      </v-form>

                      <div v-if="loginError">
                        <v-divider class="mt-2 mb-4"></v-divider>
                        <div>{{ loginError }}</div>
                      </div>
                      <div v-if="resetPassword">
                        <v-divider class="mt-2 mb-4"></v-divider>
                        <div class="mb-2">Forgot your password?</div>
                        <v-btn @click="connect('reset')">Reset password</v-btn>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row class="hidden-lg-and-down">
                    <v-col cols="12" md="12">
                      <v-btn
                        v-show="user !== undefined && !user && networkOnLine"
                        text
                        disabled
                        x-small
                        @click="connect('anonymous')"
                      >
                        <v-icon left>{{ mdi.incognito }}</v-icon>
                        {{ $t('Continue as Guest') }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </div>
            </v-card>
            <div
              class="
                text-caption
                grey--text
                text--darken-2
                font-weight-light
                mt-4
              "
            >
              {{ $t('Version {appVersion}', { appVersion: appVersion }) }} |
              &copy; 2019 - {{ year }} {{ appTitle }} |
              <router-link
                class="grey--text text--darken-2 font-weight-light"
                to="/privacy"
              >
                Privacy Policy
              </router-link>
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
import firebase from 'firebase/compat/app'
import { mdiGoogle, mdiFacebook, mdiIncognito, mdiKey } from '@mdi/js'
import { getImg } from '@/misc/helpers'

export default {
  data: () => ({
    loginError: null,
    resetPassword: false,
    year: new Date().getFullYear(),
    formDisabled: false,
    switchForm: false,
    valid: true,
    rules: {
      lengthRule: (len) => (v) =>
        (v || '').length <= len || `A maximum of  ${len} characters is allowed`,
      requiredRule: (v) => !!v || 'This field is required',
      emailRule: (v) =>
        !v ||
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        'E-mail must be valid',
      passwordRule: (value) => {
        // eslint-disable-next-line
        const pattern =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
        return (
          pattern.test(value) ||
          'Min. 8 characters with at least one capital letter, a number and a special character.'
        )
      }
    },
    displayName: '',
    email: '',
    password: '',
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
        const self = this
        if (!isNil(user)) {
          const redirectUrl = isNil(this.$route.query.redirectUrl)
            ? '/workouts'
            : this.$route.query.redirectUrl
          // eslint-disable-next-line func-names
          setTimeout(function () {
            self.$router.push(redirectUrl)
          }, 1000)
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations('authentication', ['setUser']),
    ...mapActions('authentication', ['login', 'triggerUpdateUser']),
    getImg,
    validateLogin() {
      this.$refs.login.validate()
      if (this.valid) {
        this.connect('login')
      }
    },
    validateRegister() {
      this.$refs.register.validate()
      if (this.valid) {
        this.connect('register')
      }
    },
    async connect(method) {
      this.loginError = null
      this.resetPassword = false
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
      if (method === 'login') {
        const self = this
        this.setUser(undefined)
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          // eslint-disable-next-line func-names
          .catch(function (error) {
            // Handle Errors here.
            self.errorCode = error.code
            if (self.errorCode === 'auth/wrong-password') {
              self.resetPassword = true
            } else {
              self.loginError = error.message
            }
            self.valid = false
            self.setUser(null)
          })
      }

      if (method === 'register') {
        const self = this
        this.setUser(undefined)
        firebase
          .auth()
          .createUserWithEmailAndPassword(self.email, self.password)
          .then((userData) => {
            userData.user.sendEmailVerification()
            userData.user.updateProfile({
              displayName: self.displayName
            })
          })
          // eslint-disable-next-line func-names
          .catch(function (error) {
            // Handle Errors here.
            self.loginError = error.message
            self.valid = false
            self.setUser(null)
          })
      }

      if (method === 'reset') {
        const self = this
        firebase
          .auth()
          .sendPasswordResetEmail(self.email)
          .then(() => {
            self.resetPassword = false
            self.loginError = this.$i18n.t('Password reset email link sent!')
          })
          .catch((err) => {
            this.loginError = err
          })
      }

      if (method === 'anonymous') {
        firebase
          .auth()
          .signInAnonymously()
          .then(() => {
            this.$router.push('/workouts')
          })
          .catch((err) => {
            this.loginError = err
            this.setUser(null)
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

<style lang="scss" scoped>
@import '~vuetify/src/styles/settings/_variables';

@media only screen and (max-width: 360px) {
  .social-login-text {
    text-indent: -9999px;
  }
  .logo-container {
    padding-top: 0 !important;
    padding-bottom: 16px !important;
  }
}

.logo-container {
  padding-top: 7.5vh;
  padding-bottom: 7.5vh;
}

.login-screen {
  background: linear-gradient(
    to bottom,
    #012f40 0%,
    #012f40 50%,
    white 50%,
    white 100%
  ); /* W3C */
}

.side-lines {
  display: flex;
  flex-direction: row;
  > span {
    margin-left: 4px;
  }
  &:before,
  &:after {
    content: '';
    flex: 1 1;
    border-bottom: 1px solid lightgray;
    margin: auto;
  }
  &:before {
    margin-right: 8px;
  }
  &:after {
    margin-left: 8px;
  }
}
</style>
