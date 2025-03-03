<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { getAuth, signOut } from 'firebase/auth'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { useAuthenticationStore } from '@/stores/authentication.store'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import { useAppStore } from '@/stores/app.store'
import { usePlayBilling } from '@/composables/usePlayBilling'

const { canSubscribePlayBilling } = usePlayBilling()

const { t } = useI18n()

const { user } = storeToRefs(useAuthenticationStore())

const { online } = storeToRefs(useAppStore())

interface Item {
  title: string
  icon: string
  subtitle: string
  link: string
  external?: boolean
}

const items = computed<Item[]>(() => [
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
    title: `${t('Import')} / ${t('Export')}`,
    icon: '$swapVertical',
    subtitle: `${t('Import')} / ${t('Export')} ${t('Workouts')}`,
    link: '/account/import-export'
  },
  {
    title: t('Subscription'),
    icon: '$cashMultiple',
    subtitle: t('Unlimited workouts'),
    link: '/account/subscription'
  },
  {
    title: t('Donate'),
    icon: '$gift',
    subtitle: t('Support development'),
    link: 'https://www.paypal.com/donate/?hosted_button_id=PZSN7JBXRWVDA',
    external: true
  },
  {
    title: t('Source Code'),
    icon: '$github',
    subtitle: t('Code, feature requests, discussions'),
    link: 'https://github.com/Stevie-Ray/hangtime',
    external: true
  },
  {
    title: t('Help'),
    icon: '$helpCircle',
    subtitle: t('FAQ, exercises, privacy, contact'),
    link: '/account/help'
  }
])

function showAccountLink(item: Item) {
  if (item.title !== t('Subscription')) return true
  if (canSubscribePlayBilling.value && !user.value?.subscribed) return true
  return false
}

async function signOutUser() {
  const auth = getAuth()

  signOut(auth)
    .then(() => {
      console.log('user signed out')
    })
    .catch((error) => {
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
            <v-img
              :src="user.photoURL || undefined"
              :alt="user.displayName || undefined"
              width="32"
              height="32"
            ></v-img>
          </v-avatar>
        </span>
        <span v-if="user.displayName">{{ user.displayName }}</span>
      </router-link>
    </template>

    <template #icons>
      <v-btn icon="$logout" color="text" :disabled="!online" @click="signOutUser"></v-btn>
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
