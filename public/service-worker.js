import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { setCacheNameDetails } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'

setCacheNameDetails({ prefix: 'hangtime' })

/**
 * The precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
// eslint-disable-next-line no-restricted-globals,no-underscore-dangle
precacheAndRoute(self.__WB_MANIFEST)

// Redirect to index.html if sw cannot find matching route
const handler = createHandlerBoundToURL('/index.html')
const navigationRoute = new NavigationRoute(handler, {
  /* Do not redirect routes used by firebase auth  */
  denylist: [/\/__\/auth\/handler/, /\/__\/auth\/iframe/, /\/.well-known/]
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

// eslint-disable-next-line no-restricted-globals,consistent-return
addEventListener('message', (messageEvent) => {
  // eslint-disable-next-line no-restricted-globals
  if (messageEvent.data === 'skipWaiting') return self.skipWaiting()
})
