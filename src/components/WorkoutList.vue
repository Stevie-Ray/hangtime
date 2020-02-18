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
    <v-container v-if="(!user && !workouts) || (workouts && !workouts.length)">
      <v-row justify="center" align="start">
        <v-col cols="12" sm="8" md="6">
          <v-avatar aspect-ratio="1" class="grey lighten-2" size="164">
            <img src="@/assets/sloth/upside-down.svg" alt="sloth upside down" />
          </v-avatar>
        </v-col>
      </v-row>
      <v-row>
        <v-card flat>
          <v-card-title>
            No personal workouts found
          </v-card-title>
          <v-card-subtitle>
            You haven't added any
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
          </v-card-subtitle>
        </v-card>
      </v-row>
    </v-container>

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
            params: {
              id: $event,
              company: workout.company,
              hangboard: workout.hangboard,
              userId: workout.user.id
            }
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
