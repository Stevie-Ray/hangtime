<template>
  <app-container>
    <template #default>
      <v-row>
        <v-col cols="12">
          <div class="text-h4">{{ user?.displayName || 'Anonymous User' }}</div>
          <div>Lid sinds {{ formattedRegistrationDate }}</div>
          <div>
            <v-btn variant="flat">0 volgers</v-btn>
            <v-btn variant="flat">0 volgend</v-btn>
          </div>
        </v-col>
      </v-row>
      <v-divider class="my-4" />
      <v-row>
        <v-col cols="12">
          <div class="text-h6">Overzicht</div>
        </v-col>
        <v-col cols="6">
          <v-sheet border class="pa-4" rounded>
            <div class="d-flex ga-4">
              <div><v-icon icon="$calendar" size="40" /></div>
              <div>
                <div class="text-h6">{{ weekStreak }}</div>
                <div class="text-caption">{{ t('Week streak') }}</div>
              </div>
            </div>
          </v-sheet>
        </v-col>
        <v-col cols="6">
          <v-sheet border class="pa-4" rounded>
            <div class="d-flex ga-4">
              <div><v-icon icon="$cashMultiple" size="40" /></div>
              <div>
                <div class="text-h6">3846</div>
                <div class="text-caption">Punten</div>
              </div>
            </div>
          </v-sheet>
        </v-col>
        <v-col cols="6">
          <v-sheet border class="pa-4" rounded>
            <div class="d-flex ga-4">
              <div><v-icon icon="$trophy" size="40" /></div>
              <div>
                <div class="text-h6">IFSC World Cup</div>
                <div class="text-caption">Huidige divisie</div>
              </div>
            </div>
          </v-sheet>
        </v-col>
        <v-col cols="6">
          <v-sheet border class="pa-4" rounded>
            <div class="d-flex ga-4">
              <div><v-icon icon="$medal" size="40" /></div>
              <div>
                <div class="text-h6">10</div>
                <div class="text-caption">Top 3 plekken</div>
              </div>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
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
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useAuthenticationStore } from '@/stores/authentication.store'
import { useActivitiesStore } from '@/stores/activities.store'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import SidebarStatistics from '@/components/molecules/SidebarStatistics/SidebarStatistics.vue'
import SidebarLinks from '@/components/molecules/SidebarLinks/SidebarLinks.vue'

const { t } = useI18n()
const { user } = storeToRefs(useAuthenticationStore())
const { weekStreak } = useActivitiesStore()

const formattedRegistrationDate = computed(() => {
  if (!user.value?.createTimestamp) return t('unknown', 'onbekend')

  const date = new Date(user.value.createTimestamp)
  return date.toLocaleDateString(user.value.settings?.locale ?? 'en-US', {
    year: 'numeric',
    month: 'long'
  })
})
</script>
