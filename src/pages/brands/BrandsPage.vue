<script setup>
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useUser } from '@/stores/user'
import countries from '@/helpers/countries'

import AppContainer from '@/components/organisms/AppContainer/AppContainer'

const { t } = useI18n()

const { getCompanies } = useUser()

const router = useRouter()

useHead({
  title: t('Supported Hangboards'),
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container prepend>
    <template #prepend>
      <v-icon @click="router.go(-1)">mdi-arrow-left</v-icon>
    </template>

    <template #title>
      {{ t('Supported Hangboards') }}
    </template>

    <template #icons> </template>

    <template #default>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-list lines="two">
              <v-list-item
                :to="
                  company.name
                    ? `/brands/${encodeURIComponent(
                        company.name.replace(/\s+/g, '-').toLowerCase()
                      )}`
                    : null
                "
                v-for="company in getCompanies"
                :key="company.id"
                :title="`${
                  company.country
                    ? countries.find(
                        (country) => country.alpha2 === company.country
                      )?.emoji
                    : ''
                } ${company.name}`"
                :subtitle="company.description"
              >
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-container>
</template>

<style lang="scss" scoped></style>
