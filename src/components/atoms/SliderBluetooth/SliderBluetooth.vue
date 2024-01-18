<script setup>
// import { computed } from 'vue'

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  stream: {
    type: Number || undefined,
    default: 0,
    required: true
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  }
})

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
