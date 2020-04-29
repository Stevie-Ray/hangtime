<template>
  <div class="workout-item-name">
    <span v-if="data.repeat > 0">{{ data.repeat + 1 }}x </span>
    <span v-if="data.pullups > 1">{{ data.pullups }} </span>
    <span v-if="data.scappulls > 1">{{ data.scappulls }} </span>
    <span v-if="data.scappulls > 0">Scap </span>
    <span v-if="data.left === null || data.right === null">One-Arm </span>
    <span
      v-if="
        (data.scappulls > 0 && data.exercise === 0) ||
          (data.pullups > 0 && data.exercise === 0)
      "
    ></span>
    <span v-else>{{ options[data.exercise].name }}</span>
    <span v-if="data.scappulls > 0"> Pull</span>
    <span v-if="data.pullups > 0"> Pull-up</span>
    <span v-if="data.pullups > 1 || data.scappulls > 1">s</span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { count } from '@/misc/helpers'

export default {
  name: 'WorkoutItemName',
  props: {
    data: Object
  },
  data: () => ({}),
  computed: {
    ...mapState('workouts', ['options'])
  },
  methods: {
    count
  }
}
</script>
