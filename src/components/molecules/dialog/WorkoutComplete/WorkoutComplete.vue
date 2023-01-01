<script setup>
import { defineProps, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ExerciseName from '@/components/atoms/ExerciseName/ExerciseName'
import { time } from '@/helpers'

const { t } = useI18n()

const props = defineProps({
  exercise: {
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
    {{ exercise }}
    {{ time(0) }}
  </v-dialog>
</template>

<style lang="scss" scoped></style>
