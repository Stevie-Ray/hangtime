<script setup>
import { ref } from 'vue'

// B1:12:BE:07:1E:18 or e6:c4:d8:ee:66:ef (Motherboard)

// Device service
const DEVICE_SERVICE_UUID = '0000180a-0000-1000-8000-00805f9b34fb'
const DEVICE_SN_CHARACTERISTIC_UUID = '00002a25-0000-1000-8000-00805f9b34fb'
const DEVICE_FR_CHARACTERISTIC_UUID = '00002a26-0000-1000-8000-00805f9b34fb'
const DEVICE_HR_CHARACTERISTIC_UUID = '00002a27-0000-1000-8000-00805f9b34fb'
const DEVICE_MN_CHARACTERISTIC_UUID = '00002a29-0000-1000-8000-00805f9b34fb'
// Battery service (Read / Notify)
const BATTERY_SERVICE_UUID = '0000180f-0000-1000-8000-00805f9b34fb'
const BATTERY_CHARACTERISTIC_UUID = '00002a19-0000-1000-8000-00805f9b34fb'
// Led service
const LED_SERVICE_UUID = '10ababcd-15e1-28ff-de13-725bea03b127'
const LED_01_CHARACTERISTIC_UUID = '10ab1524-15e1-28ff-de13-725bea03b127'
const LED_02_CHARACTERISTIC_UUID = '10ab1525-15e1-28ff-de13-725bea03b127'
// An implementation of Nordic Semicondutor's UART/Serial Port Emulation over Bluetooth low energy
const UART_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e'
const UART_TX_CHARACTERISTIC_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'
const UART_RX_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'

const data = ref()
const weight = ref()
const motherboard = ref()
const isBluetoothEnabled = ref()

// check if device has bluetooth
navigator.bluetooth.getAvailability().then((isBluetoothAvailable) => {
  isBluetoothEnabled.value = !!isBluetoothAvailable
})

const disconnect = () => {
  if (!motherboard.value) return
  if (motherboard.value.gatt.connected) {
    motherboard.value.gatt.disconnect()
  }
}

const onDisconnected = (event) => {
  motherboard.value = null
  const device = event.target
  console.log(`Device ${device.name} is disconnected.`)
}

const handleNotifications = (event) => {
  const receivedData = new Uint8Array(event.target.value.byteLength)
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < event.target.value.byteLength; i++) {
    receivedData[i] = event.target.value.getUint8(i)
  }
  const receivedString = String.fromCharCode.apply(null, receivedData)

  // Split the string into pairs of characters
  const hexPairs = receivedString.match(/.{1,2}/g)

  // Convert each hexadecimal pair to decimal
  const decimalArray = hexPairs?.map((hexPair) => parseInt(hexPair, 16))

  if (event.target.value.byteLength === 20) {
    // Define keys for the elements
    const elementKeys = [
      'frames',
      'cycle',
      'unknown',
      'eleven',
      'trippin1',
      'pressure1',
      'left',
      'trippin2',
      'pressure2',
      'right'
    ]
    // Create a single object with keys and values
    const dataObject = {}

    elementKeys.forEach((key, index) => {
      dataObject[key] = decimalArray[index]
    })
    // Print the formatted string on the screen
    data.value = dataObject
  } else if (event.target.value.byteLength === 14) {
    weight.value = decimalArray.join(', ')
  } else {
    console.log(event.target.value.byteLength, decimalArray)
  }
}

const write = (characteristic, message) => {
  if (motherboard.value.gatt.connected) {
    const encoder = new TextEncoder()
    if (characteristic) {
      console.log(characteristic.uuid, message)
      characteristic.writeValue(encoder.encode(message))
    }
  }
}

const read = (characteristic) => {
  if (motherboard.value.gatt.connected) {
    if (characteristic) {
      characteristic.readValue().then((value) => {
        switch (characteristic.uuid) {
          case BATTERY_CHARACTERISTIC_UUID:
            console.log(characteristic.uuid, value.getUint8(0))
            break
          default:
            // eslint-disable-next-line no-case-declarations
            const decoder = new TextDecoder('utf-8')
            console.log(characteristic.uuid, decoder.decode(value))
            break
        }
      })
    }
  }
}

const getCharacteristic = (service, uuid) => {
  service.getCharacteristic(uuid).then((characteristic) => {
    switch (characteristic.uuid) {
      case DEVICE_SN_CHARACTERISTIC_UUID:
        motherboard.value.devSn = characteristic
        break
      case DEVICE_FR_CHARACTERISTIC_UUID:
        motherboard.value.devFr = characteristic
        break
      case DEVICE_HR_CHARACTERISTIC_UUID:
        motherboard.value.devHr = characteristic
        break
      case DEVICE_MN_CHARACTERISTIC_UUID:
        motherboard.value.devMn = characteristic
        break
      case BATTERY_CHARACTERISTIC_UUID:
        motherboard.value.bat = characteristic
        break
      case LED_01_CHARACTERISTIC_UUID:
        motherboard.value.led01 = characteristic
        break
      case LED_02_CHARACTERISTIC_UUID:
        motherboard.value.led02 = characteristic
        break
      case UART_TX_CHARACTERISTIC_UUID:
        motherboard.value.uartTx = characteristic
        break
      case UART_RX_CHARACTERISTIC_UUID:
        motherboard.value.uartRx = characteristic
        motherboard.value.uartRx.startNotifications()
        motherboard.value.uartRx.addEventListener('characteristicvaluechanged', handleNotifications)
        break
      default:
        break
    }
  })
}

