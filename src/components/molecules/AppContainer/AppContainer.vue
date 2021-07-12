<template>
  <div class="layout" :class="className">
    <v-app-bar
      color="primary"
      app
      fixed
      dark
      :tabs="tabs"
      :extended="extended"
      :hide-on-scroll="hideOnScroll"
    >
      <slot name="back-link">
        <v-icon v-if="backButton" @click="$router.push(backLink)">
          {{ mdi.arrowLeft }}
        </v-icon>
      </slot>

      <slot name="avatar" />

      <v-toolbar-title>
        <slot name="title">
          {{ $t(name) }}
        </slot>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <slot name="icons"></slot>

      <template v-if="extended" #extension>
        <slot name="extension" />
      </template>
    </v-app-bar>
    <v-main>
      <v-container class="fill-height">
        <v-row justify="center" align="start" class="fill-height">
          <v-col cols="12">
            <slot></slot>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
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
    },
    tabs: {
      type: Boolean,
      default: false
    },
    extended: {
      type: Boolean,
      default: false
    },
    hideOnScroll: {
      type: Boolean,
      default: false
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
