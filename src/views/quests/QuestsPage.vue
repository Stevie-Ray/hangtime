<template>
  <app-container>
    <v-row>
      <v-col class="d-flex justify-space-between" cols="12">
        <div class="text-h6">Weekelijkse missies</div>
        <div class="text-secondary text-subtitle-2">3 dagen, 2 uur</div>
      </v-col>
      <v-col cols="12">
        <v-sheet border class="pa-4" rounded>
          <div class="text-h6">Doe 3 workouts</div>
          <v-progress-linear color="primary" height="24" :model-value="(2 / 3) * 100">
            <template #default="{ value }">
              <strong>{{ Math.ceil(value) }}%</strong>
            </template>
          </v-progress-linear>

          <div class="my-2" />
          <div class="text-h6">Train 30 minuten</div>
          <v-progress-linear color="primary" height="24" :model-value="(24 / 30) * 100">
            <template #default="{ value }">
              <strong>{{ Math.ceil(value) }}%</strong>
            </template>
          </v-progress-linear>

          <div class="my-2" />
          <div class="text-h6">Doe 50 pullups</div>
          <v-progress-linear color="primary" height="24" :model-value="(16 / 50) * 100">
            <template #default="{ value }">
              <strong>{{ Math.ceil(value) }}%</strong>
            </template>
          </v-progress-linear></v-sheet
        >
      </v-col>
    </v-row>
  </app-container>
</template>

<script lang="ts" setup>
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

useHead({
  title: t('Quests'),
  meta: [{ name: 'description', content: '' }]
})
</script>
