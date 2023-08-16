<script setup>
import { computed } from 'vue'
import { useHead } from '@vueuse/head'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useUser } from '@/stores/user'

import { useAuthentication } from '@/stores/authentication'

import AppContainer from '@/components/organisms/AppContainer/AppContainer'
import { useRandomImage } from '@/helpers'
import ExerciseHangboard from '@/components/atoms/ExerciseHangboard/ExerciseHangboard.vue'
import countries from '@/helpers/countries'
import { useApp } from '@/stores/app'

const { user } = storeToRefs(useAuthentication())

const { networkOnLine } = storeToRefs(useApp())

const { getCompanyByUrlKey, getHangboardImageByIds } = useUser()

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
            <v-card class="mx-auto" max-width="100%" theme="light">
              <v-img :src="useRandomImage()" cover>
                <v-card-text style="height: 112px">
                  <div class="text-subtitle-1 mb-4">
                    {{ getCompany?.description }}
                  </div>
                </v-card-text>

                <v-card-actions class="mt-auto">
                  <v-btn
                    v-if="getCompany?.url"
                    color="text"
                    variant="outlined"
                    :href="getCompany?.url"
                    target="_blank"
                    prepend-icon="mdi-web"
                    :disabled="!networkOnLine"
                  >
                    Website
                  </v-btn>
                  <v-spacer v-if="getCompany?.socials" />
                  <v-btn
                    v-if="getCompany?.socials?.facebook"
                    :href="getCompany?.socials?.facebook"
                    target="_blank"
                    icon="mdi-facebook"
                    :disabled="!networkOnLine"
                  />
                  <v-btn
                    v-if="getCompany?.socials?.instagram"
                    :href="getCompany?.socials?.instagram"
                    target="_blank"
                    icon="mdi-instagram"
                    :disabled="!networkOnLine"
                  />
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
                  v-if="
                    getHangboardImageByIds(getCompany.id, hangboard.id) !==
                    'hangboards/NOTFOUND.svg'
                  "
                  :hangboard="{
                    company: getCompany.id,
                    hangboard: hangboard.id
                  }"
                >
                </exercise-hangboard>
              </v-card-text>
              <v-card-title class="d-flex justify-space-between">
                <div v-if="hangboard.name">{{ hangboard.name }}</div>
                <v-chip v-if="hangboard.type">{{ hangboard.type }}</v-chip>
              </v-card-title>
              <v-card-subtitle>
                {{ getCompany.name }}
              </v-card-subtitle>
              <v-card-actions>
                <template v-if="!user || hangboard.url">
                  <v-btn color="text" disabled v-if="hangboard.size">
                    <div class="text-caption">
                      <span v-if="hangboard.size.x">
                        {{ hangboard.size.x }}mm
                      </span>
                      <span v-if="hangboard.size.y">
                        &nbsp;x
                        {{ hangboard.size.y }}mm
                      </span>
                      <span v-if="hangboard.size.z">
                        &nbsp;x
                        {{ hangboard.size.z }}mm
                      </span>
                    </div>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    size="small"
                    v-if="hangboard.url"
                    color="text"
                    icon="mdi-open-in-new"
                    :href="hangboard.url"
                    target="_blank"
                  >
                  </v-btn>
                  <v-btn
                    v-if="!user"
                    :disabled="
                      getHangboardImageByIds(getCompany.id, hangboard.id) ===
                      'hangboards/NOTFOUND.svg'
                    "
                    color="text"
                    to="/login"
                    icon="mdi-login"
                  />
                </template>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-container>
</template>

<style lang="scss" scoped>
.v-responsive:deep(.v-responsive__content) {
  display: flex;
  flex-direction: column;
}
</style>
