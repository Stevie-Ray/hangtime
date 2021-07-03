<template>
  <app-container name="Help" :back-link="{ path: '/settings' }">
    <v-list>
      <v-list-item href="mailto:mail@stevie-ray.nl">
        <v-list-item-title
          >{{ $t('Questions? Need help?') }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item to="/privacy">
        <v-list-item-title
          >{{ $t('Terms and Privacy Policy') }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </app-container>
</template>

<script>
import AppContainer from '@/components/molecules/AppContainer/AppContainer'

export default {
  components: {
    AppContainer
  },
  data: () => ({}),
  head: {
    title: {
      inner: 'Help'
    },
    meta: [
      {
        name: 'description',
        content: '',
        id: 'desc'
      }
    ]
  },
  computed: {},
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
