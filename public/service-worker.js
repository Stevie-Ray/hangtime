import { precacheAndRoute } from 'workbox-precaching'
import { setCacheNameDetails } from 'workbox-core'
import { createHandlerBoundToURL } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'

setCacheNameDetails({ prefix: 'hangtime' })

/**
 * The precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
precacheAndRoute(self.__WB_MANIFEST)

// Redirect to index.html if sw cannot find matching route
const handler = createHandlerBoundToURL('/index.html')
const navigationRoute = new NavigationRoute(handler, {
  /* Do not redirect routes used by firebase auth  */
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
