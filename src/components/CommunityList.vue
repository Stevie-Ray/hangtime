<template>
  <div>
    <div v-if="communityWorkouts === null" class="loading text-xs-center">
      <v-progress-circular
        :size="60"
        color="primary"
        indeterminate
        class="my-4"
      >
      </v-progress-circular>
      <div>Loading community workouts...</div>
    </div>
    <div
      v-if="communityWorkouts && !communityWorkouts.length"
      class="infos-label"
    >
      No community workouts added yet
    </div>
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
    ...mapState('app', ['networkOnLine']),
    ...mapState('workouts', ['communityWorkouts'])
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
