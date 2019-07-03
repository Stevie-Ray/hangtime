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
                <v-text-field
                  v-model="workoutToCreateName"
                  placeholder="New workout"
                  class="workout-name-input"
                  counter="24"
                  :rules="[rules.required, rules.length(24)]"
                  label="Workout name *"
                  required
                >
                </v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-textarea
                  v-model="workoutToCreateDescription"
                  counter="140"
                  :rules="[rules.required, rules.length(140)]"
                  class="workout-description-input"
                  placeholder="Give a short description of your workout, for example indicate when this training is suitable"
                  label="Workout description"
                ></v-textarea>
              </v-flex>

              <v-flex>
                <v-select
                  v-model="workoutToCreateDifficulty"
                  :items="levels"
                  item-text="name"
                  item-value="value"
                  label="Difficulty"
                >
                </v-select>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="$emit('input', false)">
          Close
        </v-btn>
        <v-btn
          text
          class="add-exersice-btn"
          :disabled="
            workoutToCreateName === '' || workoutToCreateDescription === ''
          "
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
    dialog: true,
    rules: {
      length: len => v =>
        (v || '').length <= len || `A maximum of  ${len} characters is allowed`,
      required: v => !!v || 'This field is required'
    }
  }),
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('workouts', [
      'levels',
      'workoutToCreate',
      'workoutCreationPending'
    ]),
    workoutToCreateName: {
      get() {
        return this.workoutToCreate.name
      },
      set(value) {
        this.setWorkoutToCreate({ name: value })
      }
    },
    workoutToCreateDescription: {
      get() {
        return this.workoutToCreate.description
      },
      set(value) {
        this.setWorkoutToCreate({ description: value })
      }
    },
    workoutToCreateDifficulty: {
      get() {
        return this.workoutToCreate.level
      },
      set(value) {
        this.setWorkoutToCreate({ level: value })
      }
    },
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
      this.setWorkoutToCreate({
        company: this.user.settings.hangboards[this.user.settings.selected]
          .company,
        hangboard: this.user.settings.hangboards[this.user.settings.selected]
          .hangboard,
        user: {
          displayName: this.user.displayName,
          grade: this.user.settings.grade,
          id: this.user.id,
          photoURL: this.user.photoURL
        }
      })
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
