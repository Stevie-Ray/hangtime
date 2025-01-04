import { onMounted, ref } from 'vue'

export function usePlayBilling() {
  /** Can subscribe to Play Billing */
  const canSubscribePlayBilling = ref(false)
  /** Minutes of free usage */
  const subscribeLimit = 30
  /** Payment method */
  const PAYMENT_METHOD = 'https://play.google.com/billing'
  /** Get a DigitalGoodsService instance for the given service provider URL. The URL should be given by your payment provider and support the Digital Goods API (e.g. "https://play.google.com/billing"). */
  const canSubscribe = window.getDigitalGoodsService

  /** Has Digital Goods Service */
  function hasDigitalGoodsService() {
    if (canSubscribe === undefined) {
      // Digital Goods API is not supported in this context.
      console.log("window doesn't have getDigitalGoodsService.")
      return false
    }
    return true
  }

  /** Check if Play Billing is available */
  async function canUsePlayBilling() {
    if (!hasDigitalGoodsService()) return
    try {
      const service = await window.getDigitalGoodsService(PAYMENT_METHOD)
      // console.log(service)
      if (service === null) {
        console.log('Play Billing is not available.')
      } else {
        const items = ['subscription']
        const details = await service.getDetails(items)

        // console.log(details)
        if (!details || details.length === 0) {
          console.log('No subscription details found. Are you running a Play Store build?')
        } else {
          canSubscribePlayBilling.value = true
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  /** Check if Play Billing and subscription are available */
  onMounted(() => {
    canUsePlayBilling()
  })

  return {
    canSubscribePlayBilling,
    subscribeLimit,
    hasDigitalGoodsService
  }
}