const sequence = () => {
  // Wait for 0.5 seconds
  setTimeout(() => {
    // Get battery level
    read(motherboard.value.bat)
    read(motherboard.value.devMn)
    read(motherboard.value.devHr)
    read(motherboard.value.devFr)
    // Wait for 0.5 seconds
    setTimeout(() => {
      write(motherboard.value.led02, '1')
      // Wait for 2 seconds
      setTimeout(() => {
        write(motherboard.value.led01, '1')
        write(motherboard.value.led02, '1')
        // Wait for another 2 seconds
        setTimeout(() => {
          // The value could be 'S1' to 'S30' or 'A', 'B', 'C'
          write(motherboard.value.uartTx, 'S2')
        }, 2000)
      }, 2000)
    }, 1000)
  }, 500)
}

const connect = () => {
  navigator.bluetooth
    .requestDevice({
      filters: [
        {
          name: 'Motherboard'
        },
        {
          manufacturerData: [
            {
              companyIdentifier: 0x2a29
            }
          ]
        }
      ],
      optionalServices: [
        DEVICE_SERVICE_UUID,
        BATTERY_SERVICE_UUID,
        UART_SERVICE_UUID,
        LED_SERVICE_UUID
      ]
    })
    .then(async (device) => {
      motherboard.value = device
      device.addEventListener('gattserverdisconnected', onDisconnected)
      return device.gatt.connect()
    })
    .then((server) => {
      return server.getPrimaryServices()
    })
    .then((services) => {
      // console.log(services)
      if (services === null) {
        console.log("[getPrimaryServices] Service is 'null'")
      } else {
        // eslint-disable-next-line no-restricted-syntax
        for (const service of services) {
          switch (service.uuid) {
            case DEVICE_SERVICE_UUID:
              // getCharacteristic(service, DEVICE_SN_CHARACTERISTIC_UUID) getCharacteristic(s) called with blocklisted UUID
              getCharacteristic(service, DEVICE_FR_CHARACTERISTIC_UUID)
              getCharacteristic(service, DEVICE_HR_CHARACTERISTIC_UUID)
              getCharacteristic(service, DEVICE_MN_CHARACTERISTIC_UUID)
              break
            case BATTERY_SERVICE_UUID:
              getCharacteristic(service, BATTERY_CHARACTERISTIC_UUID)
              break
            case LED_SERVICE_UUID:
              getCharacteristic(service, LED_01_CHARACTERISTIC_UUID)
              getCharacteristic(service, LED_02_CHARACTERISTIC_UUID)
              break
            case UART_SERVICE_UUID:
              getCharacteristic(service, UART_TX_CHARACTERISTIC_UUID)
              getCharacteristic(service, UART_RX_CHARACTERISTIC_UUID)
              break
            default:
              break
          }
        }
        sequence()
      }
    })
    .catch((error) => {
      console.log(error)
      data.value = error
    })
}
</script>

<template>
  <div>
    <v-btn
      :disabled="!isBluetoothEnabled"
      @click="!motherboard ? connect() : disconnect()"
      :icon="!motherboard ? '$bluetooth' : '$bluetoothOff'"
    />
    <v-card v-if="weight" class="mb-4">
      <v-card-title>Weight</v-card-title>
      <v-card-subtitle>{{ weight }}</v-card-subtitle>
    </v-card>
    <v-card v-if="data" class="mb-4">
      <v-card-title>Frames</v-card-title>
      <v-card-subtitle>{{ data.frames }} / {{ data.cycle }}</v-card-subtitle>
    </v-card>
    <v-card v-if="data" class="mb-4">
      <v-card-title>Unknown</v-card-title>
      <v-card-subtitle>{{ data.unknown }} / {{ data.eleven }}</v-card-subtitle>
    </v-card>
    <v-row v-if="data" class="mb-4">
      <v-col cols="6">
        <v-card
          :class="
            data.left === 7
              ? 'bg-grey'
              : data.left === 6
                ? 'bg-grey-lighten-1'
                : data.left === 5
                  ? 'bg-grey-lighten-2'
                  : data.left === 4
                    ? 'bg-grey-lighten-3'
                    : data.left === 5
                      ? 'bg-grey-lighten-4'
                      : 'bg-grey-lighten-5'
          "
        >
          <v-card-text> {{ data.left }} / {{ data.pressure1 }} / {{ data.trippin1 }} </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card
          :class="
            data.right === 1
              ? 'bg-grey'
              : data.right === 2
                ? 'bg-grey-lighten-1'
                : data.right === 3
                  ? 'bg-grey-lighten-2'
                  : data.right === 4
                    ? 'bg-grey-lighten-3'
                    : data.right === 5
                      ? 'bg-grey-lighten-4'
                      : 'bg-grey-lighten-5'
          "
        >
          <v-card-text> {{ data.right }} / {{ data.pressure2 }} / {{ data.trippin2 }} </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss" scoped></style>
