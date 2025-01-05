import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useOnline } from '@vueuse/core'

export const useAppStore = defineStore('app', () => {
  const online = useOnline()
  const SWRegistrationForNewContent = ref<ServiceWorkerRegistration | null>(null)
  const refreshingApp = ref<boolean>(false)

  /**
   * Trigger service worker skipWating so the new service worker can take over.
   * This will also trigger a window refresh (see /src/helpers/register-service-worker.js)
   */
  function serviceWorkerSkipWaiting() {
    if (
      SWRegistrationForNewContent.value === undefined ||
      SWRegistrationForNewContent.value === null
    ) {
      return
    }
    refreshingApp.value = true
    if (SWRegistrationForNewContent.value.waiting !== null) {
      SWRegistrationForNewContent.value.waiting.postMessage('skipWaiting')
    }
  }

  const newAppContent = computed(
    () =>
      !(
        SWRegistrationForNewContent.value === undefined ||
        SWRegistrationForNewContent.value === null
      )
  )

  return {
    online,
    SWRegistrationForNewContent,
    refreshingApp,
    serviceWorkerSkipWaiting,
    newAppContent
  }
})
