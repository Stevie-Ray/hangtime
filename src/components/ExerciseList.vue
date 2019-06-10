<template>
  <div>
    <div v-if="exercises === null" class="loading">
      <v-progress-circular :size="60" color="primary" indeterminate>
      </v-progress-circular>
      <div class="text-xs-center">Loading exercises...</div>
    </div>
    <v-list v-if="exercises && !exercises.length" two-line>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>No exercises added yet</v-list-item-title>
          <v-list-item-subtitle
            >use the
            <v-icon small>mdi-plus</v-icon>
            button to add an exercise
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list two-line>
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
          :key="exercise.order"
          class="exercise-row"
          :index="index"
          :disable-actions="!networkOnLine"
          :data="exercise"
          :edit-workout="editWorkout"
          @goToExerciseDetails="
            $router.push({
              name: 'exercise',
              params: { id: id, exercise: $event, editingWorkout: editWorkout }
            })
          "
        ></exercise-list-item>
      </draggable>
    </v-list>
  </div>
</template>

<script>
import ExerciseListItem from '@/components/ExerciseListItem'
import draggable from 'vuedraggable'
import { mapState, mapActions } from 'vuex'

export default {
  components: { ExerciseListItem, draggable },
  props: {
    id: String,
    editWorkout: Boolean
  },
  computed: {
    ...mapState('exercises', ['exercises']),
    ...mapState('app', ['networkOnLine']),
    exerciseList: {
      get() {
        return this.exercises
      },
      set() {
        return this.exercises
        // this.triggerReorderExercises({ exercises: value, workout: this.id })
      }
    }
  },
  created() {
    // TODO: remove ugly code
    this.$store.dispatch('exercises/getWorkoutExercises', this.id)
  },
  methods: {
    ...mapActions('exercises', ['triggerReorderExercises'])
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
