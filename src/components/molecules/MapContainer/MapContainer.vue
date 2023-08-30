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

  const map = new Map(document.getElementById('map'), {
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
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0)
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
        // eslint-disable-next-line func-names,no-shadow
        (function (marker) {
          // eslint-disable-next-line func-names
          return function () {
            infowindow.setContent(item.name)
            infowindow.open(map, marker)
          }
        })(marker)
      )
    }
  }
  // now fit the map to the newly inclusive bounds
  map.fitBounds(bounds)
  // restore the zoom level after the map is done scaling
  // eslint-disable-next-line no-var,no-undef,func-names
  const listener = google.maps.event.addListener(map, 'idle', function () {
    map.setZoom(props.zoom)
    // eslint-disable-next-line no-undef
    google.maps.event.removeListener(listener)
  })
})
</script>

<template>
  <div id="map" class="rounded-lg" :style="{ height: height + 'px' }"></div>
</template>

<style lang="scss">
.gm-style .gm-style-iw-d {
  color: black;
}
</style>
