<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'

const items = [
  {
    title: 'We’ve got a HangTime Discord!',
    subtitle: 'Come hang out, share feedback, talk training and request new boards.',
    link: 'https://discord.gg/f7QQnEBQQt',
    color: '#5865f2',
    icon: '$forumOutline',
    buttonText: 'Join'
  }
]

const show = useLocalStorage('topBannerVisible', true)
</script>

<template>
  <v-app-bar v-if="show" flat app color="#5865f2">
    <v-list-item
      link
      :href="item.link"
      target="_blank"
      class="flex-grow-1 py-6"
      v-for="item in items"
      :key="item.title"
      lines="two"
    >
      <template v-slot:prepend>
        <v-avatar color="white">
          <v-icon :color="item.color">{{ item.icon }}</v-icon>
        </v-avatar>
      </template>
      <v-list-item-title class="text-subtitle-2 text-md-subtitle-1 font-weight-medium">{{
        item.title
      }}</v-list-item-title>
      <v-list-item-subtitle>
        {{ item.subtitle }}
      </v-list-item-subtitle>
      <template v-slot:append>
        <v-btn variant="flat" color="white" append-icon="$openInNew" class="me-2 d-none d-md-flex">
          {{ item.buttonText }}
        </v-btn>
        <v-btn icon="$close" size="x-small" class="me-2 ms-6" @click.stop.prevent="show = false" />
      </template>
    </v-list-item>
  </v-app-bar>
</template>

<style scoped></style>
