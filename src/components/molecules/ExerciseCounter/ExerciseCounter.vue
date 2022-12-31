<script setup>
import { defineEmits, defineProps, computed } from 'vue'
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

function increment() {
  if (count.value >= props.max) return
  if (count.value < 15 || !props.timer) {
    count.value += 1
  }
  if (count.value >= 15 && count.value < 30 && props.timer) {
    count.value += 5
  }
  if (count.value >= 30 && count.value < 60 && props.timer) {
    count.value += 15
  }
  if (count.value >= 60 && count.value < 300 && props.timer) {
    count.value += 30
  }
}

function decrement() {
  if (count.value <= props.min) return
  if (count.value <= 15 || !props.timer) {
    count.value -= 1
  }
  if (count.value > 15 && count.value <= 30 && props.timer) {
    count.value -= 5
  }
  if (count.value > 30 && count.value <= 60 && props.timer) {
    count.value -= 15
  }
  if (count.value > 60 && count.value <= 300 && props.timer) {
    count.value -= 30
  }
}
</script>

<template>
  <v-row align="center" class="mb-4">
    <v-col cols="4">
      <div class="text-h6 text-truncate">{{ t(props.title) }}</div>
      <div class="text-caption">{{ t(props.subtitle) }}</div>
    </v-col>

    <v-col cols="8">
      <v-row align="center">
        <v-col cols="4">
          <v-btn
            :disabled="props.disabled"
            color="text"
            icon="mdi-minus"
            variant="outlined"
            @click="decrement"
          ></v-btn>
        </v-col>
        <v-col cols="4">
          <div
            class="text-subtitle-2 text-center"
            :class="{ 'text-disabled': props.disabled }"
          >
            <slot>
              {{ props.timer ? time(count) : `${count}${props.suffix}` }}
            </slot>
          </div>
        </v-col>
        <v-col cols="4">
          <v-btn
            :disabled="props.disabled"
            color="text"
            icon="mdi-plus"
            variant="outlined"
            @click="increment"
          ></v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
