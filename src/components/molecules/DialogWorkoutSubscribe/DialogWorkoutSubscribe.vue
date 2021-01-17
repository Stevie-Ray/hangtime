<template>
  <v-dialog v-model="show" width="500">
    <v-card>
      <v-card-title class="text-h5">
        <span v-if="!isSubscribed">
          {{ $t('Subscribe to this workout') }}
        </span>
        <span v-else>
          {{ $t('Unsubscribe from this workout') }}
        </span>
      </v-card-title>

      <v-card-text>
        <span v-if="!isSubscribed">
          {{
            $t(
              'When you subscribe to: {name}, this workout will be added to your workouts',
              { name: currentWorkout.name }
            )
          }}
        </span>
        <span v-else>
          {{
            $t(
              'When you unsubscribe from: {name}, this workout will be added to your workouts',
              { name: currentWorkout.name }
            )
          }}
        </span>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="$emit('input', false)">
          {{ $t('Cancel') }}
        </v-btn>
        <v-btn text @click="clicksubscribeWorkout">
          <span v-if="!isSubscribed">{{ $t('Subscribe') }}</span>
          <span v-else>{{ $t('Unsubscribe') }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'DialogWorkoutSubscribe',
  props: {
    value: Boolean,
    currentWorkout: Object,
    isSubscribed: Boolean,
    id: String,
    userId: String
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
    ...mapActions('workouts', [
      'shareWorkout',
      'triggerAddWorkoutSubscriber',
      'triggerRemoveWorkoutSubscriber'
    ]),
    clicksubscribeWorkout() {
      if (this.isSubscribed) {
        this.triggerRemoveWorkoutSubscriber({
          id: this.id,
          user: this.user.id,
          userId: this.userId
        })
      } else {
        this.triggerAddWorkoutSubscriber({
          id: this.id,
          user: this.user.id,
          userId: this.userId
        })
      }
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss" scoped></style>
