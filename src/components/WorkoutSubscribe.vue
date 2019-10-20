<template>
  <v-btn icon>
    <v-icon
      v-if="isSubscribed"
      @click="
        triggerRemoveWorkoutSubscriber({
          id: id,
          user: user.id,
          userId: userId
        })
      "
    >
      mdi-star
    </v-icon>
    <v-icon
      v-else
      @click="
        triggerAddWorkoutSubscriber({
          id: id,
          user: user.id,
          userId: userId
        })
      "
    >
      mdi-star-outline
    </v-icon>
    <span v-if="currentSubscribers && currentSubscribers.length > 0">
      {{ currentSubscribers.length }}
    </span>
  </v-btn>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    currentWorkout: Object,
    id: String,
    userId: String
  },
  data: () => ({}),
  computed: {
    ...mapState('authentication', ['user']),
    currentSubscribers() {
      if (!this.currentWorkout) return
      // eslint-disable-next-line consistent-return
      return this.currentWorkout.subscribers
    },
    isSubscribed() {
      if (!this.currentSubscribers) return
      if (!this.currentSubscribers.length > 0) return
      const subscribed = this.currentSubscribers.some(
        subscriber => subscriber === this.user.id
      )
      // eslint-disable-next-line consistent-return
      return subscribed
    }
  },
  methods: {
    ...mapActions('workouts', [
      'shareWorkout',
      'triggerAddWorkoutSubscriber',
      'triggerRemoveWorkoutSubscriber'
    ])
  }
}
</script>
