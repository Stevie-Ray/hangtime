<template>
  <div class="workout-item-name">
    <span v-if="data.repeat > 0">{{ data.repeat + 1 }}x </span>
    <span v-if="data.pullups > 1">{{ data.pullups }} </span>
    <span v-if="data.left === null || data.right === null">One-Arm </span>
    <span v-if="data.exercise === 0">
      <span v-if="data.grip">{{ grip[data.grip].name }}</span>
      <!-- fallback-->
      <span v-else-if="grip[data.exercise]">{{
        grip[data.exercise].name
      }}</span>
    </span>
    <span v-else-if="data.grip !== 0">
      <span v-if="data.grip">{{ grip[data.grip].short }}</span>
      <!-- fallback-->
      <span v-else-if="grip[data.exercise]">{{
        grip[data.exercise].name
      }}</span>
    </span>
    <span v-if="data.pullups > 0 && data.exercise > 0">
      {{ exercises[data.exercise - 1].name }}</span
    ><span v-if="data.pullups > 1 && data.exercise > 0">s</span>
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
    ...mapState('workouts', ['grip', 'exercises'])
  },
  methods: {
    count
  }
}
</script>
