<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { getAuth, signOut } from 'firebase/auth'
import { useAuthenticationStore } from '@/stores/authentication.store'
import { usePlayBilling } from '@/composables/usePlayBilling'

const { canSubscribePlayBilling } = usePlayBilling()

const { t } = useI18n()

const { user } = storeToRefs(useAuthenticationStore())

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

interface Item {
  title: string
  icon: string
  subtitle: string
  link: string
  external?: boolean
}

const cards = computed<{ title: string; items: Item[] }[]>(() => [
  {
    title: t('Account'),
    items: [
      {
        title: t('Preferences'),
        icon: '$cog',
        subtitle: t('Language, grading, weight, theme'),
        link: '/account/general'
      },
      {
        title: t('Profile'),
        icon: '$account',
        subtitle: t('Avatar, weight, gender, grade'),
        link: '/account/profile'
      },
      {
        title: t('Notifications'),
        icon: '$bellOutline',
        subtitle: t('Email, push, in-app'),
        link: '/account/notifications'
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
      }
    ]
  },
  {
    title: t('Subscription'),
    items: [
      {
        title: t('Subscription'),
        icon: '$cashMultiple',
        subtitle: t('Unlimited workouts'),
        link: '/account/subscription'
      }
    ]
  },
  {
    title: t('Support'),
    items: [
      {
        title: t('Donate'),
        icon: '$gift',
        subtitle: t('Support development'),
        link: 'https://www.paypal.com/donate/?hosted_button_id=PZSN7JBXRWVDA',
        external: true
      },
      {
        title: 'Discord',
        icon: '$forumOutline',
        subtitle: t('Chat, support, feedback'),
        link: 'https://discord.gg/f7QQnEBQQt',
        external: true
      },
      {
        title: t('Source Code'),
        icon: '$github',
        subtitle: t('Code, feature requests, discussions'),
        link: 'https://github.com/Stevie-Ray/hangtime',
        external: true
      }
    ]
  }
])

function showAccountLink(list: { title: string; items: Item[] }) {
  if (list.title !== t('Subscription')) return true
  if (canSubscribePlayBilling.value && !user.value?.subscribed) return true
  return false
}
</script>

<template>
  <v-row>
    <template v-for="(list, index) in cards" :key="index">
      <v-col cols="12" v-if="showAccountLink(list)">
        <v-card>
          <v-list lines="two">
            <v-list-subheader>{{ list.title }}</v-list-subheader>

            <template v-for="(item, i) in list.items" :key="i">
              <v-list-item
                :to="!item.external ? item.link : undefined"
                :href="item.external ? item.link : undefined"
                :target="item.external ? '_blank' : undefined"
              >
                <template #prepend>
                  <v-icon :icon="item.icon"></v-icon>
                </template>

                <template #title>
                  <span :title="item.subtitle">{{ item.title }}</span>
                </template>

                <template #append v-if="item.external">
                  <v-icon size="small" icon="$openInNew"></v-icon>
                </template>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </v-col>
    </template>
    <v-col cols="12">
      <v-btn color="primary-lighten-1" block @click="signOutUser">{{ t('Logout') }}</v-btn>
    </v-col>
  </v-row>
</template>

<style scoped></style>
