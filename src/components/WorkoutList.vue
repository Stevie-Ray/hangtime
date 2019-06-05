<template>
  <div>
    <div v-if="workouts === null && user" class="loading">
      <v-progress-circular :size="60" color="primary" indeterminate>
      </v-progress-circular>
      <div class="text-xs-center">Loading workouts...</div>
    </div>
    <v-list
      v-if="(!user && !workouts) || (workouts && !workouts.length)"
      two-line
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>No workouts found</v-list-item-title>
          <v-list-item-subtitle
            >use the
            <v-icon small>mdi-plus</v-icon>
            button to add a workout
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list two-line>
      <workout-list-item
        v-for="(workout, index) in workouts"
        :key="workout.id"
        class="workout-row"
        :index="index"
        :disable-actions="!networkOnLine"
        :data="workout"
        @goToWorkoutDetails="$router.push(`/workouts/${$event}`)"
      ></workout-list-item>
    </v-list>
  </div>
</template>

<script>
import WorkoutListItem from '@/components/WorkoutListItem'
import { mapState } from 'vuex'

export default {
  components: { WorkoutListItem },
  computed: {
    ...mapState('workouts', ['workouts']),
    ...mapState('app', ['networkOnLine']),
    ...mapState('authentication', ['user'])
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
