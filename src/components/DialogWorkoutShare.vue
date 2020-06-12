<template>
  <v-dialog v-model="show" width="500">
    <v-card>
      <v-card-title class="text-h5">
        <span v-if="!currentWorkout.share">Share with the community</span>
        <span v-else>Remove from the community</span>
      </v-card-title>

      <v-card-text>
        <span v-if="!currentWorkout.share">
          Are you sure you want to share
          <strong>{{ currentWorkout.name }}</strong> with the community?
        </span>
        <span v-else>
          Are you sure you want to remove
          <strong>{{ currentWorkout.name }}</strong> from the community?
        </span>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="$emit('input', false)">
          Cancel
        </v-btn>
        <v-btn text @click="clickshareWorkout">
          <span v-if="!currentWorkout.share">Share</span>
          <span v-else>Remove</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'DialogWorkoutShare',
  props: {
    value: Boolean,
    currentWorkout: Object
  },
  data: () => ({}),
  computed: {
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
    ...mapActions('workouts', ['shareWorkout']),
    clickshareWorkout() {
      this.shareWorkout(this.currentWorkout.id)
      this.$emit('input', false)
      if (this.currentWorkout.share) {
        this.$router.push({ name: 'community' })
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
