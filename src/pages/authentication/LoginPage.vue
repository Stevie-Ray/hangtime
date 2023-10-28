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
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { event } from 'vue-gtag'
import { useAuthentication } from '@/stores/authentication'
import { useApp } from '@/stores/app'
import { useUser } from '@/stores/user'

const { t } = useI18n()

const { getCompanies, getHangboards } = useUser()

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
const appVersion = process.env.VUE_APP_VERSION
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

const usps = [
  {
    title: `Personalized Hangboard Training Plans`,
    subtitle: `Unlock the power of hangboard training with HangTime the #1 hangboard training app. Tailor your workouts, target specific finger strength, and track progress over time for optimized hangboard training. Join the largest hangboard training community with access to ${getHangboards?.length} hangboards from ${getCompanies?.length} top brands. Elevate your climbing game with precision.`,
    prependIcon: `$podiumGold`
  },
  {
    title: `Community-Driven Training Hub`,
    subtitle: `Become part of our vibrant hangboard training community. Share your workouts and access routines crafted by fellow climbers. Collaborate, inspire, and learn from each other as you progress in your hangboard training journey.`,
    prependIcon: `$accountGroup`
  },
  {
    title: `Data-Driven Progress Tracking`,
    subtitle: `Stay motivated and monitor your hangboard training progress over time. Our app provides detailed insights into your performance, allowing you to identify strengths and weaknesses. With data at your fingertips, you can fine-tune your training plans and climb to new heights with confidence.`,
    prependIcon: `$chartLine`
  },
  {
    title: `Multi-Hangboard Support`,
    subtitle: `Diversify your training by adding multiple hangboards from your gym to your app profile. This feature allows you to adapt and switch up your routines easily, ensuring a well-rounded approach to your hangboard training.`,
    prependIcon: `$cardMultiple`
  },
  {
    title: `Extensive Hangboard Catalog`,
    subtitle: `Access the most extensive hangboard catalog available, featuring ${getHangboards?.length} hangboards from ${getCompanies?.length} trusted brands. No matter your hangboard training preference, our app provides the variety you need to reach your peak climbing potential.`,
    prependIcon: `$trophy`
  }
]

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

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
        // eslint-disable-next-line no-console
        console.log(firebaseUser)
      })
      .catch((err) => {
        error.value = err.message
        // eslint-disable-next-line no-console
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
        // eslint-disable-next-line no-console
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
  title: 'Hangboard Training App',
  meta: [
    {
      name: 'description',
      content:
        'Discover the ultimate community-driven climbing app - Boost finger strength, personalized workouts, & max gains. Join the climbing revolution! 💪🧗'
    }
  ]
})
</script>

<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" class="text-center">
        <v-row no-gutters justify="center" class="logo-container">
          <v-col class="flex-grow-0" style="margin-bottom: -12px">
            <img
              class="logo"
              :src="require(`@/assets/logo.svg`)"
              alt="HangTime Logo"
              height="44"
              width="44"
            />
          </v-col>
          <v-col class="flex-grow-0">
            <h2 class="text-h4">HangTime</h2>
          </v-col>
          <v-col cols="12">
            <h1 class="text-subtitle-2">Hangboard Training App</h1>
          </v-col>
        </v-row>

        <v-card variant="flat">
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <div class="text-center text-h5 pb-2">
                  {{ t('Hi there!') }} 👋
                </div>
                <div
                  class="text-body-2 text-center mx-auto"
                  style="max-width: 400px"
                >
                  {{
                    t(
                      'Sign in to HangTime, the community-driven hangboard training app, for stronger climbing.'
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
                  v-show="!user"
                  :color="social.color"
                  :disabled="!networkOnLine"
                  class="text-white"
                  block
                  size="large"
                  :prepend-icon="`$${social.id}`"
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
                    block
                    size="large"
                    data-test="login-btn"
                    class="mt-2 mb-4"
                    prepend-icon="$key"
                    :disabled="!(user == undefined && !user && networkOnLine)"
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
                    :prepend-icon="$key"
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
                  prepend-icon="$incognito"
                  @click="connect('anonymous')"
                >
                  {{ t('Continue as Guest') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card variant="flat" class="mt-4 text-left">
          <v-card-title tag="h2" class="text-center mt-4">
            HangTime - Hangboard Training
          </v-card-title>
          <v-card-subtitle tag="h3" class="text-center" id="usp-title">
            Elevate Your Climbing with Precision Training
          </v-card-subtitle>
          <v-card-text>
            <v-list
              :items="usps"
              item-props
              lines="three"
              aria-labelledby="usp-title"
              tabindex="0"
            >
              <v-list-item
                v-for="(usp, index) in usps"
                :value="usp"
                :key="index"
                role="option"
              >
                <template v-slot:prepend>
                  <v-icon :icon="usp.prependIcon"></v-icon>
                </template>
                <v-list-item-title tag="h2">{{ usp.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ usp.subtitle }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="justify-center mb-4">
            <v-btn
              variant="outlined"
              color="text"
              size="large"
              @click="scrollToTop"
              >Start training</v-btn
            >
          </v-card-actions>
        </v-card>

        <v-footer
          class="text-caption text-grey justify-center font-weight-light mt-4"
        >
          <span
            >v{{ appVersion }} | &copy; 2019 - {{ year }} HangTime |&nbsp;
          </span>
          <router-link class="text-grey font-weight-light" to="/privacy">
            Privacy
          </router-link>
          <span>&nbsp;|&nbsp;</span>
          <router-link class="text-grey font-weight-light" to="/brands">
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

.v-theme--dark {
  .logo {
    filter: invert(100%);
  }
}

.logo-container {
  padding-bottom: 20px;
  @media #{map-get($display-breakpoints, 'md-and-up')} {
    padding-top: 5vh;
    padding-bottom: 5vh;
  }
}

.text-caption {
  font-size: 0.625rem !important;
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
