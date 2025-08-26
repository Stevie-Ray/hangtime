<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAuthenticationStore } from '@/stores/authentication.store'
import { usePlayBilling } from '@/composables/usePlayBilling'
import { time } from '@/helpers'

const { t } = useI18n()
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
</script>

<template>
  <v-dialog
    :persistent="progressValue === 100"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-toolbar>
          <v-btn v-if="progressValue !== 100" icon="$close" @click="isActive.value = false"></v-btn>
          <v-toolbar-title>{{
            t('Enjoying {appTitle}?', { appTitle: 'HangTime' })
          }}</v-toolbar-title>
          <v-toolbar-items>
            <v-btn
              v-if="purchasesList.length === 0"
              :disabled="!canSubscribe"
              icon="$reload"
              @click="listPurchases"
            ></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-card>
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
                  <p v-if="user?.completed" class="mb-4">
                    {{ time(user.completed.time) }} minutes.
                  </p>
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
                <v-list-item v-for="(purchase, index) in purchasesList" :key="index" lines="two">
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
      </v-card>
    </template>
  </v-dialog>
</template>
<style lang="scss" scoped></style>
