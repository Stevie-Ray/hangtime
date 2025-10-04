<script setup lang="ts">
import { useHead } from '@unhead/vue'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import AccountMenu from '@/components/molecules/AccountMenu/AccountMenu.vue'

useHead({
  title: 'Account',
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container>
    <template #default>
      <v-row>
        <v-col cols="12"> <account-menu /></v-col>
      </v-row>
    </template>
  </app-container>
</template>
