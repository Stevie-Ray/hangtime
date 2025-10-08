<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useAuthenticationStore } from '@/stores/authentication.store'
import { isDevelopment } from '@/helpers'

const { t } = useI18n()
const { user } = storeToRefs(useAuthenticationStore())
</script>

<template>
  <v-card v-if="isDevelopment()">
    <!-- Non-subscribed state -->
    <template v-if="user?.subscribed">
      <v-card-title> Try Premium </v-card-title>
      <v-card-subtitle> Unlock all features </v-card-subtitle>

      <v-card-text> Multiple hangboards, unlimited workouts.</v-card-text>

      <v-card-actions>
        <v-btn color="secondary" variant="elevated" to="/account/subscription">
          Subscribe now
        </v-btn>
      </v-card-actions>
    </template>

    <template v-else>
      <v-card-title> Premium Active </v-card-title>
      <v-card-subtitle>Thank you for subscribing</v-card-subtitle>

      <v-card-text> Enjoy all premium features. </v-card-text>

      <v-card-actions>
        <v-btn color="primary" to="/account/subscription"> Manage {{ t('Subscription') }} </v-btn>
      </v-card-actions>
    </template>
  </v-card>
</template>

<style scoped></style>
