<template>
  <v-layout class="help">
    <v-app-bar color="primary" app fixed dark>
      <v-icon @click="$router.push({ name: 'settings' })">{{
        mdi.arrowLeft
      }}</v-icon>
      <v-toolbar-title>
        {{ $t('Help') }}
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row justify="center" align="start">
          <v-col cols="12">
            <v-list>
              <v-list-item href="mailto:mail@stevie-ray.nl">
                <v-list-item-title>{{
                  $t('Questions? Need help?')
                }}</v-list-item-title>
              </v-list-item>
              <v-list-item to="/privacy">
                <v-list-item-title>{{
                  $t('Terms and Privacy Policy')
                }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import { mdiArrowLeft } from '@mdi/js'

export default {
  data: () => ({
    mdi: {
      arrowLeft: mdiArrowLeft
    }
  }),
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
