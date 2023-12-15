<script setup>
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useAuthentication } from '@/stores/authentication'

const { t } = useI18n()
const { user } = storeToRefs(useAuthentication())

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  extension: {
    type: Boolean,
    default: false
  },
  prepend: {
    type: Boolean,
    default: false
  },
  hideFooter: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <v-app-bar app>
    <template v-if="prepend" #prepend>
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
    <template v-if="extension" #extension>
      <slot name="extension" />
    </template>
  </v-app-bar>

  <v-main>
    <!-- router-view -->
    <slot></slot>
  </v-main>

  <v-footer v-if="user && !hideFooter" app class="py-0">
    <!-- bottom navigation -->
    <v-bottom-navigation grow mandatory style="bottom: 0">
      <v-btn to="/activity">
        <v-icon>$clipboardTextMultiple</v-icon>
        <span>{{ t('Stats') }}</span>
      </v-btn>
      <v-btn to="/workouts">
        <v-icon>$timer</v-icon>
        <span>{{ t('Workouts') }}</span>
      </v-btn>
      <v-btn to="/account">
        <v-icon>$accountBox</v-icon>
        <span>{{ t('Account') }}</span>
      </v-btn>
    </v-bottom-navigation>
  </v-footer>
</template>

<style lang="scss">
.v-toolbar__content {
  margin-right: auto;
  margin-left: auto;
  @media (min-width: 960px) {
    max-width: 900px;
  }
  @media (min-width: 1280px) {
    max-width: 1200px;
  }
}
</style>
