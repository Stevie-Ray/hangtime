<template>
  <v-layout class="exercise">
    <v-app-bar color="primary" app dark fixed>
      <v-icon @click="goBack">mdi-arrow-left </v-icon>
      <v-avatar v-if="currentWorkout && currentWorkout.user" size="32px">
        <v-img
          v-if="networkOnLine"
          :src="currentWorkout.user.photoURL"
          :alt="currentWorkout.user.displayName"
          aspect-ratio="1"
          class="grey lighten-2"
        />
      </v-avatar>
      <v-toolbar-title v-if="currentExercise">
        <!-- Exercise details -->
        <span v-if="currentExercise.repeat > 1"
          >{{ currentExercise.repeat }}x
        </span>
        <span v-if="currentExercise.pullups > 1"
          >{{ currentExercise.pullups }}
        </span>
        <span
          v-if="currentExercise.left === null || currentExercise.right === null"
          >One-Arm
        </span>
        <span>{{ options[currentExercise.exercise].name }}</span>
        <span v-if="currentExercise.pullups > 0"> Pull-up</span>
        <span v-if="currentExercise.pullups > 1">s</span>

        <div v-if="currentExercise.time" class="subheading">
          {{ count(currentExercise.time) }}
        </div>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn v-if="!editWorkout && userWorkout" icon @click="edit = true">
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
      <v-container>
        <v-row>
          <v-col cols="12">
            <!-- Get exercises item -->
            <v-form ref="form" v-model="valid">
              <exercise-item
                v-if="currentExercise"
                :id="id"
                :index="index"
                :data="currentExercise"
                :edit-workout="editWorkout"
              ></exercise-item>
            </v-form>

            <v-speed-dial bottom right fixed>
              <v-btn
                v-if="editWorkout"
                slot="activator"
                color="secondary"
                dark
                fab
                @click="clickUpdateExercise"
              >
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </v-speed-dial>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-layout>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import ExerciseItem from '@/components/ExerciseItem'
import { getImg, count } from '@/misc/helpers'

export default {
  components: { ExerciseItem },
  props: {
    id: String,
    index: Number,
    userId: String,
    editingWorkout: Boolean,
    isWorkoutDeletionPending: Boolean
  },
  data: () => ({
    edit: null,
    valid: true
  }),
  computed: {
    ...mapState('app', ['networkOnLine']),
    ...mapState('authentication', ['user']),
    ...mapState('workouts', ['options']),
    ...mapGetters('workouts', ['workoutById', 'isExerciseDeletionPending']),
    currentWorkout() {
      return this.workoutById(this.id)
    },
    currentExercise() {
      return this.currentWorkout.exercises[this.index]
    },
    userWorkout() {
      if (!this.currentWorkout.user) return false
      return this.currentWorkout.user.id === this.user.id
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
    ...mapMutations('workouts', ['setTotalTime']),
    deleteExercise() {
      this.deleteUserExercise({
        workout: this.workoutById(this.id),
        index: this.index
      })
      let name = 'workout'
      if (this.id === 'new') {
        name = 'new-workout'
        this.setTotalTime('new')
      }
      this.$router.push({
        name,
        params: { id: this.id, UserId: this.UserId }
      })
    },
    clickUpdateExercise() {
      if (this.$refs.form.validate()) {
        this.triggerUpdateWorkout(this.workoutById(this.id))
        this.edit = false
        this.goBack()
      }
    },
    goBack() {
      let name = 'workout'
      if (this.id === 'new') {
        name = 'new-workout'
        this.setTotalTime('new')
      }
      this.$router.push({
        name,
        params: {
          id: this.id,
          editingWorkout: this.editWorkout,
          userId: this.userId
        }
      })
    }
  },
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
  }
}
</script>

<style lang="scss">
// fix full-width slider overflow
.exercise {
  overflow-y: hidden;
}
</style>
