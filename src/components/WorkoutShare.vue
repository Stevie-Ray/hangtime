<template>
  <div v-if="currentWorkout">
    <v-btn :x-small="small" icon @click="dialogs.share = true">
      <v-icon v-if="!currentWorkout.share" :small="small">{{
        mdi.starOutline
      }}</v-icon>
      <v-icon v-else :small="small">{{ mdi.starOff }}</v-icon>
      <span
        v-if="currentWorkout.share && currentWorkout.subscribers.length > 1"
        :class="{ 'text-subtitle-2 pr-1': small }"
      >
        {{ currentWorkout.subscribers.length - 1 }}
      </span>
    </v-btn>

    <!-- Share Dialog -->
    <dialog-workout-share
      v-model="dialogs.share"
      :current-workout="currentWorkout"
    ></dialog-workout-share>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DialogWorkoutShare from '@/components/DialogWorkoutShare'
import { mdiStarOutline, mdiStarOff } from '@mdi/js'

export default {
  name: 'WorkoutShare',
  components: {
    DialogWorkoutShare
  },
  props: {
    currentWorkout: Object,
    userWorkout: Boolean,
    small: Boolean
  },
  data: () => ({
    dialogs: {
      share: false
    },
    mdi: {
      starOutline: mdiStarOutline,
      starOff: mdiStarOff
    }
  }),
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('app', ['currentTab'])
  },
  methods: {}
}
</script>
