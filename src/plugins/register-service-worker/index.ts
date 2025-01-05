import { register } from 'register-service-worker'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app.store'

const { SWRegistrationForNewContent } = storeToRefs(useAppStore())
const path = import.meta.env.MODE === 'production' ? '/service-worker.js' : '/dev-sw.js?dev-sw'

register(path, {
  registrationOptions: { type: import.meta.env.MODE === 'production' ? 'classic' : 'module' },
  ready() {
    console.log(
      'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
    )
  },
  registered() {
    console.log('Service worker has been registered.')
  },
  cached() {
    console.log('Content has been cached for offline use.')
  },
  updatefound() {
    console.log('New content is downloading.')
  },
  updated(reg) {
    console.log('New content is available; please refresh.')
    SWRegistrationForNewContent.value = reg
  },
  offline() {
    console.log('No internet connection found. App is running in offline mode.')
  },
  error(error) {
    console.error('Error during service worker registration:', error)
  }
})

if ('serviceWorker' in navigator) {
  let refreshing = false
  // This is triggered when a new service worker take over
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return
    refreshing = true

    window.location.reload()
  })
}
