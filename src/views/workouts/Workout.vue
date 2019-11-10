<template>
  <v-layout class="workout-list">
    <v-app-bar color="primary" app dark fixed>
      <v-icon @click="$router.push({ path: currentTab })"
        >mdi-arrow-left</v-icon
      >
      <v-avatar
        v-if="currentWorkout"
        size="32px"
        @click.stop="dialogs.user = true"
      >
        <v-img
          v-if="networkOnLine"
          :src="currentWorkout.user.photoURL"
          :alt="currentWorkout.user.displayName"
          aspect-ratio="1"
          class="grey lighten-2"
        />
      </v-avatar>
      <v-toolbar-title @click="dialogs.general = true">
        <!-- Workout details -->
        <span v-if="currentWorkout">
          <span v-if="currentWorkout.name">{{ currentWorkout.name }}</span>
          <div class="subheading">
            <span>{{ count(currentWorkout.time) }}</span>
            <span v-if="currentWorkout.description">
              - {{ currentWorkout.description }}
            </span>
          </div>
        </span>
        <!-- This will be display while loading workouts -->
        <span v-else>
          Fetching workout...
        </span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- share -->
      <workout-share
        v-if="currentWorkout && userWorkout && !editWorkout"
        :current-workout="currentWorkout"
        :user-workout="userWorkout"
      ></workout-share>

      <!-- subscribe -->
      <workout-subscribe
        v-if="currentWorkout && !userWorkout"
        :id="id"
        :current-workout="currentWorkout"
        :user-id="userId"
      ></workout-subscribe>

      <!-- edit -->
      <v-btn v-if="!editWorkout && userWorkout" icon @click="edit = true">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>

      <!-- save -->
      <v-btn v-if="editWorkout" icon @click="edit = false">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>

      <!-- menu -->
      <v-menu v-if="editWorkout" bottom left min-width="200">
        <template v-slot:activator="{ on }">
          <v-btn dark icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click.stop="dialogs.general = true">
            <v-list-item-title>Rename Workout</v-list-item-title>
          </v-list-item>
          <v-list-item @click="dialogs.delete = true">
            <v-list-item-title>Delete workout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex xs12 sm8 md6>
            <!-- Get exercises list -->
            <exercise-list
              :id="id"
              :edit-workout="editWorkout"
              class="exercise-list"
            ></exercise-list>

            <!-- General Dialog -->
            <dialog-workout-general
              v-if="currentWorkout"
              v-model="dialogs.general"
              :edit="edit"
              :edit-workout="editWorkout"
              :current-workout="currentWorkout"
              :user-workout="userWorkout"
            ></dialog-workout-general>

            <!-- Delete Dialog -->
            <dialog-workout-delete
              v-if="currentWorkout"
              v-model="dialogs.delete"
              :current-workout="currentWorkout"
            ></dialog-workout-delete>

            <dialog-user-image
              v-if="currentWorkout"
              v-model="dialogs.user"
              :data="currentWorkout"
            ></dialog-user-image>

            <v-speed-dial bottom right fixed>
              <v-btn fab dark small color="indigo">
                <v-icon>mdi-plus</v-icon>
              </v-btn>

              <v-btn
                v-if="!editWorkout"
                slot="activator"
                color="secondary"
                dark
                fab
                :to="{ name: 'run', params: { data: currentWorkout } }"
              >
                <v-icon>mdi-play</v-icon>
              </v-btn>
              <v-btn
                v-if="editWorkout"
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
import { mapGetters, mapState, mapActions } from 'vuex'
import ExerciseList from '@/components/ExerciseList'
import WorkoutSubscribe from '@/components/WorkoutSubscribe'
import WorkoutShare from '@/components/WorkoutShare'
import DialogWorkoutGeneral from '@/components/DialogWorkoutGeneral'
import DialogWorkoutDelete from '@/components/DialogWorkoutDelete'
import DialogUserImage from '@/components/DialogUserImage'
import { count } from '@/misc/helpers'

export default {
  components: {
    ExerciseList,
    WorkoutSubscribe,
    WorkoutShare,
    DialogWorkoutGeneral,
    DialogWorkoutDelete,
    DialogUserImage
  },
  props: {
    id: String,
    editingWorkout: Boolean,
    userId: String
  },
  data: () => ({
    edit: null,
    dialogs: {
      general: false,
      delete: false,
      user: false
    }
  }),
  computed: {
    ...mapState('app', ['networkOnLine', 'currentTab']),
    ...mapState('authentication', ['user']),
    ...mapGetters('workouts', ['workoutById']),
    currentWorkout() {
      return this.workoutById(this.id)
    },
    editWorkout() {
      if (this.editingWorkout && this.edit === null) {
        return this.editingWorkout
      }
      return this.edit
    },
    userWorkout() {
      if (!this.currentWorkout) return
      // eslint-disable-next-line consistent-return
      return this.currentWorkout.user.id === this.user.id
    }
  },
  mounted() {
    if (this.userWorkout && !this.currentWorkout.exercises.length) {
      this.edit = true
    }
  },
  methods: {
    count,
    ...mapActions('workouts', ['triggerAddExerciseAction']),
    addExercise() {
      this.triggerAddExerciseAction(this.id)
      this.$router.push({
        name: 'exercise',
        params: {
          id: this.id,
          index: this.currentWorkout.exercises.length - 1,
          editingWorkout: true
        }
      })
    }
  },
  head: {
    title: {
      inner: 'Workout'
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
