<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useWebNotification } from '@vueuse/core'
import { getMessaging, onMessage, NotificationPayload } from 'firebase/messaging'
import firebaseApp from '@/plugins/firebase'

const { isSupported } = useWebNotification()

const messaging = getMessaging(firebaseApp)

const dialog = ref(false)
const notification = ref<NotificationPayload | undefined>()

onMounted(() => {
  onMessage(messaging, (payload) => {
    dialog.value = true
    notification.value = payload.notification
  })
})
</script>

<template>
  <div v-if="isSupported">
    <v-dialog v-if="notification" v-model="dialog" max-width="500">
      <v-card
        prepend-icon="$bellOutline"
        :text="notification.body"
        :title="notification.title"
        :image="notification.image"
      >
        <template v-slot:actions>
          <v-btn class="ms-auto" text="Ok" @click="dialog = false"></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
