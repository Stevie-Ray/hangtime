<template>
  <v-layout class="subscription">
    <v-app-bar color="primary" app fixed dark>
      <v-icon @click="$router.push({ name: 'settings' })">{{
        mdi.arrowLeft
      }}</v-icon>
      <v-toolbar-title>
        {{ $t('Subscription') }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
        v-if="purchasesList.length === 0"
        :disabled="!canSubscribe"
        icon
        @click="listPurchases"
      >
        <v-icon>{{ mdi.reload }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card flat>
              <v-card-title>
                {{ $t('Enjoying {appTitle}?', { appTitle: appTitle }) }}
              </v-card-title>
              <v-card-subtitle>
                <span>{{ appTitle }} gives you </span>
                <span style="text-decoration: line-through;">60 minutes</span>
                <strong> {{ limit }} minutes</strong> of free usage.
                <span>Want to do more? </span>
                <span>Buy a subscription! After that it's free forever.</span>
              </v-card-subtitle>
              <v-card-text>
                <div class="text-h6 mb-1">{{ $t('Current usage') }}</div>
                <v-progress-linear
                  v-if="user && user.completed"
                  :value="porgressValue"
                  color="primary"
                  height="25"
                >
                  <template #default="{ value }">
                    <strong
                      v-if="user && !user.subscribed"
                      style="color: white;"
                    >
                      {{ Math.ceil(value)
                      }}<span v-if="isFinite(value)">%</span>
                    </strong>
                  </template>
                </v-progress-linear>
                <p>{{ count(user.completed.time) }} minutes.</p>
                <v-row>
                  <v-col cols="12" class="text-center">
                    <div v-if="canSubscribe">
                      <div class="text-h5 mb-6">{{ price }}</div>
                      <v-btn
                        color="primary"
                        x-large
                        :disabled="disabled || (user && user.subscribed)"
                        @click="buySubscription"
                      >
                        <v-icon left>
                          {{ mdi.cashMultiple }}
                        </v-icon>
                        {{ $t('Buy') }}
                      </v-btn>
                    </div>
                    <div v-else>
                      <strong>
                        {{ $t("It's currently not possible to pay.") }}
                      </strong>
                    </div>
                    <p class="mt-2">{{ buyStatus }}</p>
                    <p v-if="user && user.subscribed">
                      <strong>Subscription is valid</strong>
                    </p>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <v-card v-if="purchasesList.length > 0" flat>
              <v-card-title>
                {{ $t('Purchases') }}
              </v-card-title>
              <v-list-item
                v-for="(purchase, index) in purchasesList"
                :key="index"
                three-line
              >
                <v-list-item-content>
                  <v-list-item-title
                    >ItemId: {{ purchase.itemId }}</v-list-item-title
                  >
                  <v-list-item-subtitle>
                    Acknowledged: {{ purchase.acknowledged }}, willAutoRenew:
                    {{ purchase.willAutoRenew }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    purchaseState: {{ purchase.purchaseState }}, purchaseTime:
                    {{ purchase.purchaseTime }}, purchaseToken:
                    {{ purchase.purchaseToken }}
                  </v-list-item-subtitle>
                  <v-list-item-action>
                    <v-btn
                      icon
                      @click="acknowledge(purchase.purchaseToken, 'repeatable')"
                    >
                      <v-icon>
                        {{ mdi.delete }}
                      </v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item-content>
              </v-list-item>
            </v-card>
            <v-expansion-panels v-if="debug" flat>
              <v-expansion-panel>
                <v-expansion-panel-header
                  class="title"
                  style="padding-left: 16px; padding-right: 16px;"
                >
                  {{ $t('Log') }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <span style="white-space: pre-wrap; word-break: break-all;">
                    {{ logField }}
                  </span>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { getImg, count } from '@/misc/helpers'

import { mdiArrowLeft, mdiDelete, mdiCashMultiple, mdiReload } from '@mdi/js'

export default {
  data: () => ({
    mdi: {
      arrowLeft: mdiArrowLeft,
      delete: mdiDelete,
      cashMultiple: mdiCashMultiple,
      reload: mdiReload
    },
    debug: false,
    canSubscribe: window.getDigitalGoodsService,
    price: '',
    item: {
      currency: 'EUR',
      value: 0
    },
    limit: 100,
    disabled: true,
    buyStatus: '',
    logField: '',
    purchasesList: [],
    PAYMENT_METHOD: 'https://play.google.com/billing'
  }),
  head: {
    title: {
      inner: 'Subscription'
    },
    meta: [
      {
        name: 'description',
        content: 'User subscription',
        id: 'desc'
      }
    ]
  },
  computed: {
    ...mapState('app', ['networkOnLine']),
    ...mapState('authentication', ['user']),
    ...mapState('app', ['appTitle']),
    porgressValue() {
      let time = 60
      if (!this.user || (this.user && this.user.subscribed)) time = 0
      return ((this.user.completed.time / time) * 100) / this.limit
    }
  },
  mounted() {
    this.loadSkus()
  },
  methods: {
    getImg,
    count,
    ...mapActions('authentication', ['triggerUpdateUser']),
    ...mapMutations('authentication', ['setSubscription']),
    async loadSkus() {
      this.checkSupport()
      // get price
      const playStoreBuild = await this.populatePrice('subscription')
      // enable button
      if (playStoreBuild) {
        this.disabled = false
      }
    },
    async listPurchases() {
      try {
        if (this.canSubscribe) {
          const service = await window.getDigitalGoodsService(
            this.PAYMENT_METHOD
          )
          const purchases = await service.listPurchases()
          this.log('Got purchases list.')
          this.purchasesList = purchases
        } else {
          this.log("window doesn't have getDigitalGoodsService.")
        }
      } catch (error) {
        this.log(error)
      }
    },
    async populatePrice(sku) {
      try {
        if (this.canSubscribe) {
          const service = await window.getDigitalGoodsService(
            this.PAYMENT_METHOD
          )
          const details = await service.getDetails([sku])

          if (details.length === 0) {
            this.log(
              `Could not get "${sku}", are you running a Play Store build?`
            )
            return false
          }
          this.log(JSON.stringify(details, null, 2))

          const item = details[0]
          const { value } = item.price
          const { currency } = item.price

          this.item.value = item.price.value
          this.item.currency = item.price.currency
          this.price = new Intl.NumberFormat(navigator.language, {
            style: 'currency',
            currency
          }).format(value)

          return true
        }
      } catch (error) {
        this.log(error)
      }
      return false
    },
    async acknowledge(token, type = 'repeatable', onComplete = () => {}) {
      try {
        if (this.canSubscribe) {
          const service = await window.getDigitalGoodsService(
            this.PAYMENT_METHOD
          )
          await service.acknowledge(token, type)
          this.log('Purchase acknowledged.')
          onComplete()
        } else {
          this.log("window doesn't have getDigitalGoodsService.")
        }
      } catch (error) {
        this.log(error)
      }
    },
    trigger(sku, onToken = () => {}) {
      const self = this

      // The PaymentRequest() constructor creates a new PaymentRequest object which will be used to handle the process of generating, validating, and submitting a payment request.
      if (!window.PaymentRequest) {
        this.log('No PaymentRequest object.')
        return
      }

      // Contains an array of identifiers for the payment methods the merchant web site accepts and any associated payment method specific data.
      const supportedInstruments = [
        {
          // For example, the basic card payment method is selected by specifying the string basic-card here.
          supportedMethods: this.PAYMENT_METHOD,
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
          amount: { currency: self.item.currency, value: self.item.value }
        }
      }

      const request = new PaymentRequest(supportedInstruments, details)

      function handlePaymentResponse(response) {
        window.setTimeout(() => {
          response
            .complete('success')
            // eslint-disable-next-line func-names
            .then(function () {
              self.log(
                `Payment done: ${JSON.stringify(response, undefined, 2)}`
              )
              if (response.details && response.details.token) {
                const { token } = response.details
                self.log(`Read Token: ${token.substring(0, 6)}...`)
                onToken(token)
              }
            })
            // eslint-disable-next-line func-names
            .catch(function (e) {
              self.log(e.message)
              self.log(JSON.stringify(response, undefined, 2))
            })
          // request = buildPaymentRequest();
        }, 500)
      }

      if (request.canMakePayment) {
        request
          .canMakePayment()
          // eslint-disable-next-line func-names
          .then(function (result) {
            self.log(result ? 'Can make payment' : 'Cannot make payment')
          })
          // eslint-disable-next-line func-names
          .catch(function (e) {
            self.log(e.message)
          })
      }

      // Checking for instrument presence.
      if (request.hasEnrolledInstrument) {
        request
          .hasEnrolledInstrument()
          // eslint-disable-next-line func-names
          .then(function (result) {
            if (result) {
              self.log('Has enrolled instrument')
            } else {
              self.log('No enrolled instrument')
            }

            // Call show even if we don't have any enrolled instruments.
            request
              .show()
              .then(handlePaymentResponse)
              // eslint-disable-next-line func-names
              .catch(function (e) {
                // log(JSON.stringify(e, undefined, 2));
                self.log(e)
                self.log(
                  "Maybe you've already purchased the item (try acknowledging first)."
                )
              })
          })
          // eslint-disable-next-line func-names
          .catch(function (e) {
            self.log(e.message)

            // Also call show if hasEnrolledInstrument throws.
            request
              .show()
              .then(handlePaymentResponse)
              // eslint-disable-next-line no-shadow,func-names
              .catch(function (e) {
                self.log(JSON.stringify(e, undefined, 2))
                self.log(e)
              })
          })
      }
    },
    buySubscription() {
      this.trigger('subscription', (token) => {
        this.buyStatus = 'Purchase processing..'
        this.setSubscription(true)
        this.triggerUpdateUser()
        this.acknowledge(token, 'onetime', () => {
          this.buyStatus = 'Purchase successful, thank you!'
        })
      })
    },
    log(contents) {
      this.logField += `${contents}\n`
    },
    getChromeVersion() {
      const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)
      return raw ? parseInt(raw[2], 10) : false
    },
    checkSupport() {
      if (this.canSubscribe) {
        this.log('Digital Goods Service is available.')
        return
      }
      this.log('Digital Goods Service is not available.')
      const ver = this.getChromeVersion()
      if (ver) {
        this.log(`Chrome version: ${ver}`)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
