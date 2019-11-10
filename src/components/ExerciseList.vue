<template>
  <div>
    <div v-if="currentWorkout === null" class="loading text-center">
      <v-progress-circular
        :size="60"
        color="primary"
        indeterminate
        class="my-4"
      >
      </v-progress-circular>
      <div>Loading exercises...</div>
    </div>
    <v-container
      v-if="currentWorkout && !currentWorkout.exercises.length"
      fluid
    >
      <v-row justify="center" align="center">
        <v-avatar aspect-ratio="1" class="grey lighten-2" size="164">
          <img src="@/assets/sloth/sitting.svg" alt="sloth sitting" />
        </v-avatar>
      </v-row>
      <v-row>
        <v-card flat>
          <v-card-title>
            Start adding exercises
          </v-card-title>
          <v-card-subtitle>
            Add multiple exercises using the
            <v-icon small>mdi-playlist-plus</v-icon>
            button.
          </v-card-subtitle>
        </v-card>
      </v-row>
    </v-container>
    <v-list v-if="currentWorkout && currentWorkout.exercises.length" two-line>
      <draggable
        v-model="exerciseList"
        class="draggable"
        ghost-class="ghost"
        :animation="0"
        :disabled="!networkOnLine"
        handle=".handle"
      >
        <exercise-list-item
          v-for="(exercise, index) in exerciseList"
          :key="index"
          class="exercise-row"
          :index="index"
          :disable-actions="!networkOnLine"
          :data="exercise"
          :edit-workout="editWorkout"
          @goToExerciseDetails="
            $router.push({
              name: 'exercise',
              params: { id: id, index: $event, editingWorkout: editWorkout }
            })
          "
        ></exercise-list-item>
      </draggable>
    </v-list>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState, mapActions, mapGetters } from 'vuex'
import ExerciseListItem from '@/components/ExerciseListItem'

export default {
  components: { ExerciseListItem, draggable },
  props: {
    id: String,
    editWorkout: Boolean
  },
  computed: {
    ...mapState('app', ['networkOnLine']),
    ...mapGetters('workouts', ['workoutById']),
    currentWorkout() {
      return this.workoutById(this.id)
    },
    exerciseList: {
      get() {
        return this.currentWorkout.exercises
      },
      set(value) {
        // return this.currentWorkout.exercises
        this.triggerReorderExercises({
          exercises: value,
          workout: this.currentWorkout
        })
      }
    }
  },
  methods: {
    ...mapActions('workouts', ['triggerReorderExercises'])
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
