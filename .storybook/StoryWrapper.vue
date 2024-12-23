<template>
  <v-app :theme="themeName">
    <v-main>
      <slot name="story"></slot>
    </v-main>
  </v-app>
</template>

<script lang="ts">
export default {
  props: {
    themeName: String
  }
}
</script>
