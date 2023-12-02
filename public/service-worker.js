import {
  cleanupOutdatedCaches,
  precacheAndRoute,
  createHandlerBoundToURL
} from 'workbox-precaching'
import { setCacheNameDetails } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { RangeRequestsPlugin } from 'workbox-range-requests'
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies'

setCacheNameDetails({ prefix: 'hangtime' })

cleanupOutdatedCaches()
/**
 * The precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
// eslint-disable-next-line no-restricted-globals,no-underscore-dangle
precacheAndRoute(self.__WB_MANIFEST)

// Redirect to index.html if sw cannot find matching route
if (import.meta.env.MODE === 'production') {
  const handler = createHandlerBoundToURL('/index.html')
  const navigationRoute = new NavigationRoute(handler, {
    /* Do not redirect routes used by firebase auth  */
    denylist: [/\/__\/auth\/handler/, /\/__\/auth\/iframe/, /\/.well-known/]
  })

  registerRoute(navigationRoute)
}

registerRoute(
  ({ request }) => {
    const { destination } = request

    return destination === 'video' || destination === 'audio'
  },
  new CacheFirst({
    cacheName: 'media',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200]
      }),
      new RangeRequestsPlugin()
    ],
    matchOptions: {
      ignoreSearch: true,
      ignoreVary: true
    }
  })
)

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
