import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useBluetoothStore } from '@/stores/bluetooth.store'
import { ForceBoard, Motherboard, Progressor } from '@hangtime/grip-connect'

export function useBluetooth() {
  const bluetoothStore = useBluetoothStore()
  const { bluetoothDevice } = storeToRefs(bluetoothStore)

  const isBluetoothAvailable = ref(false)

  // check if the browser supports bluetooth
  const isBluetoothSupported = () => {
    return 'bluetooth' in navigator
  }

  // check if the device has a Bluetooth adapter
  const bluetoothAvailable = () => {
    if (isBluetoothSupported()) {
      navigator.bluetooth.getAvailability().then((isAvailable) => {
        isBluetoothAvailable.value = !!isAvailable
      })
    }
  }

  onMounted(() => {
    bluetoothAvailable()
  })

  /**
   * Start stream for selected bluetooth devices
   * @param duration - The duration of the stream in milliseconds
   */
  const stream = (duration?: number) => {
    if (
      bluetoothDevice.value &&
      (bluetoothDevice.value instanceof ForceBoard ||
        bluetoothDevice.value instanceof Motherboard ||
        bluetoothDevice.value instanceof Progressor)
    ) {
      bluetoothDevice.value.stream(duration)
    }
  }

  return {
    isBluetoothSupported,
    isBluetoothAvailable,
    stream
  }
}
