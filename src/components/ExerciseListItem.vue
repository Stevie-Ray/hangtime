<template>
  <div class="exercise-item">
    <v-list-item ripple @click="$emit('goToExerciseDetails', data.id)">
      <v-list-item-avatar>
        <v-icon v-if="editWorkout" class="handle">mdi-drag-vertical</v-icon>

        <img
          :src="getImg(options[data.exercise].image)"
          alt=""
          aspect-ratio="1"
          class="grey lighten-2"
        />
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-subtitle>
          Pause for {{ data.pause }} sec.
        </v-list-item-subtitle>

        <v-list-item-title>
          <span v-if="data.repeat > 1">{{ data.repeat }}x</span>
          <span v-if="data.pullups > 1"> {{ data.pullups }}</span>
          <span> {{ options[data.exercise].name }}</span>
          <span v-if="data.pullups > 1">s</span>
        </v-list-item-title>

        <v-list-item-subtitle class="text--primary">
          <span>Hold: {{ data.hold }}s. </span>
          <span v-if="data.repeat > 1">Rest: {{ data.rest }}s. </span>
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-action v-if="!disableActions">
        <v-list-item-action-text>
          {{ count(data.time) }}
        </v-list-item-action-text>
      </v-list-item-action>
    </v-list-item>
    <v-divider inset></v-divider>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getImg, count } from '@/misc/helpers'

export default {
  props: {
    data: Object,
    editWorkout: Boolean,
    index: Number,
    // isWorkoutDeletionPending: Boolean,
    // isWorkoutUpdatePending: Boolean,
    disableActions: Boolean
  },
  computed: {
    ...mapState('exercises', ['options'])
  },
  methods: {
    getImg,
    count
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
