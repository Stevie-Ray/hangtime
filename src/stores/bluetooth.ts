import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBluetoothStore = defineStore('bluetooth', () => {
  const device = ref()

  return {
    device
  }
})
