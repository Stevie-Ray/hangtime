<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthenticationStore } from '@/stores/authentication.store'

const { t } = useI18n()
const router = useRouter()

const { user } = storeToRefs(useAuthenticationStore())

const {
  extension = false,
  toolbarPrepend = false,
  hideFooter = false
} = defineProps<{
  extension?: boolean
  toolbarPrepend?: boolean
  toolbarPrependUrl?: string
  hideFooter?: boolean
}>()
</script>

<template>
  <v-app-bar app>
    <!--  toolbar prepend  -->
    <template v-if="toolbarPrepend" #prepend>
      <slot name="prepend">
        <router-link v-if="toolbarPrependUrl" :to="toolbarPrependUrl" style="color: inherit">
          <v-icon>$arrowLeft</v-icon>
        </router-link>
        <v-icon v-else @click="router.go(-1)">$arrowLeft</v-icon>
      </slot>
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

  <slot name="fab"></slot>

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
.v-toolbar {
  &__content,
  &__extension {
    margin-left: auto;
    margin-right: auto;
    @media (min-width: 960px) {
      max-width: 900px;
    }
    @media (min-width: 1280px) {
      max-width: 1200px;
    }
    @media (min-width: 1920px) {
      max-width: 1800px;
    }
    @media (min-width: 2560px) {
      max-width: 2400px;
    }
  }
  &__extension {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
