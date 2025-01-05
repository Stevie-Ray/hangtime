<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useAuthenticationStore } from '@/stores/authentication.store'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import { time } from '@/helpers'
import { usePlayBilling } from '@/composables/usePlayBilling'

const { t } = useI18n()
const router = useRouter()
const { user } = storeToRefs(useAuthenticationStore())

const {
  disabled,
  price,
  buyStatus,
  logField,
  purchasesList,
  canSubscribe,
  subscribeLimit,
  buySubscription,
  listPurchases,
  acknowledge
} = usePlayBilling()

const debug = false

const progressValue = computed(() => {
  let time = 60
  if (!user || user?.value?.subscribed) time = 0
  const completedTime = user?.value?.completed?.time ? user.value.completed.time : 0
  const value = ((completedTime / time) * 100) / subscribeLimit
  return value < 100 ? value : 100
})

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
                  <span style="text-decoration: line-through"
                    >{{ subscribeLimit / 2 }} minutes</span
                  >
                  <strong>&nbsp;{{ subscribeLimit }} minutes</strong> of free usage.
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
