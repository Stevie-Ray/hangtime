<template>
  <v-dialog v-model="show" width="500">
    <v-card>
      <v-card-title class="headline">Share workout</v-card-title>

      <v-card-text>
        Are you sure you want to share
        <strong>{{ currentWorkout.name }}</strong> with the community?
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="$emit('input', false)">
          Cancel
        </v-btn>
        <v-btn text @click="clickshareWorkout">
          Share
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
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
      this.$router.push({ name: 'community' })
    }
  }
}
</script>

<style lang="scss" scoped></style>
