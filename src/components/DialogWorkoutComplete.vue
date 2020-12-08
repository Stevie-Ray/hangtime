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

        <div class="subtitle-1">{{ $t('Time worked out') }}</div>
        <p class="text-h2 font-weight-bold">
          {{ count(timeInWorkout) }}
        </p>

        <div
          v-if="user && user.completed && !isNaN(user.completed.time)"
          class="subtitle-2"
        >
          {{ $t('Total time worked out') }}:
          {{ count(user.completed.time + timeInWorkout) }}
        </div>
        <div
          v-if="user && user.completed && !isNaN(user.completed.hold)"
          class="subtitle-2"
        >
          {{ $t('Total time hangboarding') }}:
          {{ count(user.completed.hold + timeHoldingOn) }}
        </div>
        <div
          v-if="user && user.completed && !isNaN(user.completed.amount)"
          class="subtitle-2"
        >
          {{ $t('Total workouts done') }}: {{ user.completed.amount + 1 }}
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="completeAction()">
          {{ $t('Close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { count } from '@/misc/helpers'

export default {
  props: {
    value: Boolean,
    currentWorkout: Object,
    timeHoldingOn: Number,
    timeInWorkout: Number
  },
  data: () => ({}),
  computed: {
    ...mapState('authentication', ['user']),
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
    ...mapActions('authentication', ['triggerUpdateTimes']),
    completeAction() {
      this.$emit('input', false)
      this.triggerUpdateTimes({
        total: this.timeInWorkout,
        hold: this.timeHoldingOn
      })
      this.$router.push({ name: 'workouts' })
    }
  }
}
</script>

<style lang="scss" scoped></style>
