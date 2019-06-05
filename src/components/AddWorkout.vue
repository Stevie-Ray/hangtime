<template>
  <v-dialog v-model="show" width="500">
    <v-card class="modal-wrapper">
      <v-card-title class="headline" primary-title>
        Add a new workout
      </v-card-title>

      <v-card-text>
        <v-form class="workout-action-bar">
          <v-container>
            <v-layout row wrap>
              <v-flex xs12>
                <input
                  placeholder="workout name..."
                  class="workout-name-input"
                  type="text"
                  :value="workoutToCreate.name"
                  @input="setWorkoutToCreate({ name: $event.target.value })"
                />
              </v-flex>

              <v-flex xs12>
                <textarea
                  placeholder="workout description..."
                  class="workout-description-input"
                  type="text"
                  :value="workoutToCreate.description"
                  @input="
                    setWorkoutToCreate({ description: $event.target.value })
                  "
                ></textarea>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('input', false)">
          Close
        </v-btn>
        <v-btn
          text
          color="primary"
          class="add-exersice-btn"
          @click="saveWorkout"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import { getImg } from '@/misc/helpers'

export default {
  props: {
    value: Boolean
  },
  data: () => ({
    dialog: true
  }),
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('workouts', ['workoutToCreate', 'workoutCreationPending']),
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
    ...mapMutations('workouts', ['setWorkoutToCreate']),
    ...mapActions('workouts', ['triggerAddWorkoutAction']),
    getImg,
    saveWorkout($event) {
      console.log('fire')
      this.triggerAddWorkoutAction($event)
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-wrapper {
  .headline {
    display: flex;
    /*justify-content: center;*/
    align-items: center;
  }

  .app-logo {
    max-width: 50px;
    margin-right: 10px;
  }

  .footer {
    display: flex;
    /*justify-content: center;*/
    align-items: flex-end;
    /*font-size: 12px;*/

    .apple-navigation-action-img {
      max-width: 15px;
      margin: 0 10px;
    }
  }
}
</style>
