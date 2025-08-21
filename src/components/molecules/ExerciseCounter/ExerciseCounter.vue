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

const [STEP_SLOWEST, STEP_SLOWER, STEP_SLOW, STEP_FAST, STEP_FASTER, STEP_FASTEST] = [
  1, 5, 15, 60, 180, 300
]

const step = computed(() => {
  if (count.value < STEP_SLOW || !timer) {
    return STEP_SLOWEST
  }
  if (count.value >= STEP_SLOW && count.value < STEP_FAST && timer) {
    return STEP_SLOWER
  }
  if (count.value >= STEP_FAST && count.value < STEP_FASTER && timer) {
    return STEP_SLOW
  }
  if (count.value >= STEP_FASTER && count.value <= STEP_FASTEST && timer) {
    return STEP_FAST
  }
  return STEP_SLOWEST
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
