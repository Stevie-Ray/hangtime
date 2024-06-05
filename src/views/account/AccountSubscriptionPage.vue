<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { purchase } from 'vue-gtag'
import { useAuthentication } from '@/stores/authentication'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'

import { time } from '@/helpers'

const { t } = useI18n()

const { user } = storeToRefs(useAuthentication())
const { updateUser } = useAuthentication()

const debug = false
const disabled = ref(true)
const canSubscribe = window.getDigitalGoodsService
const limit = 30
const PAYMENT_METHOD = 'https://play.google.com/billing'

let price = ''
let item: DigitalGoodsProductDetails | null = null
let buyStatus = ''
let logField = ''
let purchasesList: PurchaseDetails[] = []

const progressValue = computed(() => {
  // eslint-disable-next-line no-shadow
  let time = 60
  // eslint-disable-next-line no-unsafe-optional-chaining
  if (!user || user?.value?.subscribed) time = 0
  const completedTime = user?.value?.completed?.time ? user.value.completed.time : 0
  const value = ((completedTime / time) * 100) / limit
  return value < 100 ? value : 100
})

function log(contents: string): void {
  // eslint-disable-next-line no-console
  console.log(contents)
  logField += `${contents}\n`
}

function getChromeVersion(): number | false {
  const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)
  return raw ? parseInt(raw[2], 10) : false
}

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
async function populatePrice(sku: string): Promise<boolean> {
  if (canSubscribe === undefined) {
    // Digital Goods API is not supported in this context.
    log("window doesn't have getDigitalGoodsService.")

    return false
  }
  try {
    const service = await window.getDigitalGoodsService(PAYMENT_METHOD)
    if (service === null) {
      // DGAPI 1.0 - Play Billing is not available. Use another payment flow.
      log('Play Billing is not available.')
      return false
    }
    const details = await service.getDetails([sku])
    if (details.length === 0) {
      log(`Could not get "${sku}", are you running a Play Store build?`)
      return false
    }
    log(JSON.stringify(details, null, 2))
    // eslint-disable-next-line prefer-destructuring
    item = details[0]
    const { value } = item.price
    const { currency } = item.price

    price = new Intl.NumberFormat(navigator.language, {
      style: 'currency',
      currency
    }).format(Number(value))
    return true
  } catch (error) {
    // DGAPI 2.0 - Play Billing is not available. Use another payment flow.
    if (error instanceof Error) {
      log(error.message)
    }
  }
  return false
}

