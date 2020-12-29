<template>
  <v-layout class="profile">
    <v-app-bar color="primary" app fixed dark>
      <v-icon @click="$router.push({ name: 'settings' })">{{
        mdi.arrowLeft
      }}</v-icon>
      <v-toolbar-title>
        {{ $t('Notifications') }} ({{ $t('soon') }})
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row justify="center" align="start">
          <v-col cols="12">
            <v-list two-line>
              <v-list-item v-if="hasToken">
                <v-list-item-icon>
                  <v-icon color="primary lighten-1">{{ mdi.key }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Registration Token</v-list-item-title>
                  <v-list-item-subtitle>{{
                    currentToken
                  }}</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn icon small @click="copyText">
                    <v-icon>{{ mdi.copy }}</v-icon>
                  </v-btn>
                  <v-btn icon small @click="deleteToken">
                    <v-icon>{{ mdi.delete }}</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-list-item v-if="needsPermission">
                <v-list-item-icon>
                  <v-icon color="primary lighten-1">{{ mdi.key }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Needs Permission</v-list-item-title>
                  <v-list-item-subtitle>{{
                    currentToken
                  }}</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn @click="requestPermission">
                    Request Permission
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>

            <v-snackbar
              v-for="(message, index) in messages.filter(m => m.show)"
              :key="message.collapse_key"
              v-model="message.show"
              :timeout="-1"
              multi-line
              :style="`bottom: ${index * 68 + index * 10}px`"
              bottom
            >
              <div>
                <strong>{{ message.notification.title }}</strong>
              </div>
              <div>
                {{ message.notification.body }}
              </div>

              <template #action="{ attrs }">
                <v-btn text v-bind="attrs" @click="message.show = false">
                  {{ $t('Close') }}
                </v-btn>
              </template>
            </v-snackbar>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { getImg } from '@/misc/helpers'
import { mdiArrowLeft, mdiKey, mdiContentCopy, mdiDelete } from '@mdi/js'
import firebase from 'firebase/app'
import 'firebase/messaging'

export default {
  data: () => ({
    currentToken: '',
    messages: [],
    snackbar: true,
    copyAPI: navigator.clipboard,
    messaging: firebase.messaging(),
    hasToken: false,
    needsPermission: true,
    mdi: {
      arrowLeft: mdiArrowLeft,
      key: mdiKey,
      copy: mdiContentCopy,
      delete: mdiDelete
    }
  }),
  head: {
    title: {
      inner: 'Notifications'
    },
    meta: [
      {
        name: 'description',
        content: 'Notification Settings',
        id: 'desc'
      }
    ]
  },
  computed: {
    ...mapState('app', ['networkOnLine', 'vapidKey']),
    ...mapState('authentication', ['user', 'settings'])
  },
  mounted() {
    this.messaging.onMessage(payload => {
      console.log('Message received. ', payload)
      // [START_EXCLUDE]
      // Update the UI to include the received message.
      this.appendMessage(payload)
      // [END_EXCLUDE]
    })

    this.resetUI()
  },
  methods: {
    getImg,
    ...mapActions('authentication', ['triggerUpdateUser']),
    ...mapMutations('authentication', ['setUserNotificationToken']),
    resetUI() {
      this.clearMessages()
      this.showToken('loading...')
      // [START get_token]
      // Get registration token. Initially this makes a network call, once retrieved
      // subsequent calls to getToken will return from cache.
      this.messaging
        .getToken({ vapidKey: this.vapidKey })
        .then(currentToken => {
          if (currentToken) {
            this.sendTokenToServer(currentToken)
            this.updateUIForPushEnabled(currentToken)
          } else {
            // Show permission request.
            console.log(
              'No registration token available. Request permission to generate one.'
            )
            // Show permission UI.
            this.updateUIForPushPermissionRequired()
            this.setTokenSentToServer(false)
          }
        })
        .catch(err => {
          console.log('An error occurred while retrieving token. ', err)
          this.showToken('Error retrieving registration token. ', err)
          this.setTokenSentToServer(false)
        })
      // [END get_token]
    },
    /**
     * Show token in console and UI.
     * @param currentToken
     */
    showToken(currentToken) {
      //
      this.currentToken = currentToken
    },
    /**
     * Send the registration token your application server, so that it can:
     * - send messages back to this app
     * - subscribe/unsubscribe the token from topics
     * @param currentToken
     */
    sendTokenToServer(currentToken) {
      if (!this.isTokenSentToServer()) {
        console.log('Sending token to server...')
        this.setUserNotificationToken(currentToken)
        this.triggerUpdateUser()
        this.setTokenSentToServer(true)
      } else {
        console.log(
          "Token already sent to server so won't send it again " +
            'unless it changes'
        )
      }
    },
    isTokenSentToServer() {
      return window.localStorage.getItem('sentToServer') === '1'
    },
    setTokenSentToServer(sent) {
      window.localStorage.setItem('sentToServer', sent ? '1' : '0')
    },
    requestPermission() {
      console.log('Requesting permission...')
      // [START request_permission]
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.')
          // Retrieve a registration token for use with FCM.
          if (this.user && this.user.settings.token) {
            this.updateUIForPushEnabled(this.user.settings.token)
            return
          }
          // [START_EXCLUDE]
          // In many cases once an app has been granted notification permission,
          // it should update its UI reflecting this.
          this.resetUI()
          // [END_EXCLUDE]
        } else {
          console.log('Unable to get permission to notify.')
        }
      })
      // [END request_permission]
    },
    deleteToken() {
      // Delete registraion token.
      // [START delete_token]
      this.messaging
        .getToken()
        .then(currentToken => {
          this.messaging
            .deleteToken()
            .then(() => {
              console.log('Token deleted.', currentToken)
              this.setTokenSentToServer(false)
              // [START_EXCLUDE]
              // Once token is deleted update UI.
              this.resetUI()
              // [END_EXCLUDE]
            })
            .catch(err => {
              console.log('Unable to delete token. ', err)
            })
          // [END delete_token]
        })
        .catch(err => {
          console.log('Error retrieving registration token. ', err)
          this.showToken('Error retrieving registration token. ', err)
        })
    },
    copyText() {
      if (this.copyAPI) {
        this.copyAPI.writeText(this.currentToken)
      }
    },
    appendMessage(payload) {
      const obj = { ...payload, ...{ show: true } }
      this.messages.push(obj)
    },
    clearMessages() {
      this.messages = []
    },
    updateUIForPushEnabled(currentToken) {
      this.hasToken = true
      this.needsPermission = false
      this.showToken(currentToken)
    },
    updateUIForPushPermissionRequired() {
      this.hasToken = false
      this.needsPermission = true
    }
  }
}
</script>
