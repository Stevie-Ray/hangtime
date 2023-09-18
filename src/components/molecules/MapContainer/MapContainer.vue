<script setup>
import { Loader } from '@googlemaps/js-api-loader'

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  markers: {
    type: Array
  },
  height: {
    type: Number,
    default: 300
  },
  zoom: {
    type: Number || null,
    default: null
  }
})

const loader = new Loader({
  apiKey: 'AIzaSyAR46a4_gq6kCubEmnCvwcLfuaR8DIHOp8',
  version: 'weekly'
})

/* eslint no-undef: 0 */
loader.load().then(async () => {
  const { Map } = await google.maps.importLibrary('maps')

  const map = new Map(document.querySelector('.map'), {
    zoom: props.zoom,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    streetViewControl: false,
    scaleControl: false,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.LARGE
    },
    styles: [
      {
        featureType: 'administrative',
        elementType: 'all',
        stylers: [{ saturation: '-100' }]
      },
      {
        featureType: 'administrative.province',
        elementType: 'all',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [{ saturation: -100 }, { lightness: 65 }, { visibility: 'on' }]
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          { saturation: -100 },
          { lightness: '50' },
          { visibility: 'simplified' }
        ]
      },
      {
        featureType: 'road',
        elementType: 'all',
        stylers: [{ saturation: '-100' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'all',
        stylers: [{ visibility: 'simplified' }]
      },
      {
        featureType: 'road.arterial',
        elementType: 'all',
        stylers: [{ lightness: '30' }]
      },
      {
        featureType: 'road.local',
        elementType: 'all',
        stylers: [{ lightness: '40' }]
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ hue: '#ffff00' }, { lightness: -25 }, { saturation: -97 }]
      },
      {
        featureType: 'water',
        elementType: 'labels',
        stylers: [{ lightness: -25 }, { saturation: -100 }]
      }
    ]
  })
  const bounds = new google.maps.LatLngBounds()
  const infowindow = new google.maps.InfoWindow()

  let marker
  // eslint-disable-next-line no-restricted-syntax,no-unused-vars
  for (const [i, item] of props.markers.entries()) {
    if (item.location) {
      const icon = {
        url: '/img/icons/favicon.svg',
        scaledSize: new google.maps.Size(20, 20),
        anchor: new google.maps.Point(10, 10)
      }
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(item.location.lat, item.location.lon),
        map,
        title: item.name,
        icon
      })

      bounds.extend(marker.position)

      google.maps.event.addListener(
        marker,
        'click',
        // eslint-disable-next-line no-shadow
        ((marker) => () => {
          infowindow.setContent(
            `<a href="
                  ${
                    item.name
                      ? `/brands/${encodeURIComponent(
                          item.name.replace(/\s+/g, '-').toLowerCase()
                        )}`
                      : null
                  }
                ">${item.name}</a>`
          )
          infowindow.open(map, marker)
        })(marker)
      )
    }
  }
  // now fit the map to the newly inclusive bounds
  map.fitBounds(bounds)
  // restore the zoom level after the map is done scaling
  const listener = google.maps.event.addListener(map, 'idle', () => {
    map.setZoom(props.zoom)
    google.maps.event.removeListener(listener)
  })
})
</script>

<template>
  <div class="map rounded-lg" :style="{ height: height + 'px' }"></div>
</template>

<style lang="scss">
.gm-style {
  .gm-style-iw-d {
    &,
    & a {
      color: black;
      text-decoration: none;
    }
  }

  a[href^="https://maps.google.com/maps"]
  {
    opacity: 0.5;
  }

  .gmnoprint a,
  .gmnoprint span,
  .gm-style-cc {
    display: none;
  }
}
</style>
