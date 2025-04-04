<script setup lang="ts">
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'

import { useAuthenticationStore } from '@/stores/authentication.store'

const { t } = useI18n()

const { user, error } = storeToRefs(useAuthenticationStore())

const route = useRoute()
const router = useRouter()

watch(
  user,
  () => {
    // check if user is defined
    if (user.value === undefined) return
    // check if redirectUrl is current url
    if (route.query.redirectUrl === route.path) {
      router.push('/')
    }
    // check if user is logged in
    const redirectUrl =
      user.value === null || user.value === undefined
        ? `/login?redirectUrl=${route.query.redirectUrl}`
        : `${route.query.redirectUrl}`
    // go to redirect url
    router.push(redirectUrl)
  },
  { immediate: true }
)

useHead({
  title: t('Loading...'),
  meta: [{ name: 'description', content: t('Loading...') }]
})
</script>

<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" class="text-center">
        <div>
          <v-progress-circular :size="48" color="text" indeterminate></v-progress-circular>
        </div>
        <div class="px-4 py-4">
          {{ t('Loading...') }}
        </div>
      </v-col>
    </v-row>
    <v-alert
      class="position-fixed"
      closable
      v-if="error"
      :text="error"
      type="error"
      style="left: 8px; right: 8px; bottom: 8px; z-index: 1007"
    ></v-alert>
  </v-container>
</template>
