<template>
  <workout-list class="workout-list"></workout-list>
</template>

<script>
import { mapState } from 'vuex'
import WorkoutList from '@/components/organisms/WorkoutList/WorkoutList'

export default {
  components: { WorkoutList },
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
  },
  computed: mapState('app', ['networkOnLine'])
}
</script>
