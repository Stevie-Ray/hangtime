<template>
  <v-layout class="subscription">
    <v-app-bar color="primary" app fixed dark>
      <v-icon @click="$router.push({ name: 'settings' })">{{
        mdi.arrowLeft
      }}</v-icon>
      <v-toolbar-title>
        {{ $t('Subscription') }} ({{ $t('soon') }})
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-text>
                <v-btn :disabled="disabled" @click="buySubscription">
                  {{ $t('Buy') }}
                </v-btn>
                <v-btn v-if="acknowledgeable" @click="acknowledgeSubscription">
                  {{ $t('Acknowledge') }}
                </v-btn>
                <p>{{ buyStatus }}</p>
                <div>Price: {{ price }}</div>
              </v-card-text>
            </v-card>
            <v-card>
              <v-card-title>
                Purchases
              </v-card-title>
              <v-card-text>
                <div v-for="(item, index) in purchasesField" :key="index">
                  {{ item }}
                </div>
                <v-btn @click="listPurchases">
                  List Purchases
                </v-btn>
              </v-card-text>
            </v-card>
            <v-card>
              <v-card-title>
                Log
              </v-card-title>
              <v-card-text>
                <span style="white-space: pre;">
                  {{ logField }}
                </span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { getImg } from '@/misc/helpers'

import { mdiArrowLeft } from '@mdi/js'

export default {
  data: () => ({
    mdi: {
      arrowLeft: mdiArrowLeft
    },
    price: 0,
    disabled: true,
    acknowledgeable: false,
    token: null,
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
    ...mapState('authentication', ['user'])
  },
  mounted() {
    this.loadSkus()
  },
  methods: {
    getImg,
    async loadSkus() {
      this.checkSupport()
      // get price
      const playStoreBuild = await this.populatePrice('subscription')
      // enable button
      if (playStoreBuild) {
        this.disabled = false
      }
    },
    async acknowledge(token, type = 'repeatable', onComplete = () => {}) {
      try {
        if (window.getDigitalGoodsService) {
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
    async listPurchases() {
      try {
        if (window.getDigitalGoodsService) {
          const service = await window.getDigitalGoodsService(
            this.PAYMENT_METHOD
          )
          const purchases = await service.listPurchases()
          this.log('Got purchases list.')
          this.purchasesList = JSON.stringify(purchases, null, 2)
        } else {
          this.log("window doesn't have getDigitalGoodsService.")
        }
      } catch (error) {
        this.log(error)
      }
    },
    async populatePrice(sku) {
      try {
        if (window.getDigitalGoodsService) {
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

          this.price = new Intl.NumberFormat(navigator.language, {
            style: 'currency',
            currency
          }).format(value)

          return true
        }
        this.log(`Could not get price for "${sku}".`)
      } catch (error) {
        this.log(error)
      }
      return false
    },
    buySubscription() {
      this.trigger('subscription', (token) => {
        this.buyStatus = 'subscription purchased! Thank you!'
        this.token = token
        this.acknowledgeable = true
      })
    },
    acknowledgeSubscription() {
      this.acknowledge(this.token, 'onetime', () => {
        this.acknowledgeable = false
        this.buyStatus = 'Subscription acknowledged!'
      })
    },
    // eslint-disable-next-line no-unused-vars
    trigger(sku, onToken = (token) => {}) {
      const self = this

      if (!window.PaymentRequest) {
        this.log('No PaymentRequest object.')
        return
      }

      const supportedInstruments = [
        {
          supportedMethods: this.PAYMENT_METHOD,
          data: {
            sku
          }
        }
      ]

      const details = {
        total: {
          label: 'Total',
          amount: { currency: 'USD', value: '0' }
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
    // https://stackoverflow.com/a/4900484
    log(contents) {
      this.logField += `${contents}\n`
    },
    getChromeVersion() {
      const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)
      return raw ? parseInt(raw[2], 10) : false
    },
    checkSupport() {
      if (window.getDigitalGoodsService) {
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
