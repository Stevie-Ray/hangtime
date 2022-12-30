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

const { t } = useI18n()

const { getUserHangboards, getUserHangboardSelectedId } = storeToRefs(useUser())

const { getHangboardNameByIds } = useUser()

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
                <v-card-title>
                  {{
                    getHangboardNameByIds(
                      hangboard.company,
                      hangboard.hangboard
                    )
                  }}
                </v-card-title>
                <v-card-actions>
                  <v-btn
                    color="text"
                    :disabled="getUserHangboardSelectedId === index"
                    @click="setHangboard(index)"
                  >
                    {{
                      getUserHangboardSelectedId === index
                        ? t('Selected')
                        : t('Select')
                    }}
                  </v-btn>
                  <v-btn
                    v-if="getUserHangboardSelectedId !== index"
                    color="text"
                    :disabled="!networkOnLine"
                    @click="removeHangboard(index)"
                  >
                    {{ t('Delete') }}
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
