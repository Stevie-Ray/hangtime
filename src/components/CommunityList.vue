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
  data: () => ({
    workouts: [
      {
        name: 'Warm-up 1000',
        id: '5c3e525641201a0ea28afcca',
        description: 'Properly warming up is very important to avoid injuries',
        user: '5c425de235cbe136283e4017',
        buildin: true,
        company: 1,
        hangboard: 0,
        steps: [
          {
            exercise: 3,
            left: 0,
            right: 0,
            hold: 8,
            rest: 4,
            repeat: 4,
            pause: 10,
            pullups: 2
          },
          {
            exercise: 0,
            left: 0,
            right: 0,
            hold: 30,
            rest: 10,
            repeat: 2,
            pause: 10
          },
          {
            exercise: 3,
            left: 5,
            right: 5,
            hold: 8,
            rest: 4,
            repeat: 4,
            pause: 10,
            pullups: 2
          },
          {
            exercise: 0,
            left: 5,
            right: 5,
            hold: 30,
            rest: 10,
            repeat: 2,
            pause: 10
          }
        ]
      },
      {
        name: 'HangTime',
        id: '5c3e51f541201a0ea28afcc9',
        description: 'Much hang time on good holds.',
        buildin: true,
        company: 1,
        hangboard: 0,
        user: '5c425de235cbe136283e4017',
        steps: [
          {
            exercise: 0,
            left: 5,
            right: 5,
            hold: 7,
            rest: 4,
            repeat: 3,
            pause: 15
          },
          {
            exercise: 3,
            left: 0,
            right: 0,
            hold: 10,
            rest: 10,
            repeat: 1,
            pause: 120
          },
          {
            exercise: 0,
            left: 5,
            right: 5,
            hold: 6,
            rest: 6,
            repeat: 4,
            pause: 90
          },
          {
            exercise: 4,
            left: 0,
            right: 4,
            hold: 4,
            rest: 7,
            repeat: 2,
            pause: 120
          },
          {
            exercise: 4,
            left: 4,
            right: 0,
            hold: 5,
            rest: 7,
            repeat: 5,
            pause: 120
          },
          {
            exercise: 3,
            left: 5,
            right: 5,
            hold: 5,
            rest: 4,
            repeat: 5,
            pause: 120
          },
          {
            exercise: 0,
            left: 5,
            right: 5,
            hold: 7,
            rest: 4,
            repeat: 7,
            pause: 120
          },
          {
            exercise: 0,
            left: 0,
            right: 0,
            hold: 7,
            rest: 4,
            repeat: 7,
            pause: 120
          }
        ]
      }
    ]
  }),
  computed: {
    ...mapState('app', ['networkOnLine'])
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
