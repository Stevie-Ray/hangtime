import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBluetooth = defineStore('bluetooth', () => {
  const device = ref()

  return {
    device
  }
})
