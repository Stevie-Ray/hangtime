<script setup lang="ts">
import { isDevelopment } from '@/helpers'
import { useI18n } from 'vue-i18n'
import { useActivitiesStore } from '@/stores/activities.store'
import ActivityCalendar from '@/components/molecules/ActivityCalendar/ActivityCalendar.vue'

const { t } = useI18n()
const { weekStreak } = useActivitiesStore()
</script>

<template>
  <v-row v-if="isDevelopment()" no-gutters>
    <v-col cols="12">
      <div class="d-flex justify-space-between py-1 py-md-0">
        <v-menu open-on-hover :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              prepend-icon="$calendar"
              variant="flat"
              color="surface"
              :title="t('Week streak')"
            >
              {{ weekStreak }}
            </v-btn>
          </template>
          <v-card max-width="364">
            <template v-slot:prepend>
              <v-icon size="x-large">$calendar</v-icon>
            </template>
            <template v-slot:title>{{ weekStreak }}-{{ t('Week streak') }}</template>
            <v-card-text>
              <div class="mb-2">Your activity calendar showing days with workouts.</div>
              <activity-calendar />
            </v-card-text>
          </v-card>
        </v-menu>
        <v-btn prepend-icon="$trophy" variant="flat" color="surface">1</v-btn>
        <v-btn prepend-icon="$cashMultiple" variant="flat" color="surface">3846</v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<style scoped lang="sass"></style>
