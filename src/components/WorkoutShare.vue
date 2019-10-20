<template>
  <div v-if="currentWorkout">
    <v-btn icon @click="triggerShareWorkout">
      <v-icon v-if="!currentWorkout.share">mdi-star-outline</v-icon>
      <v-icon v-else>mdi-star-off</v-icon>
    </v-btn>

    <!-- Share Dialog -->
    <dialog-workout-share
      v-model="dialogs.share"
      :current-workout="currentWorkout"
    ></dialog-workout-share>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import DialogWorkoutShare from '@/components/DialogWorkoutShare'

export default {
  components: {
    DialogWorkoutShare
  },
  props: {
    currentWorkout: Object,
    userWorkout: Boolean
  },
  data: () => ({
    dialogs: {
      share: false
    }
  }),
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('app', ['currentTab'])
  },
  methods: {
    ...mapActions('workouts', ['shareWorkout']),
    triggerShareWorkout() {
      if (!this.currentWorkout.share) {
        this.dialogs.share = true
      } else {
        this.shareWorkout(this.currentWorkout.id)
        this.$router.push({ path: this.currentTab })
      }
    }
  }
}
</script>
