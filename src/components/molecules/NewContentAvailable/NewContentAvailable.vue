<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const snackbar = ref(true)

const { refreshingApp = false } = defineProps<{
  refreshingApp?: boolean
}>()

const emit = defineEmits(['refresh'])

const refresh = () => {
  emit('refresh')
  snackbar.value = false
}
</script>

<template>
  <v-snackbar v-model="snackbar" :timeout="-1" bottom>
    <div v-if="refreshingApp">
      {{ t('Loading new content...') }}
    </div>
    <div v-else>
      {{ t('New content available') }}
    </div>
    <template v-if="!refreshingApp" #actions>
      <v-btn color="light" @click="refresh">
        {{ t('Refresh') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<style lang="scss" scoped></style>
