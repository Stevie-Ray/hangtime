<script setup lang="ts">
import { event } from 'vue-gtag'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { useAuthenticationStore } from '@/stores/authentication.store'

const { getHangboardNameByIds } = useUserStore()

const { user } = storeToRefs(useAuthenticationStore())

const { t } = useI18n()

const emit = defineEmits(['show'])

// router
const route = useRoute()

const dialog = ref(true)

const addHangboard = () => {
  const company = parseInt(route.params.company?.toString() || '0', 10)
  const hangboard = parseInt(route.params.hangboard?.toString() || '0', 10)
  event('add_hangboard', {
    hangboard: getHangboardNameByIds(company, hangboard)
  })
  // add the newly selected board and set it
  if (user.value) {
    user.value.settings.hangboards.push({ company, hangboard })
    if (user.value.settings.hangboards.length > 0) {
      user.value.settings.selected = user.value.settings.hangboards.length - 1
    }
  }
  emit('show', false)
}
</script>

<template>
  <v-dialog v-model="dialog" :scrim="false" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar>
        <v-btn icon="$close" color="text" to="/workouts"></v-btn>
        <v-toolbar-title> {{ t('You are not using this hangboard') }}! </v-toolbar-title>

        <v-toolbar-items>
          <v-btn icon="$contentSaveOutline" @click="addHangboard"></v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col cols="12">
            {{ t("To view this workout we'll add this hangboard to your hangboards") }}
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
