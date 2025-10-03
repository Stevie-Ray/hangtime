<script setup lang="ts"></script>

<template>
  <v-card>
    <v-card-title> Weekelijkse missies </v-card-title>
    <v-card-text>
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
      </v-progress-linear>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" to="/quests"> Bekijk alle </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
