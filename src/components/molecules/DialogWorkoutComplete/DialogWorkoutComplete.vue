<template>
  <v-dialog v-model="show" persistent width="500">
    <v-card>
      <v-card-title class="text-h5">{{ $t('Well done') }}!</v-card-title>

      <v-card-text>
        <p v-if="currentWorkout">
          {{
            $t('You completed {name}', {
              name: currentWorkout.name
            })
          }}
        </p>

        <div class="subtitle-1">
          {{ $t('Time worked out') }}
        </div>
        <div class="text-h2 font-weight-bold">
          {{ count(timeInWorkout) }}
        </div>
        <div>{{ $t('Hangboarding') }}: {{ count(timeHoldingOn) }}</div>

        <v-divider v-if="user && user.completed" class="my-4"></v-divider>

        <div
          v-if="user && user.completed && !isNaN(user.completed.time)"
          class="subtitle-2"
        >
          {{ $t('Total time worked out') }}:
          {{ count(user.completed.time) }}
        </div>
        <div
          v-if="user && user.completed && !isNaN(user.completed.hold)"
          class="subtitle-2"
        >
          {{ $t('Total time hangboarding') }}:
          {{ count(user.completed.hold) }}
        </div>
        <div
          v-if="user && user.completed && !isNaN(user.completed.amount)"
          class="subtitle-2"
        >
          {{ $t('Workouts done') }}: {{ user.completed.amount }}
        </div>
        <v-divider v-if="user && user.completed" class="my-4"></v-divider>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="shareAPI" text primary @click="shareExternal"
          >{{ $t('Share') }}
        </v-btn>
        <v-btn text @click="completeAction()">
          {{ $t('Close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { count } from '@/misc/helpers'

export default {
  props: {
    user: Object,
    value: Boolean,
    currentWorkout: Object,
    timeHoldingOn: Number,
    timeInWorkout: Number
  },
  data: () => ({
    shareAPI: navigator.share
  }),
  computed: {
    ...mapState('app', ['networkOnLine', 'appTitle']),
    show: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    count,
    completeAction() {
      this.$emit('input', false)
      this.$router.push({ name: 'workouts' })
    },
    shareExternal() {
      let title = this.$i18n.t('I just did a quick workout for {time}', {
        time: count(this.timeInWorkout)
      })
      let text = `${title}. ${this.$i18n.t('Where I hung for {time}', {
        time: count(this.timeHoldingOn)
      })}. ${this.$i18n.t('Join {appTitle}', { appTitle: this.appTitle })}!`

      if (this.currentWorkout) {
        title = `${this.currentWorkout.name} | ${this.appTitle}`
        text = `${this.$i18n.t('I just completed {name}', {
          name: this.currentWorkout.name
        })}. ${this.$i18n.t('Description')}: "${
          this.currentWorkout.description
        }". ${this.$i18n.t('Join {appTitle}', { appTitle: this.appTitle })}!`
      }

      navigator
        .share({
          title,
          text,
          url: document.location.href
        })
        .then(() => {
          // eslint-disable-next-line no-console
          console.log('Thanks for sharing!')
        })
        .catch(
          // eslint-disable-next-line no-console
          console.error
        )
    }
  }
}
</script>

<style lang="scss" scoped></style>
