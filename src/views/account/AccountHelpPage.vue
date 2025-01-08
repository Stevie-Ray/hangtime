<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'

const { t } = useI18n()

useHead({
  title: 'Help',
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container toolbar-prepend toolbar-prepend-url="/account">
    <template #title>
      {{ t('Help') }}
    </template>

    <template #default>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-list>
              <v-list-item href="mailto:mail@stevie-ray.nl">
                <v-list-item-title>
                  {{ t('Questions? Need help?') }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item to="/privacy">
                <v-list-item-title>
                  {{ t('Terms and Privacy Policy') }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item to="/brands">
                <v-list-item-title>
                  {{ t('Supported Hangboards') }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-container>
</template>

<style lang="scss" scoped></style>
