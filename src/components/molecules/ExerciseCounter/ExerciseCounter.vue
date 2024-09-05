<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { time } from '@/helpers'

const { t } = useI18n()

const emit = defineEmits(['input'])

const {
  title = '',
  subtitle = '',
  suffix = 'x',
  value,
  timer,
  min = 1,
  max = 300,
  disabled = false
} = defineProps<{
  title?: string
  subtitle?: string
  suffix?: string
  value?: number
  timer?: boolean
  min?: number
  max?: number
  disabled?: boolean
}>()

const count = computed({
  get() {
    return value
  },
  set(value) {
    emit('input', value)
  }
})

const steps = [1, 5, 15, 60, 180, 300]

function increment() {
  if (count.value !== undefined) {
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
}

function decrement() {
  if (count.value !== undefined) {
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
}
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
            :disabled="disabled"
            color="text"
            icon="$minus"
            variant="outlined"
            @click="decrement"
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
        <v-col cols="4">
          <v-btn
            :disabled="disabled"
            color="text"
            icon="$plus"
            variant="outlined"
            @click="increment"
            style="touch-action: manipulation"
          ></v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
