<template>
  <app-container>
    <template #default>
      <!-- Loading state -->
      <v-row v-if="isLoading">
        <v-col cols="12">
          <v-skeleton-loader type="heading" />
          <v-skeleton-loader type="text" class="mt-2" />
          <v-skeleton-loader type="button" class="mt-4" />
        </v-col>
      </v-row>

      <!-- Error state -->
      <v-row v-else-if="error">
        <v-col cols="12">
          <v-alert type="error" variant="tonal">
            {{ error }}
          </v-alert>
          <v-btn @click="fetchCurrentUser" class="mt-2">
            {{ t('Try again') }}
          </v-btn>
        </v-col>
      </v-row>

      <!-- Profile content -->
      <template v-else-if="displayUser">
        <v-row>
          <v-col cols="12">
            <v-sheet :height="120" rounded class="position-relative mb-8">
              <v-btn
                icon="$arrowLeft"
                class="position-absolute"
                variant="text"
                style="top: 15px; left: 0px"
                @click="router.back()"
              />
              <v-chip
                v-if="displayUser.subscribed"
                color="primary"
                class="position-absolute"
                style="top: 15px; right: 15px"
              >
                Premium
              </v-chip>
              <v-avatar size="60" class="position-absolute" style="bottom: -30px; left: 15px">
                <v-img
                  :src="displayUser.photoURL || undefined"
                  :alt="displayUser.displayName || undefined"
                />
              </v-avatar>
            </v-sheet>

            <div class="text-h4">{{ displayUser.displayName || $t('Anonymous User') }}</div>
            <div>{{ $t('Joined') }} {{ formattedRegistrationDate }}</div>
            <div>
              <v-btn
                v-if="displayUser.id !== currentUser?.id"
                variant="flat"
                prepend-icon="$accountPlus"
                color="primary"
              >
                {{ $t('Follow') }}
              </v-btn>
              <v-btn v-else variant="flat" prepend-icon="$accountPlus" color="primary">
                {{ $t('Invite friends') }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-divider class="my-4" />
        <v-row>
          <v-col cols="12">
            <div class="text-h6">Overzicht</div>
          </v-col>
          <v-col cols="6">
            <v-sheet border class="pa-2" rounded>
              <div class="d-flex ga-2 ga-md-4">
                <div><v-icon icon="$calendar" :size="$vuetify.display.mdAndUp ? 40 : 16" /></div>
                <div class="overflow-hidden">
                  <div class="text-h6 text-high-emphasis text-truncate">{{ weekStreak }}</div>
                  <div class="text-caption">{{ t('Week streak') }}</div>
                </div>
              </div>
            </v-sheet>
          </v-col>
          <v-col cols="6">
            <v-sheet border class="pa-2" rounded>
              <div class="d-flex ga-2 ga-md-4">
                <div>
                  <v-icon icon="$cashMultiple" :size="$vuetify.display.mdAndUp ? 40 : 16" />
                </div>
                <div class="overflow-hidden">
                  <div class="text-h6 text-high-emphasis text-truncate">3846</div>
                  <div class="text-caption">Punten</div>
                </div>
              </div>
            </v-sheet>
          </v-col>
          <v-col cols="6">
            <v-sheet border class="pa-2" rounded>
              <div class="d-flex ga-2 ga-md-4">
                <div><v-icon icon="$trophy" :size="$vuetify.display.mdAndUp ? 40 : 16" /></div>
                <div class="overflow-hidden">
                  <div class="text-h6 text-high-emphasis text-truncate">IFSC World Cup</div>
                  <div class="text-caption">Huidige divisie</div>
                </div>
              </div>
            </v-sheet>
          </v-col>
          <v-col cols="6">
            <v-sheet border class="pa-2" rounded>
              <div class="d-flex ga-2 ga-md-4">
                <div><v-icon icon="$medal" :size="$vuetify.display.mdAndUp ? 40 : 12" /></div>
                <div class="overflow-hidden">
                  <div class="text-h6 text-high-emphasis text-truncate">10</div>
                  <div class="text-caption">Top 3 plekken</div>
                </div>
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </template>
    </template>

    <template #sidebar>
      <v-row>
        <v-col cols="12">
          <sidebar-statistics />
        </v-col>
        <v-col cols="12">
          <sidebar-links />
        </v-col>
      </v-row>
    </template>
  </app-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useAuthenticationStore } from '@/stores/authentication.store'
import { useActivitiesStore } from '@/stores/activities.store'
import { useUserProfile } from '@/composables/useUserProfile'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import SidebarStatistics from '@/components/molecules/SidebarStatistics/SidebarStatistics.vue'
import SidebarLinks from '@/components/molecules/SidebarLinks/SidebarLinks.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { user: currentUser } = storeToRefs(useAuthenticationStore())
const { weekStreak } = useActivitiesStore()
const { user: profileUser, isLoading, error, fetchCurrentUser } = useUserProfile()

// Determine which user to display
const displayUser = computed(() => {
  // If there's a userId in the route, use the fetched profile user
  if (route.params.userId) {
    return profileUser.value
  }
  // If no userId in route, redirect to current user's profile
  if (currentUser.value?.id) {
    router.replace(`/profile/${currentUser.value.id}`)
  }
  return null
})

const formattedRegistrationDate = computed(() => {
  if (!displayUser.value?.createTimestamp) return t('unknown', 'onbekend')

  const date = new Date(displayUser.value.createTimestamp)
  return date.toLocaleDateString(displayUser.value.settings?.locale ?? 'en-US', {
    year: 'numeric',
    month: 'long'
  })
})

// Watch for route changes to fetch user data when userId changes
watch(
  () => route.params.userId,
  async (newUserId) => {
    if (newUserId) {
      await fetchCurrentUser()
    }
  },
  { immediate: true }
)

// Fetch user data on component mount if there's a userId
onMounted(async () => {
  if (route.params.userId) {
    await fetchCurrentUser()
  }
})
</script>
