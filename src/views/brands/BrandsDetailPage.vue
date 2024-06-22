<script setup lang="ts">
import { computed, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useRandomImage } from '@/helpers'
import countries from '@/helpers/countries'

import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import ExerciseHangboard from '@/components/atoms/ExerciseHangboard/ExerciseHangboard.vue'
import MapContainer from '@/components/molecules/MapContainer/MapContainer.vue'

import { useAuthenticationStore } from '@/stores/authentication'

import { useAppStore } from '@/stores/app'
import { Hangboard } from '@/interfaces/user.interface'

const { t } = useI18n()

const { user } = storeToRefs(useAuthenticationStore())

const { online } = storeToRefs(useAppStore())

const { getCompanyByUrlKey, getHangboardByIds } = useUserStore()

// router
const route = useRoute()
const router = useRouter()

const getCompany = computed(() => getCompanyByUrlKey(route.params.id.toString()))

const sortedHangboards = getCompany.value?.hangboards.sort((a: Hangboard, b: Hangboard) =>
  a.name.localeCompare(b.name)
)

const loginButton = ref(true)

const onScroll = () => {
  loginButton.value = window.scrollY >= 0
}

useHead({
  title: user.value ? `${getCompany.value?.name}` : `${getCompany.value?.name} Hangboard Training`,
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
            ? countries.find((country) => country.alpha2 === getCompany?.country)?.emoji
            : ''
        }`
      }}
      {{ user ? `${getCompany?.name}` : `${getCompany?.name} Hangboard Training` }}
    </template>

    <template #default>
      <v-container>
        <v-row :class="!user ? 'mb-10' : 'mb-4'">
          <v-col cols="12" md="5" order-md="last">
            <div class="sticky">
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
                      :disabled="!online"
                    >
                      {{ t('Website') }}
                    </v-btn>
                    <v-spacer v-if="getCompany?.socials" />
                    <v-btn
                      v-if="getCompany?.socials?.facebook"
                      :href="getCompany?.socials?.facebook"
                      target="_blank"
                      icon="$facebook"
                      :disabled="!online"
                    />
                    <v-btn
                      v-if="getCompany?.socials?.instagram"
                      :href="getCompany?.socials?.instagram"
                      target="_blank"
                      icon="$instagram"
                      :disabled="!online"
                    />
                  </v-card-actions>
                </v-img>
              </v-card>
            </div>
          </v-col>
          <v-col cols="12" md="7" order-md="first">
            <v-card v-for="hangboard in sortedHangboards" :key="hangboard.id" class="mb-8">
              <v-card-text>
                <exercise-hangboard
                  v-if="
                    getCompany &&
                    hangboard &&
                    getHangboardByIds(getCompany.id, hangboard.id)?.image !==
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
                <v-chip v-if="hangboard.type">{{ t(hangboard.type) }}</v-chip>
              </v-card-title>
              <v-card-subtitle v-if="getCompany?.name">
                {{ getCompany.name }}
              </v-card-subtitle>
              <v-card-actions>
                <template v-if="!user || hangboard.url">
                  <v-btn color="text" disabled v-if="hangboard.size">
                    <div class="text-caption">
                      <span v-if="hangboard.size.x"> {{ hangboard.size.x }}mm </span>
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
            <map-container v-if="getCompany?.location" :markers="[getCompany]" :zoom="6" />
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template #fab>
      <div v-if="!user" v-scroll="onScroll">
        <v-fab-transition>
          <v-fab
            :active="loginButton"
            to="/login"
            location="bottom end"
            position="fixed"
            size="x-large"
            extended
            app
            :text="t('Start training')"
            style="bottom: 56px"
          ></v-fab>
        </v-fab-transition>
      </div>
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
.v-responsive:deep(.v-responsive__content) {
  display: flex;
  flex-direction: column;
}
</style>

<style lang="scss">
.v-fab__container {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  align-self: initial !important;
  justify-content: flex-end;
}
</style>
