<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { event } from 'vue-gtag'
import HangboardSelect from '@/components/molecules/HangboardSelect/HangboardSelect.vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useAuthenticationStore } from '@/stores/authentication'
import { useWorkoutsStore } from '@/stores/workouts'

const { t } = useI18n()

const { user } = storeToRefs(useAuthenticationStore())

const { workoutsCommunity } = storeToRefs(useWorkoutsStore())

const { online } = storeToRefs(useAppStore())

const { fetchCommunityWorkouts, resetCommunityWorkouts } = useWorkoutsStore()

const { getHangboardByIds, getHangboardNameByIds } = useUserStore()

const { updateUser } = useAuthenticationStore()

const dialog = ref(false)

const selected = reactive({
  company: 1,
  hangboard: 0
})

const getHangboard = computed(() => getHangboardByIds(selected.company, selected.hangboard))

const updateSelected = () => {
  if (user.value) {
    const exists = user.value.settings.hangboards.some(
      (item) => item.company === selected.company && item.hangboard === selected.hangboard
    )
    if (!exists) {
      // measure selected hangboard data
      event('add_hangboard', {
        hangboard: getHangboardNameByIds(selected.company, selected.hangboard)
      })
      // add the newly selected board and set it
      user.value.settings.hangboards.push(selected)
      if (user.value.settings.hangboards.length > 0) {
        user.value.settings.selected = user.value.settings.hangboards.length - 1
      }
    }
  }
}

const addHangboard = async () => {
  if (user.value) {
    updateSelected()
    updateUser()
    workoutsCommunity.value = []
    resetCommunityWorkouts()
    await fetchCommunityWorkouts()
  }
  dialog.value = false
}
</script>

<template>
  <v-dialog v-model="dialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
    <template v-slot:activator="{ props }">
      <v-btn variant="text" color="text" icon="$plus" v-bind="props"></v-btn>
    </template>
    <v-card>
      <v-toolbar>
        <v-btn @click="dialog = false" color="text" icon="$close"></v-btn>
        <v-toolbar-title>{{ t('Add Hangboard') }}</v-toolbar-title>
        <v-toolbar-items>
          <v-btn
            icon="$contentSaveOutline"
            :disabled="!online || (getHangboard && getHangboard.holds === 0)"
            @click="addHangboard"
          ></v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col cols="12">
            <hangboard-select v-model="selected" />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
