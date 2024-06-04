<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { getAuth, signOut } from 'firebase/auth'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { useAuthentication } from '@/stores/authentication'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import { useApp } from '@/stores/app'

const { t } = useI18n()

const { user } = storeToRefs(useAuthentication())

const { networkOnLine } = storeToRefs(useApp())

interface Item {
  title: string
  icon: string
  subtitle: string
  link: string
  external?: boolean
}

const items: Item[] = [
  {
    title: t('Profile'),
    icon: '$account',
    subtitle: t('Avatar, weight, gender, grade'),
    link: '/account/profile'
  },
  {
    title: t('General'),
    icon: '$cog',
    subtitle: t('Language, grading, weight, theme'),
    link: '/account/general'
  },
  {
    title: t('Hangboards'),
    icon: '$keyboard',
    subtitle: t('Manage your hangboards'),
    link: '/account/hangboards'
  },
  {
    title: t('Workouts'),
    icon: '$timer',
    subtitle: t('Sound, speech, vibrate'),
    link: '/account/workouts'
  },
  {
    title: t('Subscription'),
    icon: '$cashMultiple',
    subtitle: t('Unlimited workouts'),
    link: '/account/subscription'
  },
  {
    title: t('Follow {appTitle}', { appTitle: 'HangTime' }),
    icon: '$facebook',
    subtitle: t('App and hangboard updates'),
    link: 'https://www.facebook.com/hangtime.hangboarding',
    external: true
  },
  {
    title: t('Help'),
    icon: '$helpCircle',
    subtitle: t('FAQ, exercises, privacy, contact'),
    link: '/account/help'
  }
]

const canSubscribePlayBilling = ref(false)
const PAYMENT_METHOD = 'https://play.google.com/billing'
const canSubscribe = window.getDigitalGoodsService

async function canUsePlayBilling() {
  if (canSubscribe === undefined) {
    // eslint-disable-next-line no-console
    console.log("window doesn't have getDigitalGoodsService.")
    return
  }
  try {
    const service = await window.getDigitalGoodsService(PAYMENT_METHOD)
    // eslint-disable-next-line no-console
    console.log(service)
    if (service === null) {
      // eslint-disable-next-line no-console
      console.log('Play Billing is not available.')
    } else {
      // eslint-disable-next-line no-shadow
      const items = ['subscription']
      const details = await service.getDetails(items)
      if (details === null) {
        // eslint-disable-next-line no-console
        console.log('Are you running a Play Store build?')
      } else if (details.length === 0) {
        // eslint-disable-next-line no-console
        console.log('Are you running a Play Store build? 2')
      } else {
        canSubscribePlayBilling.value = true
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
}

function showAccountLink(item: Item) {
  if (item.title !== t('Subscription')) return true
  if (canSubscribePlayBilling.value && !user.value?.subscribed) return true
  return false
}

onMounted(() => {
  canUsePlayBilling()
})

async function signOutUser() {
  const auth = getAuth()

  signOut(auth)
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('user signed out')
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
    })
}

useHead({
  title: 'Account',
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container>
    <template #title>
      <router-link
        v-if="user"
        class="d-flex align-center text-decoration-none text-high-emphasis"
        to="/account/profile"
      >
        <span>
          <v-avatar size="small" color="grey-darken-1" class="mr-2">
            <v-img :src="user.photoURL" :alt="user.displayName" width="32" height="32"></v-img>
          </v-avatar>
        </span>
        <span>{{ user.displayName }}</span>
      </router-link>
    </template>

    <template #icons>
      <v-btn icon="$logout" color="text" :disabled="!networkOnLine" @click="signOutUser"></v-btn>
    </template>

    <template #default>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-list lines="two">
              <template v-for="(item, i) in items" :key="i">
                <v-list-item
                  v-if="showAccountLink(item)"
                  :to="!item.external ? item.link : undefined"
                  :href="item.external ? item.link : undefined"
                  :target="item.external ? '_blank' : undefined"
                >
                  <template #prepend>
                    <v-icon :icon="item.icon"></v-icon>
                  </template>

                  <template #append v-if="item.external">
                    <v-icon icon="$openInNew"></v-icon>
                  </template>

                  <v-list-item-title>{{ item.title }}</v-list-item-title>

                  <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
                </v-list-item>

                <v-divider
                  v-if="i !== items.length - 1 && showAccountLink(item)"
                  :key="`divider-${i}`"
                  inset
                ></v-divider>
              </template>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-container>
</template>
