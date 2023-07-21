<script setup>
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider
} from 'firebase/auth'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import InlineSvg from 'vue-inline-svg'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import { event } from 'vue-gtag'
import { useAuthentication } from '@/stores/authentication'
import { useApp } from '@/stores/app'

const { t } = useI18n()

const { user, error } = storeToRefs(useAuthentication())

const { networkOnLine } = storeToRefs(useApp())

// single ref
watch(networkOnLine, (status) => {
  if (error) {
    if (!status)
      error.value =
        'Please check your connection, HangTime is not available offline.'
    else error.value = null
  }
})

const route = useRoute()
const router = useRouter()
const auth = getAuth()

watch(
  user,
  () => {
    // check if user is set
    if (!(user.value === null || user.value === undefined)) {
      // check if route has redirect url or set homepage
      const redirectUrl =
        route.query.redirectUrl === null ||
        route.query.redirectUrl === undefined
          ? '/workouts'
          : route.query.redirectUrl
      // push redirectUrl
      router.push(redirectUrl)
    }
  },
  { immediate: true }
)

const resetPassword = ref(false)
const year = new Date().getFullYear()
const appVersion = '2.0.0'
const formDisabled = ref(false)
const switchForm = ref(false)
const valid = ref(true)
const login = ref(null)
const register = ref(null)

// form fields
const email = ref('')
const password = ref('')
const displayName = ref('')

const socials = [
  {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2'
  },
  {
    id: 'google',
    name: 'Google',
    color: '#DB4437'
  },
  {
    id: 'apple',
    name: 'Apple',
    color: '#000000'
  }
]

const rules = {
  length: (len) => (v) =>
    (v || '').length <= len || `A maximum of  ${len} characters is allowed`,
  required: (v) => !!v || 'This field is required',
  email: (v) =>
    !v ||
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
    'E-mail must be valid',
  password: (value) => {
    // eslint-disable-next-line
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
    return (
      pattern.test(value) ||
      'Min. 8 characters with at least one capital letter, a number and a special character.'
    )
  }
}

const getCookieValue = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return ''
}

const connect = async (method) => {
  error.value = undefined
  resetPassword.value = false
  let provider = null

  if (method === 'google') {
    provider = new GoogleAuthProvider()
  }

  if (method === 'facebook') {
    provider = new FacebookAuthProvider()
  }

  if (method === 'apple') {
    provider = new OAuthProvider('apple.com')
    provider.addScope('email')
    provider.addScope('name')
  }

  if (method === 'login') {
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        // Signed in
        const firebaseUser = userCredential.user
        // ...
        console.log(firebaseUser)
      })
      .catch((err) => {
        error.value = err.message
        console.log(err)
        valid.value = false
      })
  }

  if (method === 'register') {
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(async (userCredential) => {
        // Signed in
        const firebaseUser = userCredential.user
        await sendEmailVerification(firebaseUser)
        await updateProfile(firebaseUser, {
          displayName: displayName.value
        })
      })
      .catch((err) => {
        error.value = err.message
        console.log(err)
        valid.value = false
      })
  }

  if (method === 'reset') {
    sendPasswordResetEmail(auth, email.value)
      .then(() => {
        error.value = t('Password reset email link sent!')
      })
      .catch((err) => {
        error.value = err
      })
  }

  if (method === 'anonymous') {
    signInAnonymously(auth)
      .then(() => {
        router.push('/workouts')
      })
      .catch((err) => {
        error.value = err
      })
  }

  // measure login event
  event('login', { method })

  if (provider !== null) {
    try {
      // Firebase signing with popup is faster than redirect,
      // but we can't use it on mobile because it's not well-supported
      // when app is running as standalone on ios & android
      if (getCookieValue('app-platform') === 'iOS App Store') {
        await signInWithRedirect(auth, provider)
      } else {
        await signInWithPopup(auth, provider)
      }
    } catch (err) {
      error.value = err.toString()
    }
  }
}

const validateLogin = () => {
  login.value.validate()
  if (valid.value) {
    connect('login')
  }
}

const validateRegister = () => {
  register.value.validate()
  if (valid.value) {
    connect('register')
  }
}

useHead({
  title: 'Login',
  meta: [{ name: 'description', content: 'Sign in or sign up' }]
})
</script>

