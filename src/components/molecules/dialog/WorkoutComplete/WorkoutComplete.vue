<script setup>
import { defineProps, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { time } from '@/helpers'

const { t } = useI18n()

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  workout: {
    type: Object
  }
})

const dialog = ref(false)
</script>

<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    {{ workout }}
    {{ time(0) }}
    {{ t('test') }}
  </v-dialog>
</template>

<style lang="scss" scoped></style>
