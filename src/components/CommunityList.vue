<template>
  <div>
    <div v-if="workouts !== null" class="loading text-xs-center">
      <v-progress-circular
        :size="60"
        color="primary"
        indeterminate
        class="my-4"
      >
      </v-progress-circular>
      <div>Loading community workouts... (soon)</div>
    </div>
    <div v-if="workouts && !workouts.length" class="infos-label">
      No community workouts added yet
    </div>
    <v-list two-line>
      <!--      <workout-list-item-->
      <!--        v-for="(workout, index) in workouts"-->
      <!--        :key="workout.id"-->
      <!--        class="workout-row"-->
      <!--        :index="index"-->
      <!--        :disable-actions="!networkOnLine"-->
      <!--        :data="workout"-->
      <!--      ></workout-list-item>-->
    </v-list>
  </div>
</template>

<script>
// import WorkoutListItem from '@/components/WorkoutListItem'
import { mapState } from 'vuex'

export default {
  // components: { WorkoutListItem },
  data: () => ({}),
  computed: {
    ...mapState('app', ['networkOnLine'])
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
