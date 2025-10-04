<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import SidebarStatistics from '@/components/molecules/SidebarStatistics/SidebarStatistics.vue'
import SidebarLinks from '@/components/molecules/SidebarLinks/SidebarLinks.vue'
import { useWorkoutsStore } from '@/stores/workouts.store'
import { time } from '@/helpers'

const { t } = useI18n()

const { fetchLeaderboard } = useWorkoutsStore()

const { getLeaderboard } = useWorkoutsStore()

const rank = ref<'completed.amount' | 'completed.time' | 'completed.hold' | null>(
  'completed.amount'
)

watch(
  rank,
  () => {
    fetchLeaderboard(rank.value)
  },
  { immediate: true }
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
        <v-col align="center" cols="12">
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
        <v-col align="center" cols="12">
          <div class="text-h4 text-secondary">{{ ranks[currentRank]?.name ?? '' }}</div>
          <div class="text-h6 py-4 d-none d-md-block">
            De top 5 gaan door naar de volgende divisie
          </div>
          <strong class="py-4 d-none d-md-block">2 dagen, 3 uur</strong>
        </v-col>

        <v-col cols="12">
          <v-menu v-model="leaderboardMenu">
            <template v-slot:activator="{ props }">
              <div v-bind="props" class="leaderboard-select">
                <span v-if="selectedHeader">{{ t(selectedHeader.text) }}</span>
                <span v-if="leaderboardMenu"><v-icon>$chevronUp</v-icon></span>
                <span v-else><v-icon>$chevronDown</v-icon></span>
              </div>
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

          <v-table>
            <v-table>
              <tbody v-if="selectedLeaderboard">
                <tr v-for="(user, index) in selectedLeaderboard.leaderboard" :key="user.id">
                  <td>
                    <span class="d-inline-block" style="min-width: 30px">{{ index + 1 }}. </span>
                    <v-avatar size="small" color="grey-darken-1" class="mr-2">
                      <v-img
                        :src="user.photoURL || undefined"
                        :alt="user.displayName || undefined"
                        width="40"
                        height="40"
                      ></v-img>
                    </v-avatar>
                    <span v-if="user.displayName" class="text-truncate">
                      {{ user.displayName }}
                    </span>
                  </td>
                  <td v-if="rank === 'completed.amount'" class="text-right">
                    {{ user.completed?.amount }}
                  </td>
                  <td v-if="rank === 'completed.time'" class="text-right">
                    {{ time(user.completed?.time) }}
                  </td>
                  <td v-if="rank === 'completed.hold'" class="text-right">
                    {{ time(user.completed?.hold) }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-table>
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
.v-table > .v-table__wrapper > table {
  & > tbody,
  & > thead,
  & > tfoot {
    & > tr > td {
      font-size: 1rem;
      letter-spacing: 0.009375em;
      line-height: 1.5rem;
    }
  }
}

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
