<template>
  <v-layout class="workout-list">
    <v-app-bar color="primary" app dark fixed>
      <v-icon @click="$router.push({ path: currentTab })"
        >mdi-arrow-left
      </v-icon>
      <v-avatar v-if="currentWorkout && user" size="32px">
        <v-img
          v-if="networkOnLine"
          :src="user.photoURL"
          :alt="user.displayName"
          aspect-ratio="1"
          class="grey lighten-2"
        />
      </v-avatar>
      <v-toolbar-title>
        <!-- Workout details -->
        <span v-if="currentWorkout">
          <span v-if="currentWorkout.name">{{ currentWorkout.name }}</span>
          <span v-else>New workout</span>
          <div class="subheading">
            <span
              v-if="currentWorkout.exercises && currentWorkout.exercises.length"
              >{{ count(currentWorkout.time) }}</span
            >
            <span v-if="currentWorkout.description">
              - {{ currentWorkout.description }}
            </span>
          </div>
        </span>
        <!-- This will be display while loading workouts -->
        <span v-else>
          New Workout
        </span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-icon
        v-if="currentWorkout.exercises && currentWorkout.exercises.length"
        @click="saveExercises"
        >mdi-content-save</v-icon
      >
    </v-app-bar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex xs12 sm8 md6>
            <exercise-list
              :id="'new'"
              :edit-workout="true"
              class="exercise-list"
            ></exercise-list>

            <dialog-new-workout-add v-model="dialog"></dialog-new-workout-add>

            <v-speed-dial bottom right fixed>
              <v-btn
                slot="activator"
                color="secondary"
                dark
                fab
                @click="addExercise"
              >
                <v-icon>mdi-playlist-plus</v-icon>
              </v-btn>
            </v-speed-dial>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-layout>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
import IRCRA from 'ircra'
import ExerciseList from '@/components/ExerciseList'
import DialogNewWorkoutAdd from '@/components/DialogNewWorkoutAdd'
import { getImg, count } from '@/misc/helpers'

export default {
  components: {
    ExerciseList,
    DialogNewWorkoutAdd
  },
  props: {
    userId: String
  },
  data: () => ({
    ircra: new IRCRA(),
    edit: null,
    dialog: false,
    rules: {
      length: len => v =>
        (v || '').length <= len || `A maximum of  ${len} characters is allowed`,
      required: v => !!v || 'This field is required'
    }
  }),
  computed: {
    ...mapState('app', ['networkOnLine', 'currentTab']),
    ...mapState('authentication', ['user']),
    ...mapState('workouts', ['exerciseToCreate', 'workoutToCreate']),
    ...mapGetters('workouts', ['workoutById']),
    currentWorkout() {
      return this.workoutById('new')
    }
  },
  methods: {
    ...mapMutations('workouts', [
      'setWorkoutToCreate',
      'addExerciseToCreate',
      'setTotalTime'
    ]),
    count,
    getImg,
    addExercise() {
      this.addExerciseToCreate(this.exerciseToCreate)
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
      this.$router.push({
        name: 'exercise',
        params: {
          id: 'new',
          index: this.currentWorkout.exercises.length - 1,
          editingWorkout: true
        }
      })
    },
    saveExercises() {
      this.dialog = true
    }
  },
  head: {
    title: {
      inner: 'New Workout'
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.ghost {
  opacity: 0.5;
  background: #012e40;
}
</style>
