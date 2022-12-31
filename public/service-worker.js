import { precacheAndRoute } from 'workbox-precaching'
import { setCacheNameDetails } from 'workbox-core'
import { createHandlerBoundToURL } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'

setCacheNameDetails({ prefix: 'hangtime' })

precacheAndRoute(self.__WB_MANIFEST)

const handler = createHandlerBoundToURL('/')
const navigationRoute = new NavigationRoute(handler, {
  denylist: [
    new RegExp('/__/auth/handler'),
    new RegExp('/__/auth/iframe'),
    new RegExp('/.well-known')
  ]
})

registerRoute(navigationRoute)

registerRoute(
  /^https:\/\/fonts/,
  new StaleWhileRevalidate({
    cacheName: 'fonts.googleapis',
    plugins: []
  }),
  'GET'
)

addEventListener('message', (messageEvent) => {
  if (messageEvent.data === 'skipWaiting') return self.skipWaiting()
})
