<template>
  <app-container name="Workout List" :back-link="{ currentTab }">
    <template #avatar>
      <v-avatar
        v-if="currentWorkout && user"
        class="grey lighten-2"
        size="32px"
      >
        <v-img
          v-if="networkOnLine && user.photoURL"
          :src="userPhoto"
          :alt="user.displayName"
        />
      </v-avatar>
    </template>
    <template #title>
      <!-- Workout details -->
      <span v-if="currentWorkout">
        <span v-if="currentWorkout.name">{{ currentWorkout.name }}</span>
        <span v-else>{{ $t('New workout') }}</span>
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
        {{ $t('New workout') }}
      </span>
    </template>
    <template #icons>
      <v-btn
        v-if="currentWorkout.exercises && currentWorkout.exercises.length"
        icon
        class="button-workout-save"
        @click="saveExercises"
      >
        <v-icon>{{ mdi.contentSave }}</v-icon>
      </v-btn>
    </template>

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
        class="button-workout-add"
        dark
        fab
        @click="addExercise"
      >
        <v-icon>{{ mdi.playlistPlus }}</v-icon>
      </v-btn>
    </v-speed-dial>
  </app-container>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
import AppContainer from '@/components/molecules/AppContainer/AppContainer'
import IRCRA from 'ircra'
import ExerciseList from '@/components/organisms/ExerciseList/ExerciseList'
import DialogNewWorkoutAdd from '@/components/molecules/DialogNewWorkoutAdd/DialogNewWorkoutAdd'
import { getImg, count } from '@/misc/helpers'
import { mdiPlaylistPlus, mdiContentSave } from '@mdi/js'

export default {
  components: {
    AppContainer,
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
    mdi: {
      playlistPlus: mdiPlaylistPlus,
      contentSave: mdiContentSave
    },
    meta: {
      title: 'New workout'
    },
    rules: {
      length: (len) => (v) =>
        (v || '').length <= len || `A maximum of  ${len} characters is allowed`,
      required: (v) => !!v || 'This field is required'
    }
  }),
  head: {
    title() {
      return {
        inner: this.meta.title
      }
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
    ...mapState('app', ['networkOnLine', 'currentTab']),
    ...mapState('authentication', ['user']),
    ...mapState('workouts', ['exerciseToCreate', 'workoutToCreate']),
    ...mapGetters('workouts', ['workoutById']),
    currentWorkout() {
      return this.workoutById('new')
    },
    userPhoto() {
      if (this.user.pictureURL) {
        return this.user.pictureURL
      }
      return this.user.photoURL
    }
  },
  mounted() {
    if (this.currentWorkout && this.currentWorkout.name) {
      this.meta.title = `${this.currentWorkout.name} | New Workout `
      // eslint-disable-next-line vue/custom-event-name-casing
      this.$emit('updateHead')
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
          photoURL: this.user.photoURL,
          pictureURL: this.user.pictureURL
        }
      })
      this.$router.push({
        name: 'exercise',
        params: {
          id: 'new',
          company: this.user.settings.hangboards[this.user.settings.selected]
            .company,
          hangboard: this.user.settings.hangboards[this.user.settings.selected]
            .hangboard,
          index: this.currentWorkout.exercises.length - 1,
          editingWorkout: true
        }
      })
    },
    saveExercises() {
      this.dialog = true
    }
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
