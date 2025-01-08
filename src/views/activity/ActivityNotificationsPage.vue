<script setup lang="ts">
import { ref, Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'

import { getMessaging, getToken, deleteToken, onMessage, MessagePayload } from 'firebase/messaging'
import firebaseApp from '@/plugins/firebase'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'

import { useAuthenticationStore } from '@/stores/authentication.store'

const { updateUser } = useAuthenticationStore()

const { user } = storeToRefs(useAuthenticationStore())

const { t } = useI18n()

const currentToken = ref('')
const messages: Ref<ExtendedMessagePayload[]> = ref([])
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
function showToken(token: string) {
  //
  currentToken.value = token
}

function isTokenSentToServer() {
  return window.localStorage.getItem('sentToServer') === '1'
}

function setTokenSentToServer(sent: boolean) {
  window.localStorage.setItem('sentToServer', sent ? '1' : '0')
}

/**
 * Send the registration token your application server, so that it can:
 * - send messages back to this app
 * - subscribe/unsubscribe the token from topics
 * @param currentToken
 */

function sendTokenToServer(currentToken: string) {
  if (!isTokenSentToServer()) {
    console.log('Sending token to server...', currentToken)
    if (user.value) {
      user.value.settings.token = currentToken
      updateUser()
    }
    setTokenSentToServer(true)
  } else {
    console.log("Token already sent to server so won't send it again unless it changes")
  }
}

function updateUIForPushEnabled(currentToken: string) {
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
      .then((currentToken) => {
        if (currentToken) {
          sendTokenToServer(currentToken)
          updateUIForPushEnabled(currentToken)
        } else {
          // Show permission request.

          console.log('No registration token available. Request permission to generate one.')
          // Show permission UI.
          updateUIForPushPermissionRequired()
          setTokenSentToServer(false)
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err)
        showToken('Error retrieving registration token.')
        setTokenSentToServer(false)
      })
    // [END get_token]
  }
}

function requestPermission() {
  console.log('Requesting permission...')
  // [START request_permission]
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
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
      .then((currentToken) => {
        deleteToken(messaging)
          .then(() => {
            console.log('Token deleted.', currentToken)
            setTokenSentToServer(false)
            // [START_EXCLUDE]
            // Once token is deleted update UI.
            resetUI()
            // [END_EXCLUDE]
          })
          .catch((err) => {
            console.log('Unable to delete token. ', err)
          })
        // [END delete_token]
      })
      .catch((err) => {
        console.log('Error retrieving registration token. ', err)
        showToken('Error retrieving registration token.')
      })
  }
}

function copyText() {
  if (copyAPI) {
    copyAPI.writeText(currentToken.value)
  }
}

interface ExtendedMessagePayload extends MessagePayload {
  show: boolean
}

function appendMessage(payload: MessagePayload) {
  const obj: ExtendedMessagePayload = { ...payload, ...{ show: true } }
  messages.value.push(obj)
}

if (messaging) {
  onMessage(messaging, (payload: MessagePayload) => {
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
  <app-container toolbar-prepend toolbar-prepend-url="/account">
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
              :key="message.collapseKey"
              v-model="message.show"
              :style="`bottom: ${index * 68 + index * 10}px`"
              :timeout="-1"
              bottom
              multi-line
            >
              <div>
                <strong>{{ message.notification?.title }}</strong>
              </div>
              <div>
                {{ message.notification?.body }}
              </div>

              <template v-slot:actions>
                <v-btn variant="text" @click="message.show = false">
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
