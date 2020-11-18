<template>
  <div class="exercise-item" :class="{ active: editWorkout }">
    <v-list-item ripple @click="$emit('go-to-exercise-details', index)">
      <v-icon v-if="editWorkout" class="handle">{{ mdi.drag }}</v-icon>
      <v-list-item-avatar>
        <img
          v-if="data.grip"
          :src="getImg(grip[data.grip].image)"
          alt=""
          aspect-ratio="1"
          class="grey lighten-2"
        />
        <img
          v-else
          :src="getImg(grip[data.exercise].image)"
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
          <div>{{ count(data.time) }}</div>
          <div v-if="data.weight && data.weight !== 0">
            {{ weightConverter(data.weight, user) }}
            {{ weightShort }}
            <v-icon x-small>{{ mdi.weight }}</v-icon>
          </div>
        </v-list-item-action-text>
      </v-list-item-action>
    </v-list-item>
    <v-divider inset></v-divider>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { getImg, count, weightConverter } from '@/misc/helpers'
import { mdiDrag, mdiWeight } from '@mdi/js'
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
  data: () => ({
    mdi: {
      drag: mdiDrag,
      weight: mdiWeight
    }
  }),
  computed: {
    ...mapState('workouts', ['grip']),
    ...mapState('authentication', ['user']),
    ...mapGetters('authentication', ['weightShort'])
  },
  methods: {
    getImg,
    count,
    weightConverter
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

.v-list-item__action-text {
  text-align: right;
}
</style>
