<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <footer>
    <v-row>
      <v-col cols="12">
        <v-btn href="mailto:mail@stevie-ray.nl" size="x-small" variant="plain">
          {{ t('Help') }}
        </v-btn>
        <v-btn to="/brands" size="x-small" variant="plain">
          {{ t('Hangboards') }}
        </v-btn>
        <v-btn to="/privacy" size="x-small" variant="plain">
          {{ t('Privacy') }}
        </v-btn>
      </v-col>
    </v-row>
  </footer>
</template>

<style scoped></style>
