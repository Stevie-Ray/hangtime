<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user.store'
import countries from '@/helpers/countries'

import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import MapContainer from '@/components/molecules/MapContainer/MapContainer.vue'

const { t } = useI18n()

const { getCompanies } = useUserStore()

useHead({
  title: t('Supported Hangboards'),
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container toolbar-prepend toolbar-prepend-url="/">
    <template #title>
      {{ t('Supported Hangboards') }}
    </template>

    <template #default>
      <v-container>
        <v-row>
          <v-col cols="12" md="5" order-md="last">
            <div class="sticky">
              <map-container :zoom="1" />
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
                    {{ t('new') }}
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
