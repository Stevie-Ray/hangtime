<script setup>
import { computed, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUser } from '@/stores/user'
import { useRandomImage } from '@/helpers'
import countries from '@/helpers/countries'

import AppContainer from '@/components/organisms/AppContainer/AppContainer'
import ExerciseHangboard from '@/components/atoms/ExerciseHangboard/ExerciseHangboard'
import MapContainer from '@/components/molecules/MapContainer/MapContainer'

import { useAuthentication } from '@/stores/authentication'

import { useApp } from '@/stores/app'

const { t } = useI18n()

const { user } = storeToRefs(useAuthentication())

const { networkOnLine } = storeToRefs(useApp())

const { getCompanyByUrlKey, getHangboardByIds } = useUser()

// router
const route = useRoute()
const router = useRouter()

const getCompany = computed(() => getCompanyByUrlKey(route.params.id))

const loginButton = ref(true)

const onScroll = () => {
  loginButton.value = window.scrollY >= 0
}

useHead({
  title: user.value
    ? `${getCompany.value?.name}`
    : `${getCompany.value?.name} Hangboard Training`,
  meta: [{ name: 'description', content: getCompany.value?.description }]
})
</script>

<template>
  <app-container prepend>
    <template #prepend>
      <v-icon @click="router.push('/brands')">$arrowLeft</v-icon>
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
        user ? `${getCompany?.name}` : `${getCompany?.name} Hangboard Training`
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
                    prepend-icon="$web"
                    :disabled="!networkOnLine"
                  >
                    Website
                  </v-btn>
                  <v-spacer v-if="getCompany?.socials" />
                  <v-btn
                    v-if="getCompany?.socials?.facebook"
                    :href="getCompany?.socials?.facebook"
                    target="_blank"
                    icon="$facebook"
                    :disabled="!networkOnLine"
                  />
                  <v-btn
                    v-if="getCompany?.socials?.instagram"
                    :href="getCompany?.socials?.instagram"
                    target="_blank"
                    icon="$instagram"
                    :disabled="!networkOnLine"
                  />
                </v-card-actions>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
        <v-row :class="{ 'mb-10': !user }">
          <v-col cols="12">
            <v-card
              v-for="hangboard in getCompany?.hangboards"
              :key="hangboard.id"
              class="mb-8"
            >
              <v-card-text>
                <exercise-hangboard
                  v-if="
                    getHangboardByIds(getCompany.id, hangboard.id).image !==
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
                    icon="$openInNew"
                    :href="hangboard.url"
                    target="_blank"
                  >
                  </v-btn>
                </template>
              </v-card-actions>
            </v-card>
            <!-- company map -->
            <map-container
              v-if="getCompany.location"
              :markers="[getCompany]"
              :zoom="6"
            />
          </v-col>
        </v-row>
        <div v-if="!user" v-scroll="onScroll" class="fab text-end">
          <div class="mx-4">
            <v-fab-transition>
              <v-btn
                v-show="loginButton"
                to="/login"
                size="x-large"
                rounded="lg"
              >
                {{ t('Start training') }}
              </v-btn>
            </v-fab-transition>
          </div>
        </div>
      </v-container>
    </template>
  </app-container>
</template>

<style lang="scss" scoped>
.v-responsive:deep(.v-responsive__content) {
  display: flex;
  flex-direction: column;
}

.fab {
  bottom: 0px;
  z-index: 1007;
  transform: translateY(0%);
  position: fixed;
  height: 80px;
  left: 0;
  width: calc((100% - 0px) - 0px);
  pointer-events: none;
  .v-btn {
    background-color: rgb(var(--v-theme-accent));
    z-index: 1008;
    --v-btn-height: 56px;
    pointer-events: initial;
  }
}
</style>
