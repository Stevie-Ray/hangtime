<script setup lang="ts">
import { isDevelopment } from '@/helpers'
</script>

<template>
  <v-card v-if="isDevelopment()">
    <v-card-title> Probeer Premium gratis </v-card-title>
    <v-card-text>
      Geen advertenties, persoonlijke oefeningen en onbeperkt Legendarisch!
    </v-card-text>
    <v-card-actions>
      <v-btn color="secondary" variant="elevated"> Probeer 30 minuten gratis </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
