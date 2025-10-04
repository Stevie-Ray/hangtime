<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user.store'
import { useAuthenticationStore } from '@/stores/authentication.store'
import { useAppStore } from '@/stores/app.store'
import { useWorkoutsStore } from '@/stores/workouts.store'
import ExerciseHangboard from '@/components/atoms/ExerciseHangboard/ExerciseHangboard.vue'

const { getUserHangboardCompany, getUserHangboard, getUserHangboards } = storeToRefs(useUserStore())
const { getHangboardNameByIds } = useUserStore()
const { t } = useI18n()
const { user } = storeToRefs(useAuthenticationStore())
const { updateUser } = useAuthenticationStore()
const { online } = storeToRefs(useAppStore())
const { fetchCommunityWorkouts, resetCommunityWorkouts } = useWorkoutsStore()

const hangboardMenu = ref(false)

const setHangboard = async () => {
  updateUser()
  resetCommunityWorkouts()
  await fetchCommunityWorkouts()
}
</script>

<template>
  <v-menu v-model="hangboardMenu">
    <template v-slot:activator="{ props }">
      <v-btn
        :title="t('Select your hangboard')"
        color="surface"
        class="justify-space-between"
        v-bind="props"
        block
        :append-icon="
          getUserHangboards?.length > 1
            ? hangboardMenu
              ? '$chevronDown'
              : '$chevronUp'
            : undefined
        "
      >
        <span v-if="getUserHangboardCompany && getUserHangboard">
          {{ `${getUserHangboardCompany.name} - ${getUserHangboard.name}` }}
        </span>
      </v-btn>
    </template>

    <v-card v-if="getUserHangboards?.length > 1" :max-width="600">
      <v-card-text>
        <exercise-hangboard
          v-if="getUserHangboard && getUserHangboardCompany"
          :hangboard="{
            hangboard: getUserHangboard.id,
            company: getUserHangboardCompany.id
          }"
        />
        <v-divider class="my-4" />

        <v-radio-group
          v-if="user && getUserHangboards?.length > 0"
          v-model="user.settings.selected"
          :disabled="!online"
          @update:modelValue="setHangboard"
          mandatory
        >
          <v-radio
            v-for="(hangboard, index) in getUserHangboards"
            :key="index"
            :label="getHangboardNameByIds(hangboard.company, hangboard.hangboard)"
            :value="index"
          ></v-radio>
        </v-radio-group>

        <v-btn variant="outlined" color="text" size="small" class="mr-2" to="/account/hangboards">
          <v-icon class="mr-1">$keyboardOutline</v-icon>
          <span>{{ t('Hangboards') }}</span>
        </v-btn>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<style lang="scss" scoped>
.v-btn:deep(.v-btn__content) {
  display: inline-block !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  justify-content: start;
}
</style>
