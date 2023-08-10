<script setup>
import { useHead } from '@vueuse/head'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import AppContainer from '@/components/organisms/AppContainer/AppContainer'
import { useUser } from '@/stores/user'
import { useAuthentication } from '@/stores/authentication'
import { useWorkouts } from '@/stores/workouts'
import ExerciseHangboard from '@/components/atoms/ExerciseHangboard/ExerciseHangboard'
import HangboardAdd from '@/components/molecules/dialog/HangboardAdd/HangboardAdd'
import { useApp } from '@/stores/app'
import countries from '@/helpers/countries'

const { t } = useI18n()

const { getUserHangboards, getUserHangboardSelectedId } = storeToRefs(useUser())

const { getHangboardByIds, getCompanyById } = useUser()

const { networkOnLine } = storeToRefs(useApp())

const { fetchCommunityWorkouts } = useWorkouts()

const { updateUser } = useAuthentication()

const { user } = storeToRefs(useAuthentication())

const setHangboard = (index) => {
  user.value.settings.selected = index
  updateUser()
  fetchCommunityWorkouts()
}

const removeHangboard = (index) => {
  user.value.settings.hangboards.splice(index, 1)
  user.value.settings.selected = 0
  updateUser()
}

const router = useRouter()

useHead({
  title: 'Hangboards',
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container prepend>
    <template #prepend>
      <v-icon @click="router.go(-1)">mdi-arrow-left</v-icon>
    </template>

    <template #title>
      {{ t('Hangboards') }}
    </template>

    <template #icons>
      <hangboard-add></hangboard-add>
    </template>

    <template #default>
      <v-container>
        <v-row>
          <v-col cols="12">
            <div v-if="getUserHangboards?.length > 0">
              <v-card
                v-for="(hangboard, index) in getUserHangboards"
                :key="index"
                class="mb-8"
                @click="setHangboard(index)"
                :variant="
                  getUserHangboardSelectedId === index ? 'outlined' : 'elevated'
                "
              >
                <v-card-text>
                  <exercise-hangboard
                    :hangboard="{
                      company: hangboard.company,
                      hangboard: hangboard.hangboard
                    }"
                  >
                  </exercise-hangboard>
                </v-card-text>
                <v-card-title class="d-flex justify-space-between">
                  <div
                    v-if="
                      getHangboardByIds(hangboard.company, hangboard.hangboard)
                        .name
                    "
                  >
                    {{
                      getHangboardByIds(hangboard.company, hangboard.hangboard)
                        .name
                    }}
                  </div>
                  <v-chip
                    v-if="
                      getHangboardByIds(hangboard.company, hangboard.hangboard)
                        .type
                    "
                  >
                    {{
                      getHangboardByIds(hangboard.company, hangboard.hangboard)
                        .type
                    }}
                  </v-chip>
                </v-card-title>
                <v-card-subtitle>
                  {{
                    getCompanyById(hangboard.company).country
                      ? countries.find(
                          (country) =>
                            country.alpha2 ===
                            getCompanyById(hangboard.company).country
                        )?.emoji
                      : ''
                  }}&nbsp;{{ getCompanyById(hangboard.company).name }}
                </v-card-subtitle>
                <v-card-actions>
                  <v-btn
                    color="text"
                    disabled
                    v-if="
                      getHangboardByIds(hangboard.company, hangboard.hangboard)
                        .size
                    "
                  >
                    <div class="text-caption">
                      <span
                        v-if="
                          getHangboardByIds(
                            hangboard.company,
                            hangboard.hangboard
                          ).size.x
                        "
                      >
                        {{
                          getHangboardByIds(
                            hangboard.company,
                            hangboard.hangboard
                          ).size.x
                        }}mm
                      </span>
                      <span
                        v-if="
                          getHangboardByIds(
                            hangboard.company,
                            hangboard.hangboard
                          ).size.y
                        "
                      >
                        &nbsp;x
                        {{
                          getHangboardByIds(
                            hangboard.company,
                            hangboard.hangboard
                          ).size.y
                        }}mm
                      </span>
                      <span
                        v-if="
                          getHangboardByIds(
                            hangboard.company,
                            hangboard.hangboard
                          ).size.z
                        "
                      >
                        &nbsp;x
                        {{
                          getHangboardByIds(
                            hangboard.company,
                            hangboard.hangboard
                          ).size.z
                        }}mm
                      </span>
                    </div>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    size="small"
                    v-if="
                      getHangboardByIds(hangboard.company, hangboard.hangboard)
                        .url
                    "
                    color="text"
                    icon="mdi-open-in-new"
                    :href="
                      getHangboardByIds(hangboard.company, hangboard.hangboard)
                        .url
                    "
                    target="_blank"
                  >
                  </v-btn>
                  <v-btn
                    size="small"
                    color="text"
                    icon="mdi-delete"
                    :disabled="
                      !networkOnLine || getUserHangboardSelectedId === index
                    "
                    @click="removeHangboard(index)"
                  >
                  </v-btn>
                </v-card-actions>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-container>
</template>

<style lang="scss" scoped></style>
