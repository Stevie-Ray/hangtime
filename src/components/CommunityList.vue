<template>
  <div>
    <div
      v-if="communityWorkouts === null && user"
      class="loading text-xs-center"
    >
      <v-progress-circular
        :size="60"
        color="primary"
        indeterminate
        class="my-4"
      >
      </v-progress-circular>
      <div>Loading community workouts...</div>
    </div>
    <v-list
      v-if="
        (!user && !communityWorkouts) ||
          (communityWorkouts && !communityWorkouts.length)
      "
      two-line
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>No workouts found</v-list-item-title>
          <v-list-item-subtitle
            >No community workouts added yet
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list two-line>
      <workout-list-item
        v-for="(workout, index) in communityWorkouts"
        :key="workout.id"
        class="community-workout-row"
        :index="index"
        :disable-actions="!networkOnLine"
        :data="workout"
        @goToWorkoutDetails="$router.push(`/community/${$event}`)"
      ></workout-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import WorkoutListItem from '@/components/WorkoutListItem'

export default {
  components: { WorkoutListItem },
  data: () => ({}),
  computed: {
    ...mapState('app', ['user', 'networkOnLine']),
    ...mapState('workouts', ['communityWorkouts'])
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
