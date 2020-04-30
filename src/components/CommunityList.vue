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
      <div>Loading community workouts...</div>
    </div>
    <v-container
      v-if="(!user && !workouts) || (workouts && !workouts.length)"
      fluid
    >
      <v-row class="text-center" justify="center" align="start">
        <v-col cols="12" sm="8" md="6">
          <v-avatar aspect-ratio="1" class="grey lighten-2" size="164">
            <img src="@/assets/sloth/baby.svg" alt="sloth baby" />
          </v-avatar>
        </v-col>
      </v-row>

      <v-row>
        <v-card flat>
          <v-card-title>
            No community workouts found
          </v-card-title>
          <v-card-subtitle>
            After creating a
            {{
              companies[
                user.settings.hangboards[user.settings.selected].company
              ].hangboards[
                user.settings.hangboards[user.settings.selected].hangboard
              ].name
            }}
            workout use the
            <v-icon small>{{ mdi.starOutline }}</v-icon> button to add it to the
            community.
          </v-card-subtitle>
        </v-card>
      </v-row>
    </v-container>
    <v-list
      v-if="(!user && !workouts) || (workouts && !workouts.length)"
      three-line
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title></v-list-item-title>
          <v-list-item-subtitle> </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list two-line>
      <workout-list-item
        v-for="(workout, index) in workouts"
        :key="workout.id"
        class="community-workout-row"
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
import { mdiStarOutline } from '@mdi/js'

export default {
  components: { WorkoutListItem },
  data: () => ({
    mdi: {
      starOutline: mdiStarOutline
    }
  }),
  computed: {
    ...mapGetters('workouts', ['communityWorkoutsByHangboard']),
    ...mapState('app', ['networkOnLine']),
    ...mapState('authentication', ['user']),
    ...mapState('companies', ['companies']),
    ...mapState('workouts', ['workoutFilter', 'sortOrder']),
    workouts() {
      if (!this.user) return
      // eslint-disable-next-line consistent-return
      return this.communityWorkoutsByHangboard({
        user: this.user,
        filter: this.workoutFilter.value,
        order: this.sortOrder
      })
    }
  }
}
</script>
