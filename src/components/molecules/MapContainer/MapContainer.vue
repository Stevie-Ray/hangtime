<script setup lang="ts">
import { Loader } from '@googlemaps/js-api-loader'

const { height = 300, zoom = 0 } = defineProps<{
  height?: number
  zoom?: number
}>()

const loader = new Loader({
  apiKey: 'AIzaSyAR46a4_gq6kCubEmnCvwcLfuaR8DIHOp8',
  version: 'weekly'
})

/* eslint no-undef: 0 */
loader.load().then(async () => {
  const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary

  const map = new Map(document.querySelector('.map') as HTMLElement, {
    zoom: zoom,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    streetViewControl: false,
    scaleControl: false,
    zoomControlOptions: {
      // style: google.maps.ZoomControlStyle.LARGE
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
        stylers: [{ saturation: -100 }, { lightness: '50' }, { visibility: 'simplified' }]
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

  map.data.loadGeoJson('/src/helpers/companies.geojson')

  map.data.setStyle({
    icon: {
      url: '/img/icons/favicon.svg',
      scaledSize: new google.maps.Size(20, 20),
      anchor: new google.maps.Point(10, 10)
    }
  })

  map.data.addListener('click', (event: google.maps.Data.MouseEvent) => {
    const feature: google.maps.Data.Feature = event.feature

    const name: string | undefined = feature.getProperty('name') as string
    const latLng = event.latLng

    if (!latLng || !name) {
      return
    }
    bounds.extend(latLng)

    const infoWindowContent = `<a href="/brands/${encodeURIComponent(
      name.replace(/\s+/g, '-').toLowerCase()
    )}">${name}</a>`

    infowindow.setContent(infoWindowContent)
    infowindow.setPosition(latLng)
    infowindow.open(map)
  })
  map.fitBounds(bounds)
  // restore the zoom level after the map is done scaling
  const listener = google.maps.event.addListener(map, 'idle', () => {
    map.setZoom(zoom)
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
