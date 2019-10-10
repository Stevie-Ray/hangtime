<template>
  <div>
    <div v-if="workouts === null && user" class="loading text-center">
      <v-progress-circular
        :size="60"
        color="primary"
        indeterminate
        class="my-4"
      >
      </v-progress-circular>
      <div>Loading workouts...</div>
    </div>
    <v-list
      v-if="(!user && !workouts) || (workouts && !workouts.length)"
      three-line
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>No personal workouts found</v-list-item-title>
          <v-list-item-subtitle
            >You haven't added any
            {{
              companies[
                user.settings.hangboards[user.settings.selected].company
              ].name
            }}
            {{
              companies[
                user.settings.hangboards[user.settings.selected].company
              ].hangboards[
                user.settings.hangboards[user.settings.selected].hangboard
              ].name
            }}
            workouts. Use the <v-icon small>mdi-plus</v-icon> button to get
            started.
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
        @goToWorkoutDetails="
          $router.push({
            name: 'workout',
            params: { id: $event, userId: workout.user.id }
          })
        "
      ></workout-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import WorkoutListItem from '@/components/WorkoutListItem'

export default {
  components: { WorkoutListItem },
  computed: {
    ...mapGetters('workouts', ['workoutsByHangboard']),
    ...mapState('app', ['networkOnLine']),
    ...mapState('authentication', ['user']),
    ...mapState('companies', ['companies']),
    workouts() {
      return this.workoutsByHangboard(this.user)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