<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" class="text-center">
        <v-row no-gutters justify="center" class="logo-container">
          <v-col class="flex-grow-0">
            <inline-svg
              height="44"
              width="44"
              class="mr-1"
              :src="require(`@/assets/logo.svg`)"
              alt="logo"
            />
          </v-col>
          <v-col class="flex-grow-0">
            <div class="text-h4">HangTime</div>
          </v-col>
        </v-row>

        <v-card variant="flat">
          <v-card-text>
            <v-row
              v-show="user === undefined"
              align="center"
              justify="center"
              class="fill-height"
            >
              <v-col cols="12" class="text-center">
                <div>
                  <v-progress-circular
                    :size="48"
                    color="primary"
                    indeterminate
                  ></v-progress-circular>
                </div>
                <div class="pa-4">
                  {{ t('Loading...') }}
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <div class="text-center text-h5 pb-2">
                  {{ t('Hi there!') }} 👋
                </div>
                <div class="text-body-2 text-center pb-4">
                  {{
                    t(
                      'Sign in to join HangTime, a community driven hangboard training app, start getting stronger and climb even harder.'
                    )
                  }}
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col
                cols="12"
                md="4"
                v-for="social in socials"
                :key="social.id"
                class="text-center"
              >
                <v-btn
                  v-show="user !== undefined && !user"
                  :color="social.color"
                  :disabled="!networkOnLine"
                  class="text-white"
                  block
                  size="large"
                  :prepend-icon="`mdi-${social.id}`"
                  @click="connect(social.id)"
                >
                  <span>Sign in with {{ social.name }}</span>
                </v-btn>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <div class="text-center subtitle-2 text-uppercase side-lines">
                  {{ t('Or') }}
                </div>
              </v-col>
            </v-row>

            <v-row class="form-sign-in">
              <v-col cols="12">
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
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    class="input-password"
                    autocomplete="current-password"
                    :rules="[rules.required]"
                    label="Password"
                    type="password"
                    required
                  ></v-text-field>

                  <v-btn
                    v-show="user !== undefined && !user && networkOnLine"
                    block
                    size="large"
                    data-test="login-btn"
                    class="mt-2 mb-4"
                    prepend-icon="mdi-key"
                    @click="validateLogin"
                  >
                    {{ t('Login') }}
                  </v-btn>
                  <v-btn
                    variant="text"
                    size="x-small"
                    @click="switchForm = !switchForm"
                  >
                    {{ t("Don't have an account?") }} {{ t('Sign up') }}
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
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="email"
                    label="E-mail"
                    class="input-email"
                    autocomplete="email"
                    :rules="[rules.required]"
                    :hint="
                      t(
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
                    :rules="[rules.required]"
                    label="Password"
                    type="password"
                    required
                  ></v-text-field>
                  <v-btn
                    v-show="user !== undefined && !user && networkOnLine"
                    block
                    size="large"
                    class="mt-2 mb-4"
                    prepend-icon="mdi-key"
                    @click="validateRegister"
                  >
                    {{ t('Register') }}
                  </v-btn>
                  <v-btn
                    variant="text"
                    size="x-small"
                    @click="switchForm = !switchForm"
                  >
                    {{ t('Back') }}
                  </v-btn>
                </v-form>

                <div v-if="resetPassword">
                  <v-divider class="mt-2 mb-4"></v-divider>
                  <div class="mb-2">Forgot your password?</div>
                  <v-btn @click="connect('reset')">Reset password</v-btn>
                </div>
              </v-col>
            </v-row>

            <v-row class="d-none">
              <v-col cols="12" md="12">
                <v-btn
                  v-show="user !== undefined && !user && networkOnLine"
                  text
                  disabled
                  x-small
                  prepend-icon="mdi-icognito"
                  @click="connect('anonymous')"
                >
                  {{ t('Continue as Guest') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-footer
          class="text-caption text-grey-darken-2 font-weight-light mt-4"
        >
          <span
            >v{{ appVersion }} | &copy; 2019 - {{ year }} HangTime |&nbsp;
          </span>
          <router-link
            class="text-grey-darken-2 font-weight-light"
            to="/privacy"
          >
            Privacy
          </router-link>
          <span>&nbsp;|&nbsp;</span>
          <router-link
            class="text-grey-darken-2 font-weight-light"
            to="/brands"
          >
            Hangboards
          </router-link>
        </v-footer>
      </v-col>
    </v-row>
    <v-alert
      class="position-fixed"
      closable
      v-if="error"
      :text="error"
      type="error"
      style="left: 8px; right: 8px; bottom: 8px; z-index: 1007"
    ></v-alert>
  </v-container>
</template>

<style lang="scss" scoped>
@import '~vuetify/_settings';

.logo-container {
  padding-top: 1.25vh;
  padding-bottom: 1.25vh;
  @media #{map-get($display-breakpoints, 'md-and-up')} {
    padding-top: 5vh;
    padding-bottom: 5vh;
  }
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
