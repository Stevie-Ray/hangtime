import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthenticationStore } from '@/stores/authentication.store'
import { purchase } from 'vue-gtag'

/**
 * Composable for handling Play Billing subscriptions via the Digital Goods API.
 *
 * @returns {Object} A collection of reactive properties and methods for working with Play Billing.
 */
export function usePlayBilling() {
  // Pinia authentication store references
  const { user } = storeToRefs(useAuthenticationStore())
  const { updateUser } = useAuthenticationStore()
  // Flag indicating whether the purchase button is disabled.
  const disabled = ref(true)
  // Formatted price of the subscription.
  const price = ref('')
  // Current status of a purchase.
  const buyStatus = ref('')
  // Logging messages
  const logField = ref('')
  // Array of completed or in-progress purchases.
  const purchasesList = ref<PurchaseDetails[]>([])
  // A single DigitalGoodsProductDetails object (e.g., for subscription). Initially null, populated in `populatePrice`.
  let item: DigitalGoodsProductDetails | null = null
  // Can subscribe to Play Billing
  const canSubscribePlayBilling = ref(false)
  // Constant indicating how many minutes of free usage are allowed before subscribing.
  const subscribeLimit = 30
  // The Payment method string for the Digital Goods API.
  const PAYMENT_METHOD = 'https://play.google.com/billing'
  // Check if global `getDigitalGoodsService` API is available.
  const canSubscribe = window.getDigitalGoodsService

  /**
   * Logs a message both to the browser console and appends it to `logField`.
   * @param {string} contents - The message to be logged.
   * @returns {void}
   */
  function log(contents: string): void {
    console.log(contents)
    logField.value += `${contents}\n`
  }

  /**
   * Attempts to parse the Chrome version from the user agent string.
   * @returns {number | false} The Chrome version if found, otherwise false.
   */
  function getChromeVersion(): number | false {
    const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)
    return raw ? parseInt(raw[2], 10) : false
  }

  /**
   * Checks whether the `window.getDigitalGoodsService` function is available.
   * @returns {boolean} True if available, otherwise false.
   */
  function hasDigitalGoodsService(): boolean {
    if (canSubscribe === undefined) {
      log("window doesn't have getDigitalGoodsService.")
      return false
    }
    return true
  }

  /**
   * Logs whether the Digital Goods Service is supported, and logs the Chrome version if relevant.
   * @returns {void}
   */
  function checkSupport(): void {
    if (canSubscribe !== undefined) {
      log('Digital Goods Service is available.')
      return
    }
    log('Digital Goods Service is not available.')
    const ver = getChromeVersion()
    if (ver) {
      log(`Chrome version: ${ver}`)
    }
  }

  /**
   * Retrieves and populates the price for a given SKU.
   * @async
   * @param {string} sku - The SKU for the subscription/product.
   * @returns {Promise<boolean>} Whether the price was successfully retrieved.
   */
  async function populatePrice(sku: string): Promise<boolean> {
    if (!hasDigitalGoodsService()) return false
    try {
      const service = await window.getDigitalGoodsService(PAYMENT_METHOD)
      if (service === null) {
        log('Play Billing is not available.')
        return false
      }
      const details = await service.getDetails([sku])
      if (details.length === 0) {
        log(`Could not get "${sku}", are you running a Play Store build?`)
        return false
      }
      log(JSON.stringify(details, null, 2))

      item = details[0]
      const { value, currency } = item.price

      price.value = new Intl.NumberFormat(navigator.language, {
        style: 'currency',
        currency
      }).format(Number(value))
      return true
    } catch (error) {
      if (error instanceof Error) {
        log(error.message)
      }
    }
    return false
  }

  /**
   * Retrieves the list of purchases for the current user session.
   * @async
   * @returns {Promise<void>}
   */
  async function listPurchases(): Promise<void> {
    if (!hasDigitalGoodsService()) return
    try {
      const service = await window.getDigitalGoodsService(PAYMENT_METHOD)
      if (service === null) {
        // DGAPI 1.0 - Play Billing is not available. Use another payment flow.
        log('Play Billing is not available.')
        return
      }
      const purchases = await service.listPurchases()
      log('Got purchases list.')
      purchasesList.value = purchases
    } catch (error) {
      // DGAPI 2.0 - Play Billing is not available. Use another payment flow.
      log('Play Billing is not available.')
      if (error instanceof Error) {
        log(error.message)
      }
    }
  }

  /**
   * Acknowledges (consumes) a purchase token.
   * For example, after a purchase is completed, the token must be acknowledged.
   * @async
   * @param {string} token - The token string returned by the purchase flow.
   * @param {string} [type='repeatable'] - The type of the purchase (repeatable, one-time, etc.).
   * @param {Function} [onComplete=() => {}] - Callback fired after successful acknowledgement.
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function acknowledge(token: string, type = 'repeatable', onComplete = () => {}) {
    if (!hasDigitalGoodsService()) return
    try {
      const service = await window.getDigitalGoodsService(PAYMENT_METHOD)
      if (service === null) {
        // DGAPI 1.0 -  Play Billing is not available. Use another payment flow.
        log('Play Billing is not available.')
        return
      }
      if ('acknowledge' in service) {
        // DGAPI 1.0
        log('error')
      } else {
        // DGAPI 2.0
        await service.consume(token)
      }
      log('Purchase acknowledged.')
      onComplete()
    } catch (error) {
      // DGAPI 2.0 - Play Billing is not available. Use another payment flow.
      if (error instanceof Error) {
        log(error.message)
      }
    }
  }

  /**
   * Creates and shows a PaymentRequest for the given SKU.
   * If payment is successful, the resulting token is passed to `onToken`.
   *
   * @param {string} sku - The SKU representing the product/subscription.
   * @param {(token: string) => void} [onToken] - Callback for handling the token after payment.
   * @returns {void}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function trigger(sku: string, onToken: (token: string) => void = (token: string) => {}): void {
    // The PaymentRequest() constructor creates a new PaymentRequest object which will be used to handle the process of generating, validating, and submitting a payment request.
    if (!window.PaymentRequest) {
      log('No PaymentRequest object.')
      return
    }
    // Contains an array of identifiers for the payment methods the merchant web site accepts and any associated payment method specific data.
    const supportedInstruments = [
      {
        // For example, the basic card payment method is selected by specifying the string basic-card here.
        supportedMethods: PAYMENT_METHOD,
        // A JSON-serializable object that provides optional information that might be needed by the supported payment methods.
        data: {
          sku
        }
      }
    ]
    // Provides information about the requested transaction.
    const details = {
      // The total amount of the payment request.
      total: {
        label: 'Subscription',
        amount: { currency: item?.price.currency ?? '', value: item?.price.value ?? '' }
      }
    }
    const request = new PaymentRequest(supportedInstruments, details)

    /**
     * Internal method to handle the PaymentResponse from the PaymentRequest.
     * @param {PaymentResponse} response - The response from the PaymentRequest flow.
     */
    function handlePaymentResponse(response: PaymentResponse) {
      window.setTimeout(() => {
        response
          .complete('success')

          .then(() => {
            log(`Payment done: ${JSON.stringify(response, undefined, 2)}`)
            if (response.details && response.details.token) {
              const { token } = response.details
              log(`Read Token: ${token.substring(0, 6)}...`)
              onToken(token)
            }
          })
          .catch((error: unknown) => {
            if (error instanceof Error) {
              log(error.message)
            }
            log(JSON.stringify(response, undefined, 2))
          })
        // request = buildPaymentRequest();
      }, 500)
    }
    if (request.canMakePayment) {
      request
        .canMakePayment()

        .then((result) => {
          log(result ? 'Can make payment' : 'Cannot make payment')
          // if (result) {
          //   request.show().then(handlePaymentResponse)
          // }
        })

        .catch((e) => {
          log(e.message)
        })
    }
    // Checking for instrument presence.
    // @ts-expect-error Chrome only
    if (request.hasEnrolledInstrument) {
      request
        // @ts-expect-error Chrome only
        .hasEnrolledInstrument()

        .then((result: unknown) => {
          if (result) {
            log('Has enrolled instrument')
          } else {
            log('No enrolled instrument')
          }
          // Call show even if we don't have any enrolled instruments.
          request
            .show()
            .then(handlePaymentResponse)

            .catch((e) => {
              // log(JSON.stringify(e, undefined, 2));
              log(e)
              log("Maybe you've already purchased the item (try acknowledging first).")
            })
        })
        .catch((error: unknown) => {
          if (error instanceof Error) {
            log(error.message)
          }
          // Also call show if hasEnrolledInstrument throws.
          request
            .show()
            .then(handlePaymentResponse)

            .catch((e) => {
              log(JSON.stringify(e, undefined, 2))
              log(e)
            })
        })
    }
  }

  /**
   * Initiates a subscription purchase.
   * @returns {void}
   */
  function buySubscription(): void {
    trigger('subscription', (token) => {
      buyStatus.value = 'Purchase processing..'
      acknowledge(token, 'repeatable', () => {
        if (user.value) {
          user.value.subscribed = true
          updateUser()
        }
        // gtag.js
        purchase({
          transaction_id: token,
          affiliation: 'HangTime',
          value: Number(item?.price?.value),
          // currency: item?.price.currency,
          tax: 0,
          shipping: 0,
          items: [
            {
              id: 'subscription',
              name: 'Subscription',
              brand: 'HangTime',
              // currency: item?.price.currency,
              price: item?.price?.value,
              quantity: 1
            }
          ]
        })
        buyStatus.value = 'Purchase successful, thank you!'
      })
    })
  }

  /**
   * Loads and populates the subscription SKU details (e.g. price).
   * Also checks whether to enable the purchase button.
   * @async
   * @returns {Promise<void>}
   */
  async function loadSkus(): Promise<void> {
    checkSupport()
    const playStoreBuild = await populatePrice('subscription')
    // If price data is available, enable the purchase button
    if (playStoreBuild) {
      disabled.value = false
    }
  }

  onMounted(() => {
    loadSkus()
  })

  return {
    canSubscribePlayBilling,
    subscribeLimit,
    hasDigitalGoodsService,
    disabled,
    price,
    buyStatus,
    logField,
    purchasesList,
    canSubscribe,
    buySubscription,
    listPurchases,
    acknowledge
  }
}
