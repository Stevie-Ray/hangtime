<script setup lang="ts">
import { useFirebaseCloudMessaging } from '@/composables/useFirebaseCloudMessaging'
import { usePermission } from '@vueuse/core'

const notificationAccess = usePermission('notifications')

const {
  iOSPushCapability,
  iOSNotificationAccess,
  currentToken,
  removeToken,
  requestPermission,
  pushCapability
} = useFirebaseCloudMessaging()
</script>

<template>
  <div v-if="pushCapability || iOSPushCapability">
    <v-btn
      v-if="
        (pushCapability && notificationAccess !== 'granted') ||
        (iOSPushCapability && iOSNotificationAccess !== 'granted')
      "
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
