<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkoutsStore } from '@/stores/workouts.store'
import { useI18n } from 'vue-i18n'

const { workoutsCommunity, workoutsCommunityFilter, workoutsCommunityFilterDirection } =
  storeToRefs(useWorkoutsStore())

const { fetchCommunityWorkouts, resetCommunityWorkouts } = useWorkoutsStore()

const { t } = useI18n()

const dialog = ref(false)

const items: { filter: string; value: string; disabled?: boolean }[] = [
  { filter: 'Last Modified', value: 'updateTimestamp' },
  { filter: 'Likes', value: 'subscribers_count' },
  { filter: 'Name', value: 'name' },
  { filter: 'Time', value: 'time' },
  { filter: 'Level', value: 'level' }
]

const toggleDirection = async () => {
  workoutsCommunityFilterDirection.value =
    workoutsCommunityFilterDirection.value === 'asc' ? 'desc' : 'asc'
  workoutsCommunity.value = []
  resetCommunityWorkouts()
  await fetchCommunityWorkouts()
}

watch(
  workoutsCommunityFilter,
  async (newFilter, oldFilter) => {
    if (newFilter !== oldFilter) {
      workoutsCommunity.value = []
      resetCommunityWorkouts()
      await fetchCommunityWorkouts()
    }
  },
  { deep: true }
)
</script>

<template>
  <v-dialog v-model="dialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
    <template v-slot:activator="{ props }">
      <v-btn variant="text" color="text" size="small" icon="$tuneVariant" v-bind="props"></v-btn>
    </template>
    <v-card>
      <v-toolbar>
        <v-btn icon="$close" color="text" @click="dialog = false"></v-btn>
        <v-toolbar-title>{{ t('Filter') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon="$contentSaveOutline" @click="dialog = false"></v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="d-flex align-center justify-center">
              <v-select
                v-model="workoutsCommunityFilter"
                :items="items"
                :label="t('Sort workouts by')"
                :item-title="(option) => t(option.filter)"
                item-value="value"
                :item-props="true"
                single-line
                return-object
                class="mr-2"
              />
              <v-btn
                variant="text"
                class="mb-4"
                @click="toggleDirection"
                :icon="workoutsCommunityFilterDirection === 'asc' ? '$arrowUp' : '$arrowDown'"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
