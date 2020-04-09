<template>
  <workout-list class="workout-list"></workout-list>
</template>

<script>
import { mapState } from 'vuex'
import WorkoutList from '@/components/WorkoutList'

export default {
  components: { WorkoutList },
  computed: mapState('app', ['networkOnLine']),
  head: {
    title: {
      inner: 'Workouts'
    },
    meta: [
      {
        name: 'description',
        content: 'Workouts tab',
        id: 'desc'
      }
    ]
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
