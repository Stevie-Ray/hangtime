<script setup>
import { computed } from 'vue'
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useUser } from '@/stores/user'

import { useAuthentication } from '@/stores/authentication'

import AppContainer from '@/components/organisms/AppContainer/AppContainer'
import { useRandomImage } from '@/helpers'
import ExerciseHangboard from '@/components/atoms/ExerciseHangboard/ExerciseHangboard.vue'
import countries from '@/helpers/countries'

const { user } = storeToRefs(useAuthentication())

const { t } = useI18n()

const { getCompanyByUrlKey } = useUser()

// router
const route = useRoute()
const router = useRouter()

const getCompany = computed(() => getCompanyByUrlKey(route.params.id))

useHead({
  title: user.value
    ? `${getCompany.value?.name}`
    : `${getCompany.value?.name} Hangboard Workouts`,
  meta: [{ name: 'description', content: getCompany.value?.description }]
})
</script>

<template>
  <app-container prepend>
    <template #prepend>
      <v-icon @click="router.push('/brands')">mdi-arrow-left</v-icon>
    </template>

    <template #title>
      {{
        `${
          getCompany?.country
            ? countries.find((country) => country.alpha2 === getCompany.country)
                ?.emoji
            : ''
        }`
      }}
      {{
        user ? `${getCompany?.name}` : `${getCompany?.name} Hangboard Workouts`
      }}
    </template>

    <template #default>
      <v-container>
        <v-row class="mb-4">
          <v-col cols="12">
            <v-card
              class="mx-auto"
              min-height="144"
              max-width="100%"
              theme="light"
            >
              <v-img :src="useRandomImage()" cover>
                <v-card-text>
                  <div class="text-subtitle-1 mb-4">
                    {{ getCompany?.description }}
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    :href="getCompany?.website"
                    class="mb-1"
                    color="text"
                    size="large"
                    variant="outlined"
                  >
                    {{ t('Website') }}
                  </v-btn>
                </v-card-actions>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card
              v-for="hangboard in getCompany?.hangboards"
              :key="hangboard.id"
              class="mb-8"
            >
              <v-card-text>
                <exercise-hangboard
                  :hangboard="{
                    company: getCompany.id,
                    hangboard: hangboard.id
                  }"
                >
                </exercise-hangboard>
              </v-card-text>
              <v-card-title>
                {{
                  user
                    ? `${hangboard.name}`
                    : `${getCompany.name} ${hangboard.name} Workouts`
                }}
              </v-card-title>
              <v-card-actions v-if="!user">
                <v-btn color="text" to="/login">
                  {{ hangboard.name }} {{ t('workouts') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-container>
</template>

<style lang="scss" scoped></style>
