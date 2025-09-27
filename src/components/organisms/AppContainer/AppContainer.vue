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
  <v-app-bar app v-if="$slots.title || $slots.icons || $slots.extension">
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
    <v-toolbar-title v-if="$slots.title">
      <slot name="title"></slot>
    </v-toolbar-title>

    <!--  toolbar icons  -->
    <template #append v-if="$slots.icons">
      <slot name="icons"></slot>
    </template>

    <!--  toolbar tabs  -->
    <template v-if="extension && $slots.extension" #extension>
      <slot name="extension" />
    </template>
  </v-app-bar>

  <v-navigation-drawer width="244">
    <v-sheet class="d-flex justify-center align-center" height="128" width="100%">
      <v-img height="64" src="@/assets/logo.svg" width="100%" />
    </v-sheet>

    <v-list>
      <v-list>
        <v-list-item link prepend-icon="mdi-home" title="Feed" :to="'/feed'" />
        <v-list-item link prepend-icon="mdi-dumbbell" title="Trainen" :to="'/'" />
        <v-list-item link prepend-icon="mdi-podium" title="Competitie" :to="'/leaderboard'" />
        <v-list-item link prepend-icon="mdi-calendar" title="Missies" :to="'/quests'" />
        <v-list-item link prepend-icon="mdi-account" title="Profiel" :to="'/profile'" />
        <v-list-item link prepend-icon="mdi-cog" title="Instellingen" :to="'/settings'" />
      </v-list>
    </v-list>
  </v-navigation-drawer>

  <v-main>
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
        <v-icon>$home</v-icon>
        <span class="d-sr-only">{{ t('Feed') }}</span>
      </v-btn>
      <v-btn :title="t('Stats')" to="/activity">
        <v-icon>$clipboardTextMultiple</v-icon>
        <span class="d-sr-only">{{ t('Stats') }}</span>
      </v-btn>
      <v-btn :title="t('Workouts')" to="/workouts">
        <v-icon>$timer</v-icon>
        <span class="d-sr-only">{{ t('Workouts') }}</span>
      </v-btn>
      <v-btn :title="t('Account')" to="/account">
        <v-icon>$accountBox</v-icon>
        <span class="d-sr-only">{{ t('Account') }}</span>
      </v-btn>
    </v-bottom-navigation>
  </footer>
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
