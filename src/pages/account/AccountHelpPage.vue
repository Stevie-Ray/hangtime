<script setup>
import { useI18n } from 'vue-i18n'
import { useHead } from '@vueuse/head'
import { useRouter } from 'vue-router'
import AppContainer from '@/components/organisms/AppContainer/AppContainer'

const { t } = useI18n()

const router = useRouter()

useHead({
  title: 'Help',
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container prepend>
    <template #prepend>
      <v-icon @click="router.go(-1)">mdi-arrow-left</v-icon>
    </template>

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
