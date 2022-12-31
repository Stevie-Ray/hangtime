<script setup>
import { defineProps } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useAuthentication } from '@/stores/authentication'

const { t } = useI18n()
const { user } = storeToRefs(useAuthentication())

const props = defineProps({
  extension: {
    type: Boolean
  },
  prepend: {
    type: Boolean
  }
})
</script>

<template>
  <v-app-bar app>
    <template #prepend v-if="props.prepend">
      <slot name="prepend"></slot>
    </template>

    <!--  toolbar titles  -->
    <v-toolbar-title>
      <slot name="title"></slot>
    </v-toolbar-title>

    <!--  toolbar icons  -->
    <template #append>
      <slot name="icons"></slot>
    </template>

    <!--  toolbar tabs  -->
    <template #extension v-if="props.extension">
      <slot name="extension" />
    </template>
  </v-app-bar>

  <v-main>
    <!-- router-view -->
    <slot></slot>
  </v-main>

  <v-footer v-if="user" class="pa-0" app>
    <!-- bottom navigation -->
    <v-bottom-navigation grow>
      <v-btn to="/activity">
        <v-icon>mdi-clipboard-text-multiple</v-icon>
        <span>{{ t('Stats') }}</span>
      </v-btn>
      <v-btn to="/workouts">
        <v-icon>mdi-timer</v-icon>
        <span>{{ t('Workouts') }}</span>
      </v-btn>
      <v-btn to="/account">
        <v-icon>mdi-account-box</v-icon>
        <span>{{ t('Account') }}</span>
      </v-btn>
    </v-bottom-navigation>
  </v-footer>
</template>