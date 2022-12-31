<script setup>
import { reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { event } from 'vue-gtag'
import HangboardSelect from '@/components/molecules/HangboardSelect/HangboardSelect'
import { useApp } from '@/stores/app'
import { useUser } from '@/stores/user'
import { useAuthentication } from '@/stores/authentication'

const { t } = useI18n()

const { networkOnLine } = storeToRefs(useApp())

const { user } = storeToRefs(useAuthentication())

const { getHangboardNameByIds } = useUser()

const { updateUser } = useAuthentication()

const dialog = ref(false)

const selected = reactive({
  company: 1,
  hangboard: 0
})

const updateSelected = () => {
  const exists = user.value.settings.hangboards.some(
    (item) =>
      item.company === selected.company && item.hangboard === selected.hangboard
  )
  if (!exists) {
    // measure selected hangboard data
    event('add-hangboard', {
      hangboard: getHangboardNameByIds(selected.company, selected.hangboard)
    })
    // add the newly selected board and set it
    user.value.settings.hangboards.push(selected)
    user.value.settings.selected = user.value.settings.hangboards.length - 1
  }
}

const addHangboard = () => {
  if (user.value) {
    updateSelected()
    updateUser()
  }
  dialog.value = false
}
</script>

<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ props }">
      <v-btn variant="text" color="text" icon="mdi-plus" v-bind="props"></v-btn>
    </template>
    <v-card>
      <v-toolbar>
        <v-btn @click="dialog = false" color="text" icon="mdi-close"></v-btn>
        <v-toolbar-title>{{ t('Add Hangboard') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            icon="mdi-content-save-outline"
            :disabled="!networkOnLine"
            @click="addHangboard"
          ></v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col cols="12">
            <hangboard-select
              :selected-hangboard="selected"
              @update-selected="(item) => (selected = item)"
            ></hangboard-select>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
