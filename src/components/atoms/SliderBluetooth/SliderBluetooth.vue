<script setup lang="ts">
// import { computed } from 'vue'

const {
  stream = '0',
  min = 0,
  max = 100
} = defineProps<{
  stream?: string
  min?: number
  max?: number
}>()

// const color = computed(() => {
//   if (props.stream <= 100 && props.stream > 80) return '#F44336'
//   if (props.stream <= 80 && props.stream > 60) return '#FF9800'
//   if (props.stream <= 60 && props.stream > 40) return '#4CAF50'
//   if (props.stream <= 40 && props.stream > 20) return '#FF9800'
//   return '#F44336'
// })
</script>

<template>
  <v-slider readonly :min :max :model-value="stream" color="primary" direction="vertical" />
</template>

<style lang="scss" scoped>
.v-slider.v-input--vertical {
  &:deep(.v-input__control) {
    min-height: 175px;
  }
}
</style>
