<template>
  <div class="exercise-item" :class="{ active: editWorkout }">
    <v-list-item ripple @click="$emit('goToExerciseDetails', index)">
      <v-icon v-if="editWorkout" class="handle">mdi-drag</v-icon>
      <v-list-item-avatar>
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
          <workout-item-name :data="data"></workout-item-name>
        </v-list-item-title>

        <v-list-item-subtitle class="text--primary">
          <span>Hold: {{ data.hold }}s. </span>
          <span v-if="data.repeat > 0">Rest: {{ data.rest }}s. </span>
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
import WorkoutItemName from './WorkoutItemName'

export default {
  components: { WorkoutItemName },
  props: {
    data: Object,
    editWorkout: Boolean,
    index: Number,
    // isWorkoutDeletionPending: Boolean,
    // isWorkoutUpdatePending: Boolean,
    disableActions: Boolean
  },
  computed: {
    ...mapState('workouts', ['options'])
  },
  methods: {
    getImg,
    count
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.exercise-item.active {
  .handle {
    height: 40px;
    min-width: 24px;
    width: 24px;
    margin-right: 16px;
    margin-bottom: 16px;
    margin-top: 16px;
  }
  .v-avatar {
    margin-right: 24px;
  }
  .v-divider--inset:not(.v-divider--vertical) {
    margin-left: 112px;
    max-width: calc(100% - 112px);
  }
}
</style>
