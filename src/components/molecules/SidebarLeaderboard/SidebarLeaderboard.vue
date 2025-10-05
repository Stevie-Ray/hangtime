<script setup lang="ts">
import { isDevelopment } from '@/helpers'
</script>

<template>
  <v-card class="mx-auto" v-if="isDevelopment()">
    <template #prepend>
      <v-icon>$trophy</v-icon>
    </template>

    <template #title>
      <span>Je staat op plek #1</span>
    </template>

    <v-card-text> Je hebt deze week tot nu toe 336 punten verdiend </v-card-text>
    <v-card-actions>
      <v-btn color="primary" to="/leaderboard"> Ranglijst bekijken </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
