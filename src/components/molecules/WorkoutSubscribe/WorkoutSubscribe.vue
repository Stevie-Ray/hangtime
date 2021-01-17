<template>
  <div v-if="currentWorkout">
    <v-btn :x-small="small" icon @click="dialogs.subscribe = true">
      <v-icon v-if="isSubscribed" :small="small">{{ mdi.star }}</v-icon>
      <v-icon v-else :small="small">{{ mdi.starOutline }}</v-icon>
      <span
        v-if="currentSubscribers && currentSubscribers.length > 1"
        :class="{ 'text-subtitle-2 pr-1': small }"
      >
        {{ currentSubscribers.length - 1 }}
      </span>
    </v-btn>

    <!-- Subscribe Dialog -->
    <dialog-workout-subscribe
      :id="id"
      v-model="dialogs.subscribe"
      :current-workout="currentWorkout"
      :is-subscribed="isSubscribed"
      :user-id="userId"
    ></dialog-workout-subscribe>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DialogWorkoutSubscribe from '@/components/DialogWorkoutSubscribe'
import { mdiStar, mdiStarOutline } from '@mdi/js'

export default {
  name: 'WorkoutSubscribe',
  components: {
    DialogWorkoutSubscribe
  },
  props: {
    currentWorkout: Object,
    id: String,
    small: Boolean,
    userId: String
  },
  data: () => ({
    dialogs: {
      subscribe: false
    },
    mdi: {
      star: mdiStar,
      starOutline: mdiStarOutline
    }
  }),
  computed: {
    ...mapState('authentication', ['user']),
    currentSubscribers() {
      if (!this.currentWorkout) return
      // eslint-disable-next-line consistent-return
      return this.currentWorkout.subscribers
    },
    isSubscribed() {
      if (!this.currentSubscribers || !this.user) return
      if (!this.currentSubscribers.length > 0) return
      const subscribed = this.currentSubscribers.some(
        subscriber => subscriber === this.user.id
      )
      // eslint-disable-next-line consistent-return
      return subscribed
    }
  },
  methods: {}
}
</script>
