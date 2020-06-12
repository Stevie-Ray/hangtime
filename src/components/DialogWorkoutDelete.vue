<template>
  <v-dialog v-model="show" width="500">
    <v-card>
      <v-card-title class="text-h5">Delete workout</v-card-title>

      <v-card-text>
        Are you sure you want to delete
        <strong>{{ currentWorkout.name }}</strong> from your workouts?
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="$emit('input', false)">
          Cancel
        </v-btn>
        <v-btn text @click="deleteWorkout(currentWorkout.id)">
          Delete
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
    ...mapActions('workouts', ['deleteUserWorkout']),
    deleteWorkout(id) {
      this.deleteUserWorkout(id)
      this.$router.push({ name: 'workouts' })
    }
  }
}
</script>

<style lang="scss" scoped></style>
