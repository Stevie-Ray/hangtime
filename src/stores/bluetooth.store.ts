import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  Climbro,
  Entralpi,
  ForceBoard,
  Motherboard,
  WHC06,
  mySmartBoard,
  Progressor
} from '@hangtime/grip-connect'
import { massObject } from '@hangtime/grip-connect/dist/interfaces/callback.interface'

export const useBluetoothStore = defineStore('bluetooth', () => {
  // bluetooth device
  const bluetoothDevice = ref<
    Climbro | Entralpi | ForceBoard | Motherboard | WHC06 | mySmartBoard | Progressor | null
  >()
  // is bluetooth device in use
  const bluetoothInUse = ref(false)
  // output data from bluetooth device
  const bluetoothOutput = ref<massObject | null>(null)
  // error from bluetooth device
  const bluetoothError = ref<Error | null>(null)

  /**
   * Wrapper for connect to a bluetooth device
   * @param onSuccess - Callback function to be called when the device is connected
   */
  const connect = (onSuccess: () => void) => {
    bluetoothDevice.value?.connect(
      async () => {
        // Listen for notifications
        bluetoothDevice.value?.notify((data) => {
          bluetoothOutput.value = data
        })

        bluetoothDevice.value?.active(
          (isActive: boolean) => {
            bluetoothInUse.value = isActive
          },
          { threshold: 2.5, duration: 1000 }
        )

        // add a callback function
        onSuccess()
      },
      (error: Error) => {
        bluetoothError.value = error
      }
    )
  }

  return {
    bluetoothDevice,
    bluetoothInUse,
    bluetoothOutput,
    bluetoothError,
    connect
  }
})
