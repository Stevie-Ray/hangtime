<template>
  <v-layout :class="className">
    <v-app-bar color="primary" app fixed dark>
      <v-icon v-if="backButton" @click="$router.push(backLink)">{{
        mdi.arrowLeft
      }}</v-icon>
      <v-toolbar-title>
        {{ $t(name) }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <slot name="icons"></slot>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-row justify="center" align="start">
          <v-col cols="12">
            <slot></slot>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import { mdiArrowLeft } from '@mdi/js'

export default {
  name: 'AppContainer',
  props: {
    name: {
      type: String,
      default: ''
    },
    backButton: {
      type: Boolean,
      default: true
    },
    backLink: {
      type: Object,
      default: () => ({
        name: '/'
      })
    }
  },
  data: () => ({
    mdi: {
      arrowLeft: mdiArrowLeft
    }
  }),
  computed: {
    className() {
      if (this.name !== '') {
        return this.name.replace(/\s+/g, '-').toLowerCase()
      }
      return this.name
    }
  }
}
</script>
