<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import { useUserStore } from '@/stores/user.store'
import { useAuthenticationStore } from '@/stores/authentication.store'
import { useWorkoutsStore } from '@/stores/workouts.store'
import ExerciseHangboard from '@/components/atoms/ExerciseHangboard/ExerciseHangboard.vue'
import HangboardAdd from '@/components/molecules/dialog/HangboardAdd/HangboardAdd.vue'
import { useAppStore } from '@/stores/app.store'
import countries from '@/helpers/countries'

const { t } = useI18n()

const { getUserHangboards, getUserHangboardSelectedId } = storeToRefs(useUserStore())

const { getHangboardByIds, getCompanyById } = useUserStore()

const { online } = storeToRefs(useAppStore())

const { fetchCommunityWorkouts, resetCommunityWorkouts } = useWorkoutsStore()

const { workoutsCommunity } = storeToRefs(useWorkoutsStore())

const { updateUser } = useAuthenticationStore()

const { user } = storeToRefs(useAuthenticationStore())

const setHangboard = async (index: number) => {
  if (user.value && index >= 0) {
    user.value.settings.selected = index
    updateUser()
    workoutsCommunity.value = []
    resetCommunityWorkouts()
    await fetchCommunityWorkouts()
  }
}

const removeHangboard = (index: number) => {
  if (user.value) {
    user.value.settings.hangboards.splice(index, 1)
    setHangboard(0)
  }
}

useHead({
  title: 'Hangboards',
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container toolbar-prepend toolbar-prepend-url="/account">
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
                :variant="getUserHangboardSelectedId === index ? 'outlined' : 'elevated'"
                class="mb-8"
                @click="setHangboard(index)"
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
                  <div v-if="getHangboardByIds(hangboard.company, hangboard.hangboard)?.name">
                    {{ getHangboardByIds(hangboard.company, hangboard.hangboard)?.name }}
                  </div>
                  <v-chip v-if="getHangboardByIds(hangboard.company, hangboard.hangboard)?.type">
                    {{ getHangboardByIds(hangboard.company, hangboard.hangboard)?.type }}
                  </v-chip>
                </v-card-title>
                <v-card-subtitle>
                  {{
                    getCompanyById(hangboard.company)?.country
                      ? countries.find(
                          (country) => country.alpha2 === getCompanyById(hangboard.company)?.country
                        )?.emoji
                      : ''
                  }}&nbsp;{{ getCompanyById(hangboard.company)?.name }}
                </v-card-subtitle>
                <v-card-actions>
                  <v-btn
                    v-if="getHangboardByIds(hangboard.company, hangboard.hangboard)?.size"
                    color="text"
                    disabled
                  >
                    <div class="text-caption">
                      <span
                        v-if="getHangboardByIds(hangboard.company, hangboard.hangboard)?.size.x"
                      >
                        {{ getHangboardByIds(hangboard.company, hangboard.hangboard)?.size.x }}mm
                      </span>
                      <span
                        v-if="getHangboardByIds(hangboard.company, hangboard.hangboard)?.size.y"
                      >
                        &nbsp;x
                        {{ getHangboardByIds(hangboard.company, hangboard.hangboard)?.size.y }}mm
                      </span>
                      <span
                        v-if="getHangboardByIds(hangboard.company, hangboard.hangboard)?.size.z"
                      >
                        &nbsp;x
                        {{ getHangboardByIds(hangboard.company, hangboard.hangboard)?.size.z }}mm
                      </span>
                    </div>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="getHangboardByIds(hangboard.company, hangboard.hangboard)?.url !== null"
                    :href="
                      getHangboardByIds(hangboard.company, hangboard.hangboard)?.url ?? undefined
                    "
                    color="text"
                    icon="$openInNew"
                    size="small"
                    target="_blank"
                  >
                  </v-btn>
                  <v-btn
                    :disabled="!online || getUserHangboardSelectedId === index"
                    color="text"
                    icon="$delete"
                    size="small"
                    @click.stop="removeHangboard(index)"
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
