import { useApp } from '@/stores/app'

const app = useApp()

app.networkOnLine = navigator.onLine

window.addEventListener('offline', () => {
  app.networkOnLine = false
})

window.addEventListener('online', () => {
  app.networkOnLine = true
})
