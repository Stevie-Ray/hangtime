<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthenticationStore } from '@/stores/authentication.store'
import TopBanner from '@/components/molecules/TopBanner/TopBanner.vue'
import InlineSvg from 'vue-inline-svg'
import imgLogo from '@/assets/logo.svg'
import { isDevelopment } from '@/helpers'

const { t } = useI18n()
const router = useRouter()

const { user } = storeToRefs(useAuthenticationStore())

const { toolbarPrepend = false, hideFooter = false } = defineProps<{
  toolbarPrepend?: boolean
  toolbarPrependUrl?: string
  hideFooter?: boolean
}>()
</script>

<template>
  <top-banner />

  <v-app-bar
    color="surface"
    app
    v-if="($slots.title || $slots.icons || $slots.extension) && $vuetify.display.smAndDown"
    class="d-md-none"
  >
    <!--  toolbar prepend  -->
    <template v-if="toolbarPrepend" #prepend>
      <slot name="prepend">
        <v-btn
          icon="$arrowLeft"
          @click="toolbarPrependUrl ? router.push(toolbarPrependUrl) : router.go(-1)"
        />
      </slot>
    </template>

    <!--  toolbar titles  -->
    <v-toolbar-title v-if="$slots.title" style="margin-inline-start: 0">
      <slot name="title"></slot>
    </v-toolbar-title>

    <!--  toolbar icons  -->
    <template #append v-if="$slots.icons">
      <slot name="icons"></slot>
    </template>

    <!--  toolbar tabs  -->
    <template v-if="$slots.extension" #extension>
      <slot name="extension" />
    </template>
  </v-app-bar>

  <v-navigation-drawer width="244" :rail="$vuetify.display.md" :permanent="$vuetify.display.md">
    <v-sheet class="d-flex justify-center align-center" height="128" width="100%">
      <inline-svg height="64" :src="imgLogo" width="100%" />
    </v-sheet>

    <v-list>
      <v-list>
        <v-list-item link prepend-icon="$clipboardTextMultiple" title="Feed" :to="'/feed'" />
        <v-list-item link prepend-icon="$timer" title="Trainen" :to="'/workouts'" />
        <v-list-item link prepend-icon="$trophy" title="Competitie" :to="'/leaderboard'" />
        <v-list-item
          link
          prepend-icon="$calendar"
          title="Missies"
          :to="'/quests'"
          v-if="isDevelopment()"
        />
        <v-list-item
          link
          prepend-icon="$account"
          title="Profiel"
          :to="'/profile'"
          v-if="isDevelopment()"
        />
        <v-list-item link prepend-icon="$cog" title="Instellingen" :to="'/account/general'" />
      </v-list>
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <div
      v-if="$slots.sticky"
      class="position-sticky bg-surface top-0 px-4 d-md-none"
      style="z-index: 1"
    >
      <slot name="sticky" />
    </div>

    <!-- router-view -->
    <v-container max-width="1056">
      <v-row>
        <v-col cols="12" :md="$slots.sidebar ? 8 : 12">
          <!-- router-view -->
          <slot />
        </v-col>

        <v-col v-if="$slots.sidebar" class="d-none d-md-block" cols="12" md="4">
          <slot name="sidebar" />
        </v-col>
      </v-row>
    </v-container>
  </v-main>

  <slot name="fab" />

  <footer v-if="user && !hideFooter" app class="d-md-none">
    <!-- bottom navigation -->
    <v-bottom-navigation grow mandatory>
      <v-btn :title="t('Feed')" :to="'/feed'">
        <v-icon>$clipboardTextMultiple</v-icon>
        <span class="d-sr-only">{{ t('Feed') }}</span>
      </v-btn>
      <v-btn :title="t('Workouts')" to="/workouts">
        <v-icon>$timer</v-icon>
        <span class="d-sr-only">{{ t('Workouts') }}</span>
      </v-btn>
      <v-btn :title="t('Competition')" to="/leaderboard">
        <v-icon>$trophy</v-icon>
        <span class="d-sr-only">{{ t('Competition') }}</span>
      </v-btn>
      <v-btn :title="t('Account')" to="/account">
        <v-icon>$cog</v-icon>
        <span class="d-sr-only">{{ t('Account') }}</span>
      </v-btn>
    </v-bottom-navigation>
  </footer>
</template>

<style lang="scss"></style>
