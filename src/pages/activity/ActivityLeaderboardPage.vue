<script setup>
import { ref, watch, computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import AppContainer from '@/components/organisms/AppContainer/AppContainer'
import { useWorkouts } from '@/stores/workouts'
import { time } from '@/helpers'

const { t } = useI18n()

const { fetchLeaderboard } = useWorkouts()

const { getLeaderboard } = useWorkouts()

const rank = ref('completed.amount')

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

const selectedHeader = computed(() =>
  tableHeaders.find((header) => header.value === rank.value)
)

const leaderboardMenu = ref(false)

useHead({
  title: 'Leaderboard',
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container extension>
    <template #title>
      <v-menu v-model="leaderboardMenu">
        <template v-slot:activator="{ props }">
          <div v-bind="props" class="leaderboard-select">
            <span>{{ selectedHeader.text }}</span>
            <span v-if="leaderboardMenu"><v-icon>mdi-chevron-up</v-icon></span>
            <span v-else><v-icon>mdi-chevron-down</v-icon></span>
          </div>
        </template>

        <v-card>
          <v-card-text>
            <v-radio-group v-model="rank" mandatory>
              <v-radio
                v-for="(header, index) in tableHeaders"
                :key="index"
                :label="header.text"
                :value="header.value"
              ></v-radio>
            </v-radio-group>
          </v-card-text>
        </v-card>
      </v-menu>
    </template>

    <template #icons>
      <!--      <v-btn class="text-none" icon="mdi-help-circle-outline"></v-btn>-->
    </template>

    <template #extension>
      <v-tabs grow>
        <v-tab to="/activity" color="text">
          <v-icon class="mr-1">mdi-clipboard-text-clock</v-icon>
          <span>{{ t('History') }}</span>
        </v-tab>
        <v-tab to="/activity/leaderboard" color="text">
          <v-icon class="mr-1">mdi-podium-gold</v-icon>
          <span>{{ t('Leaderboard') }}</span>
        </v-tab>
      </v-tabs>
    </template>

    <template #default>
      <v-container>
        <v-row>
          <v-col cols="12">
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
                  <tr
                    v-for="(user, index) in selectedLeaderboard.leaderboard"
                    :key="user.id"
                  >
                    <td>
                      <span class="d-inline-block" style="min-width: 30px"
                        >{{ index + 1 }}.
                      </span>
                      <v-avatar size="small" color="grey-darken-1" class="mr-2">
                        <v-img
                          :src="user.photoURL"
                          :alt="user.displayName"
                        ></v-img>
                      </v-avatar>
                      <span class="text-truncate">
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
