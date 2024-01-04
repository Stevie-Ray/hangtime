<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  Motherboard,
  Tindeq,
  Entralpi,
  connect,
  disconnect,
  read,
  write,
  notify
} from '@hangtime/grip-connect/build'

const { t } = useI18n()

const props = defineProps({
  workout: {
    type: Object
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
    title: 'Tindeq',
    value: Tindeq
  },
  {
    title: 'Entralpi',
    value: Entralpi
  },
  {
    title: 'Motherboard',
    value: Motherboard,
    disabled: workout.value.company !== 1
  }
]
const dropdown = ref(workout.value.company === 1 ? Motherboard : Entralpi)
const device = ref()
const output = ref()
const isBluetoothEnabled = ref(false)

// check if device has bluetooth
if (navigator.bluetooth) {
  navigator.bluetooth.getAvailability().then((isBluetoothAvailable) => {
    isBluetoothEnabled.value = !!isBluetoothAvailable
  })
}

const reset = () => {
  disconnect(device.value)
  device.value = null
}

const onSuccess = async () => {
  // set the device
  device.value = dropdown.value
  // Listen for notifications
  notify((data) => {
    if (data && data.value) {
      if (typeof data.value === 'object') {
        output.value = JSON.stringify(data.value)
      } else {
        output.value = data.value
      }
    }
  })

  if (device.value.name === Motherboard.name) {
    // read battery + device info
    await read(Motherboard, 'battery', 'level')
    await read(Motherboard, 'device', 'manufacturer')
    await read(Motherboard, 'device', 'hardware')
    await read(Motherboard, 'device', 'firmware')

    // Calibrate?
    await write(Motherboard, 'uart', 'tx', 'C', 5000)

    // Read stream?
    await write(Motherboard, 'unknown', '01', '1', 2500)
    await write(Motherboard, 'unknown', '02', '0', 2500)
    await write(Motherboard, 'uart', 'tx', 'S30', 5000)

    // Read stream (2x)?
    await write(Motherboard, 'unknown', '01', '0', 2500)
    await write(Motherboard, 'unknown', '02', '1', 2500)
    await write(Motherboard, 'uart', 'tx', 'S30', 5000)
  }

  if (device.value.name === Tindeq.name) {
    await write(Tindeq, 'progressor', 'tx', 'e', 10000)
    await write(Tindeq, 'progressor', 'tx', 'f', 0)
  }

  reset()
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
        :disabled="!isBluetoothEnabled"
        :size="size"
        color="text"
        icon="$bluetooth"
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
                  integrating sensors and connectivity. Devices like
                  <a href="https://griptonite.io/motherboard/" target="_blank">Motherboard</a>,
                  <a href="https://climbro.com/" target="_blank">Climbro</a>,
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
                  :disabled="!isBluetoothEnabled"
                  :prepend-icon="!device ? '$bluetooth' : '$bluetoothOff'"
                  color="text"
                  variant="text"
                  @click="!device ? connect(dropdown, onSuccess) : reset()"
                >
                  {{ !device ? 'Connect' : 'Disconnect' }}
                </v-btn>
                <v-btn
                  href="https://github.com/Stevie-Ray/hangtime-grip-connect"
                  prepend-icon="$github"
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
