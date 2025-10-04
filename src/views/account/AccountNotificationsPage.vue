<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import AccountMenu from '@/components/molecules/AccountMenu/AccountMenu.vue'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import NotificationBell from '@/components/molecules/NotificationBell/NotificationBell.vue'

const { t } = useI18n()

useHead({
  title: 'Notifications',
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container toolbar-prepend toolbar-prepend-url="/account">
    <template #title>
      {{ t('Notifications') }}
    </template>

    <template #default>
      <v-row>
        <v-col cols="12">
          <notification-bell />
        </v-col>
      </v-row>
    </template>

    <template #sidebar>
      <v-row>
        <v-col cols="12">
          <account-menu />
        </v-col>
      </v-row>
    </template>
  </app-container>
</template>

<script setup lang="ts"></script>
