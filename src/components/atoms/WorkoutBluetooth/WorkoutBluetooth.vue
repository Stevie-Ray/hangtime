<script setup lang="ts">
/// <reference types="web-bluetooth" />
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { IWorkout } from '@/interfaces/workout.interface'
import { useBluetooth } from '@/composables/useBluetooth'
import { useBluetoothStore } from '@/stores/bluetooth.store'

import {
  Climbro,
  Entralpi,
  ForceBoard,
  Motherboard,
  WHC06,
  mySmartBoard,
  Progressor
} from '@hangtime/grip-connect'

const bluetoothStore = useBluetoothStore()

const { connect } = useBluetoothStore()

const { bluetoothDevice, bluetoothError } = storeToRefs(bluetoothStore)

const { isBluetoothSupported, isBluetoothAvailable } = useBluetooth()

const workout = defineModel<IWorkout>()

const { size = 'default' } = defineProps<{
  size?: string
}>()

const emit = defineEmits(['start'])

const devices = [
  {
    title: 'Climbro',
    type: 'Climbro',
    disabled: true
  },
  {
    title: 'Entralpi',
    type: 'Entralpi'
  },
  {
    title: 'ForceBoard',
    type: 'ForceBoard'
  },
  {
    title: 'Motherboard',
    type: 'Motherboard',
    disabled: workout.value?.company !== 1
  },
  {
    title: 'mySmartBoard',
    type: 'mySmartBoard',
    disabled: true
  },
  {
    title: 'Progressor',
    type: 'Progressor'
  },
  {
    title: 'WH-CO6',
    type: 'WHC06'
  }
]
const dropdown = ref(workout.value?.company === 1 ? 'Motherboard' : 'Progressor')
const dialog = ref(false)

const setup = () => {
  const selectedDeviceClass = {
    Climbro: Climbro,
    Entralpi: Entralpi,
    ForceBoard: ForceBoard,
    Motherboard: Motherboard,
    mySmartBoard: mySmartBoard,
    Progressor: Progressor,
    WHC06: WHC06
  }[dropdown.value]

  if (!selectedDeviceClass) return

  const selectedDevice = new selectedDeviceClass()

  bluetoothDevice.value = selectedDevice

  connect(() => {
    // Close Dialog
    dialog.value = false
    // Start workout
    emit('start')
  })
}

const reset = () => {
  bluetoothDevice.value?.disconnect()
  bluetoothDevice.value = null
}
</script>

<template>
  <div>
    <v-btn
      v-if="isBluetoothSupported()"
      :disabled="!isBluetoothAvailable"
      :size="size"
      color="text"
      :icon="!bluetoothDevice ? '$bluetooth' : '$bluetoothOff'"
      variant="text"
      @click="dialog = true"
    ></v-btn>
    <v-dialog v-model="dialog" :scrim="false" fullscreen transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar>
          <v-btn color="text" icon="$close" @click="dialog = false"></v-btn>
          <v-toolbar-title>Force-Sensing Climbing Training</v-toolbar-title>
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
                    <a
                      href="https://griptonite.io/shop/motherboard/"
                      target="_blank"
                      rel="nofollow"
                    >
                      Griptonite Motherboard</a
                    >,
                    <a href="https://tindeq.com/" target="_blank" rel="nofollow">
                      Tindeq Progressor</a
                    >,
                    <a
                      href="https://pitchsix.com/products/force-board-portable"
                      target="_blank"
                      rel="nofollow"
                    >
                      PitchSix Force Board</a
                    >,
                    <a
                      href="https://weihengmanufacturer.com/products/wh-c06-bluetooth-300kg-hanging-scale/"
                      target="_blank"
                      rel="nofollow"
                    >
                      Weiheng WH-C06</a
                    >, <a href="https://entralpi.com/" target="_blank" rel="nofollow">Entralpi</a>,
                    <a href="https://climbro.com/" target="_blank" rel="nofollow">Climbro</a> or
                    <a href="https://www.smartboard-climbing.com/" target="_blank" rel="nofollow"
                      >mySmartBoard</a
                    >
                    offer performance tracking, and real-time feedback enhancing climbers' strength
                    and technique with data-driven insights.
                  </p>
                  <p class="mb-4">
                    Excitingly, HangTime is now integrating bluetooth support, enhancing climbers'
                    training experiences. With the real-time feedback, HangTime users can seamlessly
                    sync and analyze their performance metrics, revolutionizing climbing training
                    for greater efficiency and progress.
                  </p>
                  <v-select v-model="dropdown" :items="devices" :item-props="true"></v-select>
                  <v-alert
                    v-if="bluetoothError"
                    closable
                    type="error"
                    :text="bluetoothError.message"
                  ></v-alert>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    :disabled="!isBluetoothAvailable"
                    :prepend-icon="!bluetoothDevice ? '$bluetooth' : '$bluetoothOff'"
                    color="text"
                    variant="text"
                    @click="!bluetoothDevice ? setup() : reset()"
                  >
                    {{ !bluetoothDevice ? 'Connect' : 'Disconnect' }}
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
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
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
