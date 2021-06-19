<template>
  <div class="workout-item">
    <v-list-item
      v-focus="showOptions"
      :data-long-press-delay="longPressTime"
      ripple
    >
      <v-list-item-avatar class="grey lighten-2" @click.stop="overlay = true">
        <v-img
          v-if="data && data.user && data.user.photoURL"
          :src="dataPhoto"
          :alt="data.user.displayName"
        />
      </v-list-item-avatar>

      <v-list-item-content
        class="workout-item-text"
        @click="$emit('go-to-workout-details', data.id)"
      >
        <v-list-item-title>
          <v-icon v-if="data.video" small>{{ mdi.video }}</v-icon>
          {{ data.name }}
        </v-list-item-title>
        <v-list-item-subtitle
          >{{ count(data.time) }} - {{ data.description }}</v-list-item-subtitle
        >
      </v-list-item-content>

      <v-list-item-action class="text-right">
        <v-list-item-action-text>
          <v-chip v-if="difficultyById(data.level)" class="mt-2" x-small>
            {{ $t(difficultyById(data.level).name) }}
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

    <dialog-user-image
      v-if="data"
      v-model="overlay"
      :data="data.user"
    ></dialog-user-image>

    <v-divider inset></v-divider>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import DialogUserImage from '@/components/molecules/DialogUserImage/DialogUserImage'
import WorkoutSubscribe from '@/components/molecules/WorkoutSubscribe/WorkoutSubscribe'
import WorkoutShare from '@/components/molecules/WorkoutShare/WorkoutShare'
import { count } from '@/misc/helpers'
import { mdiVideo } from '@mdi/js'
import 'long-press-event/dist/long-press-event.min'

export default {
  name: 'WorkoutListItem',
  components: {
    DialogUserImage,
    'workout-subscribe': WorkoutSubscribe,
    'workout-share': WorkoutShare
  },
  directives: {
    focus: {
      bind(el, { value }) {
        if (typeof value !== 'function') return
        el.addEventListener('long-press', (e) => value(e))
      }
    }
  },
  props: {
    data: Object,
    index: Number
  },
  data: () => ({
    overlay: false,
    longPressTime: 800,
    shareAPI: navigator.share,
    mdi: {
      video: mdiVideo
    }
  }),
  computed: {
    ...mapState('authentication', ['user']),
    ...mapGetters('workouts', ['difficultyById']),
    ...mapState('app', ['appTitle']),
    dataPhoto() {
      if (this.data.user.pictureURL) {
        return this.data.user.pictureURL
      }
      return this.data.user.photoURL
    },
    userWorkout() {
      if (!this.data || !this.user) return
      // eslint-disable-next-line consistent-return
      return this.data.user.id === this.user.id
    }
  },
  methods: {
    count,
    showOptions() {
      const path =
        window.location.origin +
        this.$router.resolve({
          name: 'workout',
          params: {
            id: this.data.id,
            company: this.data.company,
            hangboard: this.data.hangboard,
            userId: this.data.user.id
          }
        }).href
      if (this.shareAPI && this.data && this.data.share) {
        navigator
          .share({
            title: `${this.data.name} | ${this.appTitle}`,
            text: `${this.data.name} | ${this.appTitle} - ${this.data.description}`,
            url: `${path}`
          })
          .then(() => {
            // eslint-disable-next-line no-console
            console.log('Thanks for sharing!')
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.workout-item-text {
  user-select: none;
}
</style>
