<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { time } from '@/helpers'

const { t } = useI18n()

const emit = defineEmits(['input'])

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: 'x'
  },
  value: {
    type: Number
  },
  timer: {
    type: Boolean,
    default: true
  },
  min: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: 300
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const count = computed({
  get() {
    return props.value
  },
  set(value) {
    emit('input', value)
  }
})

const steps = [1, 5, 15, 60, 180, 300]

function increment() {
  if (count.value >= props.max) return
  if (count.value < steps[2] || !props.timer) {
    count.value += steps[0]
  }
  if (count.value >= steps[2] && count.value < steps[3] && props.timer) {
    count.value += steps[1]
  }
  if (count.value >= steps[3] && count.value < steps[4] && props.timer) {
    count.value += steps[2]
  }
  if (count.value >= steps[4] && count.value < steps[5] && props.timer) {
    count.value += steps[3]
  }
}

function decrement() {
  if (count.value <= props.min) return
  if (count.value <= steps[2] || !props.timer) {
    count.value -= steps[0]
  }
  if (count.value > steps[2] && count.value <= steps[3] && props.timer) {
    count.value -= steps[1]
  }
  if (count.value > steps[3] && count.value <= steps[4] && props.timer) {
    count.value -= steps[2]
  }
  if (count.value > steps[4] && count.value <= steps[5] && props.timer) {
    count.value -= steps[3]
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
