<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkoutsStore } from '@/stores/workouts'
import { useI18n } from 'vue-i18n'

const { workoutsCommunityFilter, workoutsCommunity } = storeToRefs(useWorkoutsStore())

const { fetchCommunityWorkouts } = useWorkoutsStore()

const { t } = useI18n()

const dialog = ref(false)

const items: { filter: string; value: string }[] = [
  { filter: 'Name', value: 'name' },
  { filter: 'Last Modified', value: 'updateTimestamp' },
  { filter: 'Time', value: 'time' },
  { filter: 'Stars', value: '' },
  { filter: 'Level', value: 'level' }
]

watch(
  workoutsCommunityFilter,
  async (newFilter, oldFilter) => {
    if (newFilter !== oldFilter) {
      console.log(workoutsCommunity.value)
      workoutsCommunity.value = []
      console.log(workoutsCommunity.value)
      await fetchCommunityWorkouts()
      console.log(workoutsCommunity.value)
    }
  },
  { deep: true }
)

// const sortOrder = ref('desc')
</script>

<template>
  <v-dialog v-model="dialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
    <template v-slot:activator="{ props }">
      <v-btn variant="text" color="text" icon="$tuneVariant" v-bind="props"></v-btn>
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
            <div class="d-flex flex-column">
              <v-select
                v-model="workoutsCommunityFilter"
                :items="items"
                :label="t('Sort workouts by')"
                item-title="filter"
                item-value="value"
                single-line
                return-object
              >
              </v-select>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
