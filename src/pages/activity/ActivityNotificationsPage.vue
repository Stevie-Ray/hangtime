<script setup>
import { reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { useRouter } from 'vue-router'

import { getMessaging, getToken, deleteToken, onMessage } from 'firebase/messaging'
import firebaseApp from '@/plugins/firebase'
import AppContainer from '@/components/organisms/AppContainer/AppContainer'

import { useAuthentication } from '@/stores/authentication'

const { user } = storeToRefs(useAuthentication())

const router = useRouter()

const { t } = useI18n()

const currentToken = ref('')
const messages = reactive([])
const copyAPI = navigator.clipboard
const messaging = getMessaging(firebaseApp)
const hasToken = ref(false)
const needsPermission = ref(true)
const vapidKey =
  'BLYKE2FC7Wjeyz_6m_wOc7rLUdRf4XGmJUhoIBKS4pfxaA8GP5dT5XCOkqCdTiayKlv_U-WwiDmkVPOlqHgowPE'

/**
 * Clear message values
 */
function clearMessages() {
  messages.value = []
}

/**
 * Show token in console and UI.
 * @param currentToken
 */
function showToken(token) {
  //
  currentToken.value = token
}

function isTokenSentToServer() {
  return window.localStorage.getItem('sentToServer') === '1'
}

function setTokenSentToServer(sent) {
  window.localStorage.setItem('sentToServer', sent ? '1' : '0')
}

/**
 * Send the registration token your application server, so that it can:
 * - send messages back to this app
 * - subscribe/unsubscribe the token from topics
 * @param currentToken
 */
// eslint-disable-next-line no-shadow
function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer()) {
    // eslint-disable-next-line no-console
    console.log('Sending token to server...', currentToken)
    user.value.settings.token = currentToken
    // TODO: triggerUpdateUser()
    setTokenSentToServer(true)
  } else {
    // eslint-disable-next-line no-console
    console.log("Token already sent to server so won't send it again unless it changes")
  }
}
// eslint-disable-next-line no-shadow
function updateUIForPushEnabled(currentToken) {
  hasToken.value = true
  needsPermission.value = false
  showToken(currentToken)
}

function updateUIForPushPermissionRequired() {
  hasToken.value = false
  needsPermission.value = true
}

/**
 * Resets the UI
 */
function resetUI() {
  if (messaging) {
    clearMessages()
    showToken('loading...')
    // [START get_token]
    // Get registration token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    getToken(messaging, { vapidKey })
      // eslint-disable-next-line no-shadow
      .then((currentToken) => {
        if (currentToken) {
          sendTokenToServer(currentToken)
          updateUIForPushEnabled(currentToken)
        } else {
          // Show permission request.
          // eslint-disable-next-line no-console
          console.log('No registration token available. Request permission to generate one.')
          // Show permission UI.
          updateUIForPushPermissionRequired()
          setTokenSentToServer(false)
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log('An error occurred while retrieving token. ', err)
        showToken('Error retrieving registration token. ', err)
        setTokenSentToServer(false)
      })
    // [END get_token]
  }
}

function requestPermission() {
  // eslint-disable-next-line no-console
  console.log('Requesting permission...')
  // [START request_permission]
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      // eslint-disable-next-line no-console
      console.log('Notification permission granted.')
      // Retrieve a registration token for use with FCM.
      if (user?.value?.settings?.token) {
        updateUIForPushEnabled(user.value.settings.token)
        return
      }
      // [START_EXCLUDE]
      // In many cases once an app has been granted notification permission,
      // it should update the UI reflecting it.
      resetUI()
      // [END_EXCLUDE]
    } else {
      // eslint-disable-next-line no-console
      console.log('Unable to get permission to notify.')
    }
  })
  // [END request_permission]
}

function deleteTokens() {
  // Delete registration token.
  // [START delete_token]
  if (messaging) {
    getToken(messaging)
      // eslint-disable-next-line no-shadow
      .then((currentToken) => {
        deleteToken(messaging)
          .then(() => {
            // eslint-disable-next-line no-console
            console.log('Token deleted.', currentToken)
            setTokenSentToServer(false)
            // [START_EXCLUDE]
            // Once token is deleted update UI.
            resetUI()
            // [END_EXCLUDE]
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.log('Unable to delete token. ', err)
          })
        // [END delete_token]
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log('Error retrieving registration token. ', err)
        showToken('Error retrieving registration token. ', err)
      })
  }
}

function copyText() {
  if (copyAPI) {
    copyAPI.writeText(currentToken.value)
  }
}

function appendMessage(payload) {
  const obj = { ...payload, ...{ show: true } }
  messages.push(obj)
}

if (messaging) {
  onMessage(messaging, (payload) => {
    // eslint-disable-next-line no-console
    console.log('Message received. ', payload)
    // [START_EXCLUDE]
    // Update the UI to include the received message.
    appendMessage(payload)
    // [END_EXCLUDE]
  })
}

resetUI()

useHead({
  title: 'Notifications',
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container prepend>
    <template #prepend>
      <v-icon @click="router.go(-1)">$arrowLeft</v-icon>
    </template>

    <template #title>
      {{ t('Notifications') }}
    </template>

    <template #default>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-list lines="two">
              <v-list-item v-if="hasToken">
                <template #prepend>
                  <v-icon icon="$key"></v-icon>
                </template>

                <v-list-item-title>Registration Token</v-list-item-title>
                <v-list-item-subtitle>{{ currentToken }}</v-list-item-subtitle>

                <v-list-item-action class="mt-2">
                  <v-btn
                    icon
                    color="text"
                    size="small"
                    variant="outlined"
                    @click="copyText"
                    class="mr-2"
                  >
                    <v-icon>$contentCopy</v-icon>
                  </v-btn>
                  <v-btn icon color="text" size="small" variant="outlined" @click="deleteTokens">
                    <v-icon>$delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-list-item v-if="needsPermission">
                <template #prepend>
                  <v-icon icon="$key"></v-icon>
                </template>

                <v-list-item-title>Needs Permission</v-list-item-title>
                <v-list-item-subtitle>{{ currentToken }}</v-list-item-subtitle>

                <v-list-item-action>
                  <v-btn @click="requestPermission"> Request Permission</v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>

            <v-snackbar
              v-for="(message, index) in messages.filter((m) => m.show)"
              :key="message.collapse_key"
              v-model="message.show"
              :style="`bottom: ${index * 68 + index * 10}px`"
              :timeout="-1"
              bottom
              multi-line
            >
              <div>
                <strong>{{ message.notification.title }}</strong>
              </div>
              <div>
                {{ message.notification.body }}
              </div>

              <template #actions="{ attrs }">
                <v-btn text v-bind="attrs" @click="message.show = false">
                  {{ t('Close') }}
                </v-btn>
              </template>
            </v-snackbar>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-container>
</template>

<style lang="scss" scoped></style>
