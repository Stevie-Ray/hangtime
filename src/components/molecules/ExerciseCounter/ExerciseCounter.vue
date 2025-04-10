<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { time } from '@/helpers'

const { t } = useI18n()

const {
  title = '',
  subtitle = '',
  suffix = 'x',
  timer,
  min = 1,
  max = 300,
  disabled = false
} = defineProps<{
  title?: string
  subtitle?: string
  suffix?: string
  timer?: boolean
  min?: number
  max?: number
  disabled?: boolean
}>()

const count = defineModel<number>({ required: true, default: 0 })

const steps = [1, 5, 15, 60, 180, 300]

const step = computed(() => {
  if (count.value < steps[2] || !timer) {
    return steps[0]
  }
  if (count.value >= steps[2] && count.value < steps[3] && timer) {
    return steps[1]
  }
  if (count.value >= steps[3] && count.value < steps[4] && timer) {
    return steps[2]
  }
  if (count.value >= steps[4] && count.value <= steps[5] && timer) {
    return steps[3]
  }
  return steps[0]
})
</script>

<template>
  <v-row align="center" class="mb-4">
    <v-col cols="4">
      <div v-if="title" class="text-h6 text-truncate">{{ t(title) }}</div>
      <div v-if="subtitle" class="text-caption">{{ t(subtitle) }}</div>
    </v-col>

    <v-col cols="8">
      <v-number-input
        v-model="count"
        variant="solo"
        :min="min"
        :max="max"
        :step="step"
        control-variant="split"
        :disabled="disabled"
        hide-details="auto"
        flat
      >
        <slot>
          <input
            size="1"
            type="text"
            readonly
            inputmode="decimal"
            class="text-center"
            :value="timer ? time(count) : `${count}${suffix}`"
          />
        </slot>
      </v-number-input>
    </v-col>
  </v-row>
</template>

<style scoped>
.v-number-input:deep(.v-field__field) {
  --v-field-input-padding-top: 12px;
  --v-field-input-padding-bottom: 12px;
  --v-input-control-height: 48px;
  [id^='input'] {
    display: none;
  }
}
.v-number-input:deep(.v-divider) {
  --v-border-opacity: 0;
}
</style>
