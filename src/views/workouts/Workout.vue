<template>
  <v-layout row class="workout">
    <v-app-bar color="primary" app dark fixed>
      <v-icon @click="$router.push('/')">mdi-arrow-left</v-icon>
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
        <!-- This will be display while loading the products -->
        <span v-else>
          Fetching workout...
        </span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="triggerAddExerciseAction(id)">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex xs12 sm8 md6>
            <!-- Get exercises list -->
            <exercise-list :id="id" class="exercise-list"></exercise-list>

            <v-speed-dial bottom right fixed>
              <v-btn
                slot="activator"
                color="secondary"
                dark
                fab
                large
                :to="{ name: 'run', params: { data: currentWorkout } }"
              >
                <v-icon>mdi-play</v-icon>
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
import { getImg, count } from '@/misc/helpers'

export default {
  components: { ExerciseList },
  props: {
    id: String
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
  },
  computed: {
    ...mapState('app', ['networkOnLine']),
    ...mapState('authentication', ['user']),
    ...mapGetters('workouts', ['workoutById']),
    currentWorkout() {
      return this.workoutById(this.id)
    }
  },
  methods: {
    count,
    getImg,
    ...mapActions('exercises', ['triggerAddExerciseAction'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.ghost {
  opacity: 0.5;
  background: #4e7352;
}

.v-toolbar {
  &__title {
    line-height: 1.25;
    margin-left: 13px;

    .subheading {
      font-size: 12px !important;
    }
  }

  &__content > .v-icon {
    margin-left: -4px;
  }
}
</style>
