<template>
  <v-dialog v-model="show" width="500">
    <v-card>
      <v-card-title class="text-h5 mb-0">
        {{ $t('Filters') }}
      </v-card-title>

      <v-card-text>
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-select
              v-model="communityFilter"
              :items="items"
              item-text="filter"
              :label="$t('Sort workouts by')"
              return-object
            >
              <template #append-outer>
                <v-btn v-if="sortOrder !== 'asc'" icon @click="setOrder('asc')">
                  <v-icon>{{ mdi.sortAscending }}</v-icon>
                </v-btn>
                <v-btn
                  v-if="sortOrder !== 'desc'"
                  icon
                  @click="setOrder('desc')"
                >
                  <v-icon>{{ mdi.sortDescending }}</v-icon>
                </v-btn>
              </template>
            </v-select>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text class="add-hangboard" @click="$emit('input', false)">
          Cancel
        </v-btn>
        <v-btn text color="primary" @click="$emit('input', false)">
          Filter
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { mdiSortAscending, mdiSortDescending } from '@mdi/js'

export default {
  props: {
    value: Boolean
  },
  data: () => ({
    items: [
      { filter: 'Name', value: ['name'] },
      {
        filter: 'Last Modified',
        value: ['updateTimestamp', 'createTimestamp']
      },
      { filter: 'Time', value: ['time'] },
      {
        filter: 'Stars',
        value(workout) {
          if (workout.subscribers) {
            return workout.subscribers.length
          }
          return 0
        }
      },
      { filter: 'Level', value: ['level'] }
    ],
    mdi: {
      sortAscending: mdiSortAscending,
      sortDescending: mdiSortDescending
    }
  }),
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('workouts', ['workoutFilter', 'sortOrder']),
    show: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    communityFilter: {
      get() {
        return this.workoutFilter
      },
      set(value) {
        this.setFilter(value)
      }
    }
  },
  methods: {
    ...mapMutations('workouts', ['setOrder', 'setFilter'])
  }
}
</script>

<style lang="scss" scoped></style>
