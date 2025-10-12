<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import SidebarStatistics from '@/components/molecules/SidebarStatistics/SidebarStatistics.vue'
import SidebarLinks from '@/components/molecules/SidebarLinks/SidebarLinks.vue'
import { useWorkoutsStore } from '@/stores/workouts.store'
import { time } from '@/helpers'

const { t } = useI18n()

const { fetchLeaderboard, getLeaderboard } = useWorkoutsStore()

const rank = ref<'completed.amount' | 'completed.time' | 'completed.hold' | null>(
  'completed.amount'
)

// Fetch initial leaderboard data on component mount
onMounted(async () => {
  await fetchLeaderboard(rank.value)
})

watch(
  rank,
  async () => {
    await fetchLeaderboard(rank.value)
  },
  { immediate: false }
)

const selectedLeaderboard = computed(() => getLeaderboard(rank.value))

const tableHeaders = [
  { text: 'Workouts done', value: 'completed.amount' },
  { text: 'Time hangboarding', value: 'completed.hold' },
  { text: 'Time worked out', value: 'completed.time' }
]

const selectedHeader = computed(() => tableHeaders.find((header) => header.value === rank.value))

const leaderboardMenu = ref(false)

useHead({
  title: 'Leaderboard',
  meta: [{ name: 'description', content: '' }]
})
import { isDevelopment } from '@/helpers'

// DUMMY DATA
const ranks = [
  // Local → National
  { name: 'Gym Competition', icon: '$medalOutline', color: 'grey-lighten-1' },
  { name: 'Regional Competition', icon: '$medal', color: 'blue-lighten-2' },
  { name: 'National Cup', icon: '$trophyAward', color: 'teal' },
  { name: 'National Championship', icon: '$trophy', color: 'teal-darken-2' },

  // Continental
  { name: 'Continental Cup', icon: '$trophyAward', color: 'indigo' },
  { name: 'Continental Championship', icon: '$trophy', color: 'indigo-darken-2' },

  // World
  { name: 'IFSC World Cup', icon: '$trophyAward', color: 'deep-purple' },
  { name: 'IFSC World Championship', icon: '$trophy', color: 'deep-purple-darken-2' },

  // Olympic track
  { name: 'Olympic Qualifier Series', icon: '$torch', color: 'orange-darken-1' },
  { name: 'Olympic Games', icon: '$torch', color: 'amber-accent-3' }
]
const currentRank = 4
</script>

<template>
  <app-container>
    <template #default>
      <v-row>
        <v-col
          class="d-flex justify-space-between align-center d-md-none"
          cols="12"
          v-if="isDevelopment()"
        >
          <div class="text-h6 text-secondary">{{ ranks[currentRank]?.name ?? '' }}</div>
          <div class="font-weight-bold">2 dagen, 3 uur</div>
        </v-col>
        <v-col cols="12" v-if="isDevelopment()">
          <div class="d-flex overflow-hidden position-relative" style="height: 80px">
            <div class="grid" :style="{ '--offset': currentRank }">
              <div v-for="(rank, index) in ranks" :key="rank.name">
                <v-icon
                  :color="currentRank >= index && false ? rank.color : undefined"
                  :disabled="index > currentRank"
                  :icon="rank.icon"
                  :size="index === currentRank ? 80 : 48"
                  :title="rank.name"
                />
              </div>
            </div>
          </div>
        </v-col>
        <v-col class="d-none d-md-flex flex-column align-center" cols="12" v-if="isDevelopment()">
          <div class="text-h4 text-secondary">{{ ranks[currentRank]?.name ?? '' }}</div>
          <div class="text-h6 py-4">De top 5 gaan door naar de volgende divisie</div>
          <div class="font-weight-bold py-4">2 dagen, 3 uur</div>
        </v-col>

        <v-col cols="12">
          <v-menu v-model="leaderboardMenu">
            <template v-slot:activator="{ props }">
              <v-btn
                color="surface"
                class="justify-space-between mb-1"
                v-bind="props"
                block
                :append-icon="leaderboardMenu ? '$chevronDown' : '$chevronUp'"
              >
                <span v-if="selectedHeader">{{ t(selectedHeader.text) }}</span>
              </v-btn>
            </template>

            <v-card>
              <v-card-text>
                <v-radio-group v-model="rank" mandatory>
                  <v-radio
                    v-for="(header, index) in tableHeaders"
                    :key="index"
                    :label="t(header.text)"
                    :value="header.value"
                  ></v-radio>
                </v-radio-group>
              </v-card-text>
            </v-card>
          </v-menu>

          <v-list v-if="selectedLeaderboard && selectedLeaderboard.leaderboard" lines="one">
            <v-list-item
              v-for="(user, index) in selectedLeaderboard.leaderboard"
              :key="user.id"
              :to="isDevelopment() ? `/profile/${user.id}` : undefined"
            >
              <template #prepend>
                <span class="d-inline-block" style="min-width: 30px">{{ index + 1 }}. </span>
                <v-avatar size="small" color="grey-darken-1" class="mr-2">
                  <v-img
                    :title="user.id"
                    :src="user.photoURL || undefined"
                    :alt="user.displayName || undefined"
                    width="40"
                    height="40"
                  ></v-img>
                </v-avatar>
              </template>

              <template #title>
                <span>{{ user.displayName }}</span>
              </template>

              <template #append>
                <div class="d-flex items-center ga-4">
                  <div :title="user.country?.name">
                    {{ user.country?.emoji }}
                  </div>
                  <div v-if="rank === 'completed.amount'" class="text-right">
                    {{ user.completed?.amount }}
                  </div>
                  <div v-if="rank === 'completed.time'" class="text-right">
                    {{ time(user.completed?.time) }}
                  </div>
                  <div v-if="rank === 'completed.hold'" class="text-right">
                    {{ time(user.completed?.hold) }}
                  </div>
                </div>
              </template>
            </v-list-item>
          </v-list>
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

<style lang="scss" scoped>
.grid {
  align-items: center;
  bottom: 0;
  display: grid;
  gap: 52px;
  grid-template-columns: repeat(11, min-content);
  justify-content: space-between;
  left: calc(50% - 40px - var(--offset) * 100px);
  position: absolute;
  top: 0;
}
</style>
