<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import Motherboard, { connect, disconnect, read, write, notify } from '@hangtime/motherboard'

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
const motherboard = ref()
const output = ref()
const isBluetoothEnabled = ref()

// check if device has bluetooth
navigator.bluetooth.getAvailability().then((isBluetoothAvailable) => {
  isBluetoothEnabled.value = !!isBluetoothAvailable
})

const onSuccess = async () => {
  // set the motherboard
  motherboard.value = Motherboard

  // Listen for notifications
  notify((data) => {
    console.log(data)
    output.value = JSON.stringify(data)
  })

  // read battery + device info
  await read(Motherboard.bat)
  await read(Motherboard.devMn)
  await read(Motherboard.devHr)
  await read(Motherboard.devFr)

  // Calibrate?
  await write(Motherboard.uartTx, 'C', 5000)

  // Read stream?
  await write(Motherboard.led01, '1', 2500)
  await write(Motherboard.led02, '0', 2500)
  await write(Motherboard.uartTx, 'S30', 5000)

  // Read stream (2x)?
  await write(Motherboard.led01, '0', 2500)
  await write(Motherboard.led02, '1', 2500)
  await write(Motherboard.uartTx, 'S30', 5000)

  // disconnect from device after we are done
  disconnect()
  motherboard.value = null
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
        v-if="workout.company === 1"
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
        <v-toolbar-title>{{ t('The Griptonine Motherboard') }}</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card class="mb-4">
              <v-card-title>Test, Train, Measure and More</v-card-title>
              <v-card-subtitle>Realtime data over Bluetooth.</v-card-subtitle>
              <v-card-text>
                <p class="mb-4">
                  Griptonite partnered with Beastmaker to create the Motherboard. This advanced
                  system samples at a rate of hundreds of times per second, providing real-time
                  feedback on applied force and hand bias. The Motherboard offers insights into grip
                  compliance, completion, and, most importantly, facilitates progression.
                </p>
                <p class="mb-4">
                  Excitingly, HangTime is now integrating Griptonite Motherboard support, enhancing
                  climbers' training experiences. With the Motherboard's real-time feedback,
                  HangTime users can seamlessly sync and analyze their performance metrics,
                  revolutionizing climbing training for greater efficiency and progress.
                </p>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  :disabled="!isBluetoothEnabled"
                  :prepend-icon="!motherboard ? '$bluetooth' : '$bluetoothOff'"
                  color="text"
                  variant="text"
                  @click="!motherboard ? connect(onSuccess) : disconnect()"
                >
                  {{ !motherboard ? 'Connect' : 'Disconnect' }}
                </v-btn>
                <v-btn
                  href="https://griptonite.io/motherboard/"
                  prepend-icon="$openInNew"
                  target="_blank"
                >
                  Get a Motherboard
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
.v-btn--variant-text {
  color: white;
  mix-blend-mode: difference;
}
</style>