async function loadSkus(): Promise<void> {
  checkSupport()
  // get price
  const playStoreBuild = await populatePrice('subscription')
  // enable button
  if (playStoreBuild) {
    disabled.value = false
  }
}
async function listPurchases(): Promise<void> {
  if (canSubscribe === undefined) {
    // Digital Goods API is not supported in this context.
    log("window doesn't have getDigitalGoodsService.")
    return
  }
  try {
    const service = await window.getDigitalGoodsService(PAYMENT_METHOD)
    if (service === null) {
      // DGAPI 1.0 - Play Billing is not available. Use another payment flow.
      log('Play Billing is not available.')
      return
    }
    const purchases = await service.listPurchases()
    log('Got purchases list.')
    purchasesList = purchases
  } catch (error) {
    // DGAPI 2.0 - Play Billing is not available. Use another payment flow.
    log('Play Billing is not available.')
    if (error instanceof Error) {
      log(error.message)
    }
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function acknowledge(token: string, type = 'repeatable', onComplete = () => {}) {
  if (canSubscribe === undefined) {
    // Digital Goods API is not supported in this context.
    log("window doesn't have getDigitalGoodsService.")

    return
  }
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function trigger(sku: string, onToken = (token: string) => {}) {
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
  function handlePaymentResponse(response: PaymentResponse) {
    window.setTimeout(() => {
      response
        .complete('success')
        // eslint-disable-next-line func-names
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
      // eslint-disable-next-line func-names
      .then((result) => {
        log(result ? 'Can make payment' : 'Cannot make payment')
        // if (result) {
        //   request.show().then(handlePaymentResponse)
        // }
      })
      // eslint-disable-next-line func-names
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
      // eslint-disable-next-line func-names
      .then((result: any) => {
        if (result) {
          log('Has enrolled instrument')
        } else {
          log('No enrolled instrument')
        }
        // Call show even if we don't have any enrolled instruments.
        request
          .show()
          .then(handlePaymentResponse)
          // eslint-disable-next-line func-names
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
          // eslint-disable-next-line no-shadow,func-names
          .catch((e) => {
            log(JSON.stringify(e, undefined, 2))
            log(e)
          })
      })
  }
}
function buySubscription() {
  trigger('subscription', (token: string) => {
    buyStatus = 'Purchase processing..'
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
      buyStatus = 'Purchase successful, thank you!'
    })
  })
}
onMounted(() => {
  loadSkus()
})
const router = useRouter()
useHead({
  title: 'Subscription',
  meta: [{ name: 'description', content: '' }]
})
</script>
<template>
  <app-container prepend>
    <template #prepend>
      <v-icon @click="router.go(-1)">$arrowLeft</v-icon>
    </template>
    <template #title>
      {{ t('Subscription') }}
    </template>
    <template #icons>
      <v-btn
        v-if="purchasesList.length === 0"
        :disabled="!canSubscribe"
        icon="$reload"
        @click="listPurchases"
      ></v-btn>
    </template>
    <template #default>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>
                {{ t('Enjoying {appTitle}?', { appTitle: 'HangTime' }) }}
              </v-card-title>
              <v-card-text>
                <div class="mb-4">
                  <span>HangTime gives you </span>
                  <span style="text-decoration: line-through">{{ limit / 2 }} minutes</span>
                  <strong>&nbsp;{{ limit }} minutes</strong> of free usage.
                  <span>Want to do more? </span>
                  <span>Buy a subscription! After that it's free forever.</span>
                </div>
                <div class="text-h6">{{ t('Current usage') }}</div>
                <v-progress-linear
                  v-if="user?.completed"
                  :model-value="progressValue"
                  color="primary"
                  height="25"
                >
                  <template #default="{ value }">
                    <strong v-if="user && !user.subscribed" style="color: white">
                      {{ Math.ceil(value) }}<span v-if="isFinite(value)">%</span>
                    </strong>
                  </template>
                </v-progress-linear>
                <p v-if="user?.completed" class="mb-4">{{ time(user.completed.time) }} minutes.</p>
                <v-row class="text-center">
                  <v-col cols="12">
                    <div v-if="canSubscribe !== undefined">
                      <div class="text-h5 mb-6">{{ price }}</div>
                      <v-btn
                        color="primary"
                        x-large
                        :disabled="disabled || !!(user && user.subscribed)"
                        @click="buySubscription"
                      >
                        <v-icon left>$cashMultiple</v-icon>
                        {{ t('Buy') }}
                      </v-btn>
                    </div>
                    <div v-else>
                      <strong>
                        {{ t("It's currently not possible to pay") }}
                      </strong>
                    </div>
                    <p class="mt-4">{{ buyStatus }}</p>
                    <p v-if="user?.subscribed">
                      <strong>{{ t('Subscription is valid') }}</strong>
                    </p>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <v-card v-if="purchasesList.length > 0">
              <v-card-title>
                {{ t('Purchases') }}
              </v-card-title>
              <v-list-item v-for="(purchase, index) in purchasesList" :key="index" two-line>
                <v-list-item-title>ItemId: {{ purchase.itemId }}</v-list-item-title>
                <v-list-item-subtitle>
                  purchaseToken: {{ purchase.purchaseToken }}
                </v-list-item-subtitle>
                <v-list-item-action>
                  <v-btn icon @click="acknowledge(purchase.purchaseToken, 'repeatable')">
                    <v-icon>$delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-card>
            <v-expansion-panels v-if="debug">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  {{ t('Log') }}
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <span style="white-space: pre-wrap; word-break: break-all">
                    {{ logField }}
                  </span>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-container>
</template>
<style lang="scss" scoped></style>
