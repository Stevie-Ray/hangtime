<template>
  <workout-list class="workout-list"></workout-list>
</template>

<script>
import { mapState } from 'vuex'
import WorkoutList from '@/components/WorkoutList'

export default {
  head: {
    title: {
      inner: 'Workouts'
    },
    meta: [
      {
        name: 'description',
        content: 'HangTime home page',
        id: 'desc'
      }
    ]
  },
  components: { WorkoutList },
  computed: mapState('app', ['networkOnLine'])
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
