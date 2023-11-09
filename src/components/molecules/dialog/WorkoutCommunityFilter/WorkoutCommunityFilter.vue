<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const dialog = ref(false)

const workoutFilter = reactive({
  filter: 'Last Modified',
  value: ['updateTimestamp', 'createTimestamp']
})

const items = [
  { filter: 'Name', value: ['name'] },
  { filter: 'Last Modified', value: ['updateTimestamp', 'createTimestamp'] },
  { filter: 'Time', value: ['time'] },
  { filter: 'Stars', value: 0 },
  { filter: 'Level', value: ['level'] }
]
// const sortOrder = ref('desc')
</script>

<template>
  <v-dialog v-model="dialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
    <template v-slot:activator="{ props }">
      <v-btn variant="text" disabled color="text" icon="$tuneVariant" v-bind="props"></v-btn>
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
                v-model="workoutFilter"
                :items="items"
                :label="t('Sort workouts by')"
                item-title="filter"
                item-value="value"
                single-line
              >
              </v-select>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
