<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePermission, useSupported } from '@vueuse/core'
import { getMessaging, getToken, deleteToken } from 'firebase/messaging'
import firebaseApp from '@/plugins/firebase'

import { useAuthenticationStore } from '@/stores/authentication.store'
const { updateUser } = useAuthenticationStore()

// const { isSupported } = useWebNotification()

const isSupported = useSupported(() => {
  if (!window || !('Notification' in window)) return false
  return true
})

const notificationAccess = usePermission('notifications')

const { user } = storeToRefs(useAuthenticationStore())

const currentToken = ref<string | undefined>(undefined)
const messaging = getMessaging(firebaseApp)
const vapidKey =
  'BLYKE2FC7Wjeyz_6m_wOc7rLUdRf4XGmJUhoIBKS4pfxaA8GP5dT5XCOkqCdTiayKlv_U-WwiDmkVPOlqHgowPE'

const requestPermission = async () => {
  try {
    // we just need to check if the permission is granted
    let permissionResult = notificationAccess.value as NotificationPermission
    console.log(permissionResult)
    if (permissionResult !== 'granted') {
      permissionResult = await Notification.requestPermission()
      console.log(permissionResult)
    }
    if (permissionResult === 'granted') {
      // Get FCM token
      const token = await getToken(messaging, { vapidKey })
      if (token) {
        currentToken.value = token
        // Save token to user settings
        if (user.value && !user.value.settings.token) {
          user.value.settings.token = currentToken.value
          updateUser()
        }
      }
    } else {
      console.warn('Notification permission not granted.')
    }
  } catch (err) {
    console.error('Error requesting FCM permission:', err)
  }
}

const removeToken = async () => {
  try {
    if (currentToken.value) {
      await deleteToken(messaging)
      currentToken.value = undefined
      // Remove token from user
      if (user.value && user.value.settings.token) {
        user.value.settings.token = currentToken.value
        updateUser()
      }
    }
  } catch (err) {
    console.error('Error deleting FCM token:', err)
  }
}

onMounted(() => {
  if (user.value && user.value.settings.token) {
    currentToken.value = user.value.settings.token
  }
})
</script>

<template>
  <div v-if="isSupported">
    <v-btn
      v-if="notificationAccess !== 'granted'"
      icon
      @click="requestPermission"
      title="Enable global notifications"
    >
      <v-icon>$bellOutline</v-icon>
    </v-btn>
    <v-btn v-else-if="!!currentToken" @click="removeToken" icon :title="currentToken">
      <v-icon>$bellRingOutline</v-icon>
    </v-btn>
    <v-btn
      v-else
      icon
      @click="requestPermission"
      title="Enable global notifications"
      style="opacity: 0.5"
    >
      <v-icon>$bellOffOutline</v-icon>
    </v-btn>
  </div>
</template>
