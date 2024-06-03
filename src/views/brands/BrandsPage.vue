<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useUser } from '@/stores/user'
import countries from '@/helpers/countries'

import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import MapContainer from '@/components/molecules/MapContainer/MapContainer.vue'

import { Company } from '@/interfaces/user.interface'

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
      <v-icon @click="router.go(-1)">$arrowLeft</v-icon>
    </template>

    <template #title>
      {{ t('Supported Hangboards') }}
    </template>

    <template #icons> </template>

    <template #default>
      <v-container>
        <v-row>
          <v-col cols="12" md="5" order-md="last">
            <div class="sticky">
              <map-container :markers="getCompanies()" :zoom="1" />
            </div>
          </v-col>
          <v-col cols="12" md="7" order-md="first">
            <v-list lines="two">
              <v-list-item
                v-for="company in getCompanies()"
                :key="company.id"
                :to="
                  company.name
                    ? `/brands/${encodeURIComponent(
                        company.name.replace(/\s+/g, '-').toLowerCase()
                      )}`
                    : ''
                "
              >
                <v-list-item-title>
                  {{
                    company.country
                      ? countries.find((country) => country.alpha2 === company.country)?.emoji
                      : ''
                  }}&nbsp;{{ company.name }}
                  <v-chip
                    class="mx-2"
                    size="x-small"
                    v-if="company.id >= getCompanies().length - 5"
                  >
                    {{ $t('new') }}
                  </v-chip>
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ company.description }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-container>
</template>

<style lang="scss" scoped>
.sticky {
  @media (min-width: 960px) {
    position: sticky;
    top: 68px;
  }
}
</style>
