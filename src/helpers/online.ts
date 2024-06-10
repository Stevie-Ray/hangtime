import { useAppStore } from '@/stores/app'

const app = useAppStore()

app.networkOnLine = navigator.onLine

window.addEventListener('offline', () => {
  app.networkOnLine = false
})

window.addEventListener('online', () => {
  app.networkOnLine = true
})
