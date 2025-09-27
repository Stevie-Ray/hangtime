<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
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
</script>

<template>
  <app-container>
    <template #default>
      <v-container>
        <v-row>
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
                <thead class="d-none">
                  <tr>
                    <th>&nbsp;</th>
                    <th
                      v-for="header in tableHeaders"
                      :key="header.value"
                      class="text-left d-non"
                      :class="{ 'd-none': header.value !== rank }"
                    >
                      <span>{{ t(header.text) }}</span>
                    </th>
                  </tr>
                </thead>
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
      </v-container>
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
</style>
