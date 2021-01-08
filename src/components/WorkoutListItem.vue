<template>
  <div class="workout-item">
    <v-list-item v-focus="showOptions" ripple>
      <v-list-item-avatar class="grey lighten-2" @click.stop="overlay = true">
        <v-img
          v-if="data && data.user && data.user.photoURL"
          :src="data.user.photoURL"
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

    <dialog-user-image v-model="overlay" :data="data.user"></dialog-user-image>

    <v-divider inset></v-divider>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import DialogUserImage from '@/components/DialogUserImage'
import WorkoutSubscribe from '@/components/WorkoutSubscribe'
import WorkoutShare from '@/components/WorkoutShare'
import { count } from '@/misc/helpers'
import { mdiVideo } from '@mdi/js'

export default {
  name: 'WorkoutListItem',
  components: {
    DialogUserImage,
    'workout-subscribe': WorkoutSubscribe,
    'workout-share': WorkoutShare
  },
  directives: {
    focus: {
      // directive definition
      // eslint-disable-next-line no-unused-vars
      bind(el, { value }) {
        if (typeof value !== 'function') {
          console.warn(`Expect a function, got ${value}`)
          return
        }

        let pressTimer = null

        const start = e => {
          if (e.type === 'click' && e.button !== 0) {
            return
          }

          if (pressTimer === null) {
            pressTimer = setTimeout(() => value(e), 1000)
          }
        }

        const cancel = () => {
          if (pressTimer !== null) {
            clearTimeout(pressTimer)
            pressTimer = null
          }
        }

        ;['mousedown', 'touchstart'].forEach(e => el.addEventListener(e, start))
        ;['click', 'mouseout', 'touchend', 'touchcancel'].forEach(e =>
          el.addEventListener(e, cancel)
        )
      }
    }
  },
  props: {
    data: Object,
    index: Number
  },
  data: () => ({
    overlay: false,
    shareAPI: navigator.share,
    mdi: {
      video: mdiVideo
    }
  }),
  computed: {
    ...mapState('authentication', ['user']),
    ...mapGetters('workouts', ['difficultyById']),
    ...mapState('app', ['appTitle']),
    userWorkout() {
      if (!this.data) return
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
