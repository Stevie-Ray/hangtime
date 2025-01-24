<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getMessaging, onMessage, NotificationPayload } from 'firebase/messaging'
import firebaseApp from '@/plugins/firebase'
import { useFirebaseCloudMessaging } from '@/composables/useFirebaseCloudMessaging'

const { oniOSMessage } = useFirebaseCloudMessaging()

const messaging = getMessaging(firebaseApp)

const dialog = ref(false)
const notification = ref<NotificationPayload | undefined>()

const showNotification = (newNotification: NotificationPayload) => {
  notification.value = newNotification
  dialog.value = true
}

onMounted(() => {
  onMessage(messaging, (payload) => {
    showNotification(payload.notification as NotificationPayload)
  })

  oniOSMessage((payload: NotificationPayload) => {
    showNotification(payload)
  })
})
</script>

<template>
  <div>
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
