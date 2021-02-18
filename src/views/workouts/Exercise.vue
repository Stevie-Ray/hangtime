<template>
  <v-layout class="exercise">
    <v-app-bar color="primary" app dark fixed>
      <v-icon @click="goBack">{{ mdi.arrowLeft }}</v-icon>
      <v-avatar
        v-if="currentWorkout && currentWorkout.user"
        class="grey lighten-2"
        size="32px"
      >
        <v-img
          v-if="networkOnLine && currentWorkout.user.photoURL"
          :src="currentWorkout.user.photoURL"
          :alt="currentWorkout.user.displayName"
        />
      </v-avatar>
      <v-toolbar-title v-if="currentExercise">
        <workout-item-name :data="currentExercise"></workout-item-name>

        <div v-if="currentExercise.time" class="subheading">
          {{ count(currentExercise.time) }}
        </div>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn v-if="!editWorkout && userWorkout" icon @click="edit = true">
        <v-icon>{{ mdi.pencil }}</v-icon>
      </v-btn>
      <v-btn
        v-if="editWorkout"
        icon
        class="copy-btn"
        @click.stop="copyExercise"
      >
        <v-icon>{{ mdi.contentCopy }}</v-icon>
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
              ? mdi.autorenew
              : mdi.delete
          }}
        </v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
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
                class="button-exercise-add"
                color="secondary"
                dark
                fab
                @click="clickUpdateExercise"
              >
                <v-icon>{{ mdi.contentSave }}</v-icon>
              </v-btn>
            </v-speed-dial>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import ExerciseItem from '@/components/organisms/ExerciseItem/ExerciseItem'
import WorkoutItemName from '@/components/atoms/WorkoutItemName/WorkoutItemName'
import { getImg, count } from '@/misc/helpers'
import {
  mdiArrowLeft,
  mdiContentSave,
  mdiContentCopy,
  mdiPencil,
  mdiAutorenew,
  mdiDelete
} from '@mdi/js'

export default {
  components: { WorkoutItemName, ExerciseItem },
  props: {
    id: String,
    index: Number,
    userId: String,
    editingWorkout: Boolean,
    isWorkoutDeletionPending: Boolean
  },
  data: () => ({
    edit: null,
    valid: true,
    mdi: {
      arrowLeft: mdiArrowLeft,
      contentSave: mdiContentSave,
      contentCopy: mdiContentCopy,
      pencil: mdiPencil,
      autorenew: mdiAutorenew,
      delete: mdiDelete
    }
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
    ...mapState('workouts', ['grip']),
    ...mapGetters('workouts', ['workoutById', 'isExerciseDeletionPending']),
    currentWorkout() {
      return this.workoutById(this.id)
    },
    currentExercise() {
      if (!this.currentWorkout) return
      // eslint-disable-next-line consistent-return
      return this.currentWorkout.exercises[this.index]
    },
    userWorkout() {
      if (this.user && this.currentWorkout) {
        if (this.currentWorkout.user) {
          return this.currentWorkout.user.id === this.user.id
        }
      }
      return false
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
    ...mapActions('workouts', [
      'deleteUserExercise',
      'copyUserExercise',
      'triggerUpdateWorkout'
    ]),
    ...mapMutations('workouts', ['setTotalTime']),
    deleteExercise() {
      this.deleteUserExercise({
        workout: this.workoutById(this.id),
        index: this.index
      })
      this.updateExercise()
    },
    copyExercise() {
      this.copyUserExercise({
        workout: this.workoutById(this.id),
        index: this.index
      })
      this.updateExercise()
    },
    updateExercise() {
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
  }
}
</script>

<style lang="scss">
// fix full-width slider overflow
.exercise {
  overflow-y: hidden;
}
</style>
