<template>
  <v-card>
    <v-tabs v-model="activeTab" color="primary" grow>
      <v-tab value="following"> {{ $t('Following') }}</v-tab>
      <v-tab value="followers"> {{ $t('Followers') }}</v-tab>
    </v-tabs>

    <v-card-text class="pa-0">
      <v-window v-model="activeTab">
        <!-- Following Tab -->
        <v-window-item value="following">
          <v-list v-if="followingUsers.length > 0" density="compact">
            <v-list-item
              v-for="user in followingUsers.slice(0, 5)"
              :key="user.id"
              :to="`/profile/${user.id}`"
              class="px-4"
            >
              <template #prepend>
                <v-avatar size="48">
                  <v-img :src="user.photoURL || undefined" :alt="user.displayName || 'User'" />
                </v-avatar>
              </template>

              <v-list-item-title>
                {{ user.displayName || $t('Anonymous User') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>

          <div v-else class="pa-4 text-center text-medium-emphasis">
            {{ $t('Not following anyone yet') }}
          </div>

          <!-- Show more link for following -->
          <div v-if="followingCount > 5" class="pa-4 pt-2">
            <v-btn variant="text" color="primary" size="small" @click="viewAllFollowing">
              {{ $t('View {count} more', { count: followingCount - 5 }) }}
            </v-btn>
          </div>
        </v-window-item>

        <!-- Followers Tab -->
        <v-window-item value="followers">
          <v-list v-if="followersUsers.length > 0" density="compact">
            <v-list-item
              v-for="user in followersUsers.slice(0, 5)"
              :key="user.id"
              :to="`/profile/${user.id}`"
              class="px-4"
            >
              <template #prepend>
                <v-avatar size="48">
                  <v-img :src="user.photoURL || undefined" :alt="user.displayName || 'User'" />
                </v-avatar>
              </template>

              <v-list-item-title>
                {{ user.displayName || $t('Anonymous User') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>

          <div v-else class="pa-4 text-center text-medium-emphasis">
            {{ $t('No followers yet') }}
          </div>

          <!-- Show more link for followers -->
          <div v-if="followersCount > 5" class="pa-4 pt-2">
            <v-btn variant="text" color="primary" size="small" @click="viewAllFollowers">
              {{ $t('View {count} more', { count: followersCount - 5 }) }}
            </v-btn>
          </div>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { User } from '@/models/user.model'

withDefaults(
  defineProps<{
    followingCount: number
    followersCount: number
    followingUsers: User[]
    followersUsers: User[]
  }>(),
  {
    followingCount: 0,
    followersCount: 0,
    followingUsers: () => [],
    followersUsers: () => []
  }
)

const activeTab = ref('following')

function viewAllFollowing() {}

function viewAllFollowers() {}
</script>
