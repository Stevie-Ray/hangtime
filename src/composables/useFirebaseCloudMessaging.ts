import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { usePermission, useSupported } from '@vueuse/core'
import { getMessaging, getToken, deleteToken, type NotificationPayload } from 'firebase/messaging'
import firebaseApp from '@/plugins/firebase'
import { useAuthenticationStore } from '@/stores/authentication.store'

/**
 * Declare global window interface for iOS native app
 */
declare global {
  interface Window {
    webkit?: {
      messageHandlers?: Record<string, { postMessage: (msg: unknown) => void }>
    }
  }
}

export function useFirebaseCloudMessaging() {
  const iOSPushCapability = ref(false)
  const iOSNotificationAccess = ref<PermissionState>('prompt')

  const { updateUser } = useAuthenticationStore()

  const { user } = storeToRefs(useAuthenticationStore())

  const notificationAccess = usePermission('notifications')

  const currentToken = ref<string | undefined>(undefined)
  const messaging = getMessaging(firebaseApp)
  const vapidKey =
    'BLYKE2FC7Wjeyz_6m_wOc7rLUdRf4XGmJUhoIBKS4pfxaA8GP5dT5XCOkqCdTiayKlv_U-WwiDmkVPOlqHgowPE'

  const pushCapability = useSupported(() => {
    if (!window || !('Notification' in window)) return false
    return true
  })

  const requestPermission = async () => {
    // iOS native app
    if (iOSPushCapability.value) {
      pushPermissionRequest()
      // we can not await the event listener, so we directly request the token
      pushTokenRequest()
    } else {
      // web browser
      try {
        // we just need to check if the permission is granted
        let permissionResult = notificationAccess.value as NotificationPermission
        console.log(permissionResult)
        if (permissionResult !== 'granted') {
          permissionResult = await Notification.requestPermission()
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
  }

  const removeToken = async () => {
    try {
      if (currentToken.value) {
        await deleteToken(messaging)
        currentToken.value = undefined
        // Remove token from user
        if (user.value && user.value.settings.token) {
          delete user.value.settings.token
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

    if (
      window.webkit &&
      window.webkit.messageHandlers?.['push-permission-request'] &&
      window.webkit.messageHandlers?.['push-permission-state']
    ) {
      iOSPushCapability.value = true
    }

    pushPermissionState()

    // Listen for push-permission-request
    window.addEventListener('push-permission-request', (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent?.detail) {
        switch (customEvent.detail) {
          case 'granted':
            iOSNotificationAccess.value = 'granted'
            break
          default:
            iOSNotificationAccess.value = 'denied'
            break
        }
      }
    })

    // Listen for push-permission-state
    window.addEventListener('push-permission-state', (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent?.detail) {
        switch (customEvent.detail) {
          case 'notDetermined':
            // permission not asked
            iOSNotificationAccess.value = 'prompt'
            break
          case 'denied':
            // permission denied
            iOSNotificationAccess.value = 'denied'
            break
          case 'authorized':
          case 'ephemeral':
          case 'provisional':
            // permission granted
            iOSNotificationAccess.value = 'granted'
            break
          case 'unknown':
          default:
            // something wrong
            console.error(customEvent.detail)
            break
        }
      }
    })

    // Listen for push-notification
    window.addEventListener('push-notification', (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent?.detail) {
        const payload = customEvent.detail
        if (payload.aps?.alert) {
          const notification = {
            title: payload.aps.alert.title,
            body: payload.aps.alert.body
          }
          // Call the oniOSMessage callback with the payload
          oniOSMessageCallback(notification)
        } else {
          // Print payload if data is not an alert
          alert(JSON.stringify(payload))
        }
      }
    })

    // Listen for push-token
    window.addEventListener('push-token', async (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent?.detail) {
        currentToken.value = customEvent.detail
        if (user.value && !user.value.settings.token) {
          user.value.settings.token = currentToken.value
          updateUser()
        }
      }
    })
  })

  // Simulate the onMessage callback
  let oniOSMessageCallback: (payload: NotificationPayload) => void

  /**
   * Set the oniOSMessage callback
   * @param callback - The callback to set
   */
  function oniOSMessage(callback: (payload: NotificationPayload) => void) {
    oniOSMessageCallback = callback
  }

  /**
   * Request native push permission from iOS app
   */
  function pushPermissionRequest() {
    if (iOSPushCapability.value) {
      window.webkit?.messageHandlers?.['push-permission-request']?.postMessage(
        'push-permission-request'
      )
    }
  }

  /**
   * Request native push permission state from iOS app
   */
  function pushPermissionState() {
    if (iOSPushCapability.value) {
      window.webkit?.messageHandlers?.['push-permission-state']?.postMessage(
        'push-permission-state'
      )
    }
  }

  /**
   * Subscribe to a topic using iOS native app
   * @param topic - The topic to subscribe to
   * @param eventValue - The value to subscribe to
   * @param unsubscribe - Whether to unsubscribe from the topic
   */

  function pushSubscribeTopic(topic: string, eventValue: unknown, unsubscribe?: boolean) {
    if (iOSPushCapability.value) {
      window.webkit?.messageHandlers?.['push-subscribe']?.postMessage(
        JSON.stringify({ topic, eventValue, unsubscribe })
      )
    }
  }

  /**
   * Push token request to iOS native app
   */
  function pushTokenRequest() {
    if (iOSPushCapability.value) {
      window.webkit?.messageHandlers?.['push-token']?.postMessage('push-token')
    }
  }

  return {
    pushCapability,
    currentToken,
    iOSPushCapability,
    iOSNotificationAccess,
    requestPermission,
    removeToken,
    pushPermissionRequest,
    pushPermissionState,
    pushSubscribeTopic,
    pushTokenRequest,
    oniOSMessage
  }
}
