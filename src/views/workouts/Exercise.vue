<template>
  <v-layout row class="exercise">
    <v-app-bar color="primary" app dark fixed>
      <v-icon @click="$router.push({ name: 'workout', params: { id: id } })"
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

      <v-btn
        v-if="currentExercise"
        icon
        class="delete-btn"
        @click="
          deleteUserExercise({ workout: id, exerciseId: currentExercise.id })
        "
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
            <exercise-item :id="id" :data="currentExercise"> </exercise-item>

            <v-speed-dial bottom right fixed>
              <v-btn
                slot="activator"
                color="secondary"
                dark
                fab
                large
                @click="
                  triggerUpdateExercise({
                    workout: id,
                    exercise: currentExercise
                  })
                "
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
import ExerciseItem from '@/components/ExerciseItem'
import { mapGetters, mapState, mapActions } from 'vuex'
import { getImg, count } from '@/misc/helpers'

export default {
  components: { ExerciseItem },
  props: {
    id: String,
    exercise: String,
    isWorkoutDeletionPending: Boolean
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
  },
  computed: {
    ...mapState('app', ['networkOnLine']),
    ...mapState('authentication', ['user']),
    ...mapState('exercises', ['options']),
    ...mapGetters('exercises', ['exerciseById', 'isExerciseDeletionPending']),
    currentExercise() {
      return this.exerciseById(this.exercise)
    }
  },
  methods: {
    count,
    getImg,
    ...mapActions('exercises', ['deleteUserExercise', 'triggerUpdateExercise'])
  }
}
</script>

<style lang="scss">
// fix full-width slider overflow
.exercise {
  overflow-y: hidden;
}
</style>
