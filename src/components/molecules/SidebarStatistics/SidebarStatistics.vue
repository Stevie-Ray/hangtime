<script setup lang="ts">
import { isDevelopment } from '@/helpers'
</script>

<template>
  <v-row v-if="isDevelopment()">
    <v-col cols="12">
      <div class="d-flex justify-space-between">
        <v-btn prepend-icon="$calendar" variant="flat">2</v-btn>
        <v-btn prepend-icon="$trophy" variant="flat">1</v-btn>
        <v-btn prepend-icon="$cashMultiple" variant="flat">3846</v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<style scoped lang="sass"></style>
