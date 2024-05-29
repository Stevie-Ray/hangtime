import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useApp = defineStore('app', () => {
  const networkOnLine = ref(true)
  const SWRegistrationForNewContent = ref(null)
  const refreshingApp = ref(false)

  // action
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
    SWRegistrationForNewContent.value.waiting?.postMessage('skipWaiting')
  }

  // getter
  const newAppContent = computed(
    () =>
      !(
        SWRegistrationForNewContent.value === undefined ||
        SWRegistrationForNewContent.value === null
      )
  )

  return {
    networkOnLine,
    SWRegistrationForNewContent,
    refreshingApp,
    serviceWorkerSkipWaiting,
    newAppContent
  }
})
