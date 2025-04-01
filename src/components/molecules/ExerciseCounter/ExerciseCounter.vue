<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { time } from '@/helpers'
import { vOnLongPress } from '@vueuse/components'

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

function incrementClick() {
  if (count.value >= max) return
  if (count.value < steps[2] || !timer) {
    count.value += steps[0]
  }
  if (count.value >= steps[2] && count.value < steps[3] && timer) {
    count.value += steps[1]
  }
  if (count.value >= steps[3] && count.value < steps[4] && timer) {
    count.value += steps[2]
  }
  if (count.value >= steps[4] && count.value < steps[5] && timer) {
    count.value += steps[3]
  }
}

function decrementClick() {
  if (count.value <= min) return
  if (count.value <= steps[2] || !timer) {
    count.value -= steps[0]
  }
  if (count.value > steps[2] && count.value <= steps[3] && timer) {
    count.value -= steps[1]
  }
  if (count.value > steps[3] && count.value <= steps[4] && timer) {
    count.value -= steps[2]
  }
  if (count.value > steps[4] && count.value <= steps[5] && timer) {
    count.value -= steps[3]
  }
}

let pressInterval: ReturnType<typeof setInterval> | null = null

const decrementLongPress = () => {
  pressInterval = setInterval(() => {
    decrementClick()
  }, 250)
}

const incrementLongPress = () => {
  pressInterval = setInterval(() => {
    incrementClick()
  }, 250)
}

const stopLongPress = () => {
  if (pressInterval) {
    clearInterval(pressInterval)
    pressInterval = null
  }
}

// const step = computed(() => {
//   if (count.value < steps[2] || !timer) {
//     return steps[0]
//   }
//   if (count.value >= steps[2] && count.value < steps[3] && timer) {
//     return steps[1]
//   }
//   if (count.value >= steps[3] && count.value < steps[4] && timer) {
//     return steps[2]
//   }
//   if (count.value >= steps[4] && count.value <= steps[5] && timer) {
//     return steps[3]
//   }
//   return steps[0]
// })
</script>

<template>
  <v-row align="center" class="mb-4">
    <v-col cols="4">
      <div v-if="title" class="text-h6 text-truncate">{{ t(title) }}</div>
      <div v-if="subtitle" class="text-caption">{{ t(subtitle) }}</div>
    </v-col>

    <v-col cols="8">
      <v-row align="center">
        <v-col cols="4">
          <v-btn
            v-on-long-press="[decrementLongPress, { onMouseUp: stopLongPress }]"
            :disabled="disabled"
            color="text"
            icon="$minus"
            variant="outlined"
            @click="decrementClick"
            style="touch-action: manipulation"
          ></v-btn>
        </v-col>
        <v-col cols="4">
          <div class="text-subtitle-2 text-center" :class="{ 'text-disabled': disabled }">
            <slot>
              {{ timer ? time(count) : `${count}${suffix}` }}
            </slot>
          </div>
        </v-col>
        <v-col cols="4" align="end">
          <v-btn
            v-on-long-press="[incrementLongPress, { onMouseUp: stopLongPress }]"
            :disabled="disabled"
            color="text"
            icon="$plus"
            variant="outlined"
            @click="incrementClick"
            style="touch-action: manipulation"
          ></v-btn>
        </v-col>
      </v-row>
      <!-- <v-number-input
        v-model="count"
        variant="solo"
        :value="timer ? time(count) : `${count}${suffix}`"
        :min="min"
        :max="max"
        :step="step"
        control-variant="split"
        :disabled="disabled"
        hide-details="auto"
        flat
        inset
      >
      </v-number-input> -->
    </v-col>
  </v-row>
</template>

<style scoped>
/* .v-number-input:deep(.v-field__field) {
  --v-field-input-padding-top: 12px;
  --v-field-input-padding-bottom: 12px;
  --v-input-control-height: 48px;
} */
</style>
