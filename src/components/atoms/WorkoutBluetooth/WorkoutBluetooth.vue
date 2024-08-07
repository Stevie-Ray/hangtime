<script setup lang="ts">
/// <reference types="web-bluetooth" />
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { Workout } from '@/interfaces/workouts.interface'

import {
  Climbro,
  Entralpi,
  Motherboard,
  MuscleMeter,
  mySmartBoard,
  Progressor,
  battery,
  connect,
  disconnect,
  info,
  notify
} from '@hangtime/grip-connect'
import type { massObject } from '@hangtime/grip-connect/src/types/notify'

import { useBluetoothStore } from '@/stores/bluetooth'

const emit = defineEmits(['notify', 'start'])

const { device } = storeToRefs(useBluetoothStore())

const { t } = useI18n()

const props = defineProps({
  workout: {
    type: Object as () => Workout
  },
  size: {
    type: String,
    default: 'default'
  }
})

const workout = ref(props.workout)
const dialog = ref(false)
const devices = [
  {
    title: 'Climbro',
    value: Climbro,
    disabled: true
  },
  {
    title: 'Entralpi',
    value: Entralpi
  },
  {
    title: 'Motherboard',
    value: Motherboard,
    disabled: workout.value?.company !== 1
  },
  {
    title: 'Muscle Meter',
    value: MuscleMeter,
    disabled: true
  },
  {
    title: 'mySmartBoard',
    value: mySmartBoard,
    disabled: true
  },
  {
    title: 'Progressor',
    value: Progressor
  }
]
const dropdown = ref(workout.value?.company === 1 ? Motherboard : Progressor)
const output = ref()
const isBluetoothAvailable = ref(false)

// check if the browser supports bluetooth
const isBluetoothSupported = () => {
  return 'bluetooth' in navigator
}

// check if the device has a Bluetooth adapter
if (isBluetoothSupported()) {
  navigator.bluetooth.getAvailability().then((isAvailable) => {
    isBluetoothAvailable.value = !!isAvailable
  })
}

const reset = () => {
  disconnect(device.value)
  device.value = null
}

const onSuccess = async () => {
  try {
    // set the device
    device.value = dropdown.value

    // Listen for notifications
    notify((data: massObject) => {
      emit('notify', data)
      output.value = JSON.stringify(data)
    })

    if (device.value?.name === Motherboard.filters.some((filter) => filter.name)) {
      await battery(device.value)
      await info(device.value)
    }
  } catch (error) {
    console.error(error)
  } finally {
    dialog.value = false
    emit('start')
  }
}

watch(
  () => props.workout,
  (newValue) => {
    workout.value = newValue
  }
)
</script>

<template>
  <v-dialog v-model="dialog" :scrim="false" fullscreen transition="dialog-bottom-transition">
    <template v-slot:activator="{ props }">
      <v-btn
        v-if="isBluetoothSupported()"
        :disabled="!isBluetoothAvailable"
        :size="size"
        color="text"
        :icon="!device ? '$bluetooth' : '$bluetoothOff'"
        v-bind="props"
        variant="text"
      ></v-btn>
    </template>
    <v-card>
      <v-toolbar>
        <v-btn color="text" icon="$close" @click="dialog = false"></v-btn>
        <v-toolbar-title>{{ t('Force-Sensing Climbing Training') }}</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card class="mb-4">
              <v-card-title>Test, Train, Measure and More</v-card-title>
              <v-card-subtitle>Realtime data over Bluetooth.</v-card-subtitle>
              <v-card-text>
                <p class="mb-4">
                  Smart Bluetooth hangboards or plates revolutionize climbing training by
                  integrating sensors and connectivity. Devices like the
                  <a href="https://griptonite.io/motherboard/" target="_blank">
                    Griptonite Motherboard </a
                  >, <a href="https://climbro.com/" target="_blank">Climbro</a>,
                  <a href="https://www.smartboard-climbing.com/" target="_blank">SmartBoard</a>,
                  <a href="https://entralpi.com/" target="_blank">Entralpi</a>, and
                  <a href="https://tindeq.com/" target="_blank">Tindeq Progressor</a> offer
                  personalized workouts, performance tracking, and real-time feedback through mobile
                  apps, enhancing climbers' strength and technique with data-driven insights.
                </p>
                <p class="mb-4">
                  Excitingly, HangTime is now integrating bluetooth support, enhancing climbers'
                  training experiences. With the real-time feedback, HangTime users can seamlessly
                  sync and analyze their performance metrics, revolutionizing climbing training for
                  greater efficiency and progress.
                </p>
                <v-select v-model="dropdown" :items="devices" :item-props="true"></v-select>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  :disabled="!isBluetoothAvailable"
                  :prepend-icon="!device ? '$bluetooth' : '$bluetoothOff'"
                  color="text"
                  variant="text"
                  @click="!device ? connect(dropdown, async () => onSuccess()) : reset()"
                >
                  {{ !device ? 'Connect' : 'Disconnect' }}
                </v-btn>
                <v-btn
                  href="https://github.com/Stevie-Ray/hangtime-grip-connect"
                  prepend-icon="$github"
                  color="text"
                  variant="text"
                  append-icon="$openInNew"
                  target="_blank"
                >
                  Help development
                </v-btn>
              </v-card-actions>
            </v-card>
            <v-card v-if="output">
              <v-card-text>
                {{ output }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
a {
  color: inherit;
}
.v-btn--variant-text {
  color: white;
  mix-blend-mode: difference;
}
</style>
