<template>
  <div class="workout-item">
    <v-list-item ripple>
      <v-list-item-avatar @click.stop="overlay = true">
        <v-img
          v-if="data && data.user"
          :src="data.user.photoURL"
          :alt="data.user.displayName"
          aspect-ratio="1"
          class="grey lighten-2"
        />
      </v-list-item-avatar>

      <v-list-item-content @click="$emit('goToWorkoutDetails', data.id)">
        <v-list-item-title>
          <v-icon v-if="data.video">mdi-video</v-icon>
          {{ data.name }}
        </v-list-item-title>
        <v-list-item-subtitle
          >{{ count(data.time) }} - {{ data.description }}</v-list-item-subtitle
        >
      </v-list-item-content>

      <v-list-item-action class="text-right">
        <v-list-item-action-text>
          <v-chip v-if="difficultyById(data.level)" class="mt-2" x-small>
            {{ difficultyById(data.level).name }}
          </v-chip>
          <div class="mt-1">
            <workout-share
              v-if="data && userWorkout"
              :current-workout="data"
              :user-workout="userWorkout"
              small
            ></workout-share>

            <workout-subscribe
              v-if="data && user && !userWorkout"
              :id="data.id"
              :current-workout="data"
              :user-id="data.user.id"
              small
            ></workout-subscribe>
          </div>
        </v-list-item-action-text>
      </v-list-item-action>
    </v-list-item>

    <dialog-user-image v-model="overlay" :data="data"></dialog-user-image>

    <v-divider inset></v-divider>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import DialogUserImage from '@/components/DialogUserImage'
import WorkoutSubscribe from '@/components/WorkoutSubscribe'
import WorkoutShare from '@/components/WorkoutShare'
import { count } from '@/misc/helpers'

export default {
  name: 'WorkoutListItem',
  components: {
    DialogUserImage,
    'workout-subscribe': WorkoutSubscribe,
    'workout-share': WorkoutShare
  },
  props: {
    data: Object,
    index: Number
  },
  data: () => ({
    overlay: false
  }),
  computed: {
    ...mapState('authentication', ['user']),
    ...mapGetters('workouts', ['difficultyById']),
    userWorkout() {
      if (!this.data) return
      // eslint-disable-next-line consistent-return
      return this.data.user.id === this.user.id
    }
  },
  methods: {
    count
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
