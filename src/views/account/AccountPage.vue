<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { getAuth, signOut } from 'firebase/auth'
import { useHead } from '@unhead/vue'
import { useAuthenticationStore } from '@/stores/authentication.store'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import { useAppStore } from '@/stores/app.store'
import AccountMenu from '@/components/molecules/AccountMenu/AccountMenu.vue'

const { user } = storeToRefs(useAuthenticationStore())

const { online } = storeToRefs(useAppStore())

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
          <v-col cols="12"> Main </v-col>
        </v-row>
      </v-container>
    </template>

    <template #sidebar>
      <account-menu />
    </template>
  </app-container>
</template>
