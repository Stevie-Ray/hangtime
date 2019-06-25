<template>
  <v-layout row class="exercise">
    <v-app-bar color="primary" app dark fixed>
      <v-icon
        @click="
          $router.push({
            name: 'workout',
            params: { id: id, editingWorkout: editWorkout }
          })
        "
        >mdi-arrow-left
      </v-icon>
      <v-avatar size="32px">
        <v-img
          v-if="networkOnLine"
          :src="user.photoURL"
          :alt="user.displayName"
          aspect-ratio="1"
          class="grey lighten-2"
        />
      </v-avatar>
      <v-toolbar-title>
        <!-- Exercise details -->
        <span v-if="currentExercise">
          <span v-if="currentExercise.repeat > 1"
            >{{ currentExercise.repeat }}x</span
          >
          <span v-if="currentExercise.pullups > 1">
            {{ currentExercise.pullups }}</span
          >
          <span> {{ options[currentExercise.exercise].name }}</span>
          <span v-if="currentExercise.pullups > 1">s</span>
        </span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn v-if="!editWorkout" icon @click="edit = true">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        v-if="editWorkout"
        icon
        class="delete-btn"
        @click.stop="deleteExercise"
      >
        <v-icon
          >{{
            isExerciseDeletionPending(currentExercise.id)
              ? 'mdi-autorenew'
              : 'mdi-delete'
          }}
        </v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex text-xs-center xs12 sm8 md6>
            <!-- Get exercises item -->
            <exercise-item
              v-if="currentExercise"
              :id="id"
              :index="index"
              :data="currentExercise"
              :edit-workout="editWorkout"
            ></exercise-item>

            <v-speed-dial bottom right fixed>
              <v-btn
                v-if="editWorkout"
                slot="activator"
                color="secondary"
                dark
                fab
                large
                @click="clickUpdateExercise"
              >
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </v-speed-dial>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-layout>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import ExerciseItem from '@/components/ExerciseItem'
import { getImg, count } from '@/misc/helpers'

export default {
  components: { ExerciseItem },
  props: {
    id: String,
    index: Number,
    editingWorkout: Boolean,
    isWorkoutDeletionPending: Boolean
  },
  data: () => ({
    edit: null
  }),
  head: {
    title: {
      inner: 'Exercise'
    },
    meta: [
      {
        name: 'description',
        content: '',
        id: 'desc'
      }
    ]
  },
  computed: {
    ...mapState('app', ['networkOnLine']),
    ...mapState('authentication', ['user']),
    ...mapState('workouts', ['options']),
    ...mapGetters('workouts', ['workoutById', 'isExerciseDeletionPending']),
    currentExercise() {
      if (!this.workoutById(this.id)) return
      return this.workoutById(this.id).exercises[this.index]
    },
    editWorkout() {
      if (this.editingWorkout && this.edit === null) {
        return this.editingWorkout
      }
      return this.edit
    }
  },
  methods: {
    count,
    getImg,
    ...mapActions('workouts', ['deleteUserExercise', 'triggerUpdateWorkout']),
    deleteExercise() {
      this.deleteUserExercise({
        workout: this.workoutById(this.id),
        index: this.index
      })
      this.$router.push({ name: 'workout', params: { id: this.id } })
    },
    clickUpdateExercise() {
      this.triggerUpdateWorkout(this.workoutById(this.id))
      this.edit = false
    }
  }
}
</script>

<style lang="scss">
// fix full-width slider overflow
.exercise {
  overflow-y: hidden;
}
</style>
