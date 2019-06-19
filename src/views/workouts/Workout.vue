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
        <!-- This will be display while loading the products -->
        <span v-else>
          Fetching workout...
        </span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn v-if="!editWorkout" icon @click="edit = true">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>

      <v-btn v-if="editWorkout" icon @click="edit = false">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>

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
            <v-dialog
              v-if="currentWorkout"
              v-model="dialogs.general"
              width="500"
            >
              <v-card class="mx-auto">
                <v-card-title
                  v-if="!editWorkout"
                  class="title pb-0"
                  primary-title
                >
                  {{ currentWorkout.name }}
                </v-card-title>

                <v-card-text>
                  <span v-if="!editWorkout">
                    {{ currentWorkout.description }}</span
                  >

                  <v-container v-if="editWorkout" grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12>
                        <v-text-field
                          v-model="dataName"
                          placeholder="New workout"
                          :rules="[rules.required, rules.length(24)]"
                          label="Workout name *"
                          required
                        >
                        </v-text-field>
                      </v-flex>

                      <v-flex xs12>
                        <v-textarea
                          v-if="editWorkout"
                          v-model="dataDescription"
                          counter="140"
                          :rules="[rules.length(140)]"
                          placeholder="Give a short description of your workout, for example indicate when this training is suitable"
                          label="Workout description"
                        >
                        </v-textarea>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>

                <v-list-item v-if="!editWorkout" class="grow my-2">
                  <v-list-item-avatar size="32" style="margin-right: 12px;">
                    <v-img
                      :src="user.photoURL"
                      :alt="user.displayName"
                      width="32px"
                      class="grey lighten-2"
                      aspect-ratio="1"
                    />
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>{{
                      user.displayName
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialogs.general = false">Close</v-btn>
                  <v-btn
                    v-if="editWorkout"
                    text
                    :disabled="currentWorkout.name === ''"
                    @click="clickUpdateWorkout"
                    >Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- Delete Dialog -->
            <v-dialog
              v-if="currentWorkout"
              v-model="dialogs.delete"
              width="500"
            >
              <v-card>
                <v-card-title class="headline">Delete workout</v-card-title>

                <v-card-text>
                  Are you sure you want to delete
                  <strong>{{ currentWorkout.name }}</strong> from your workouts?
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="dialogs.delete = false">
                    Cancel
                  </v-btn>
                  <v-btn text @click="deleteWorkout(currentWorkout.id)">
                    Delete
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-speed-dial bottom right fixed>
              <v-btn
                v-if="!editWorkout"
                slot="activator"
                color="secondary"
                dark
                fab
                large
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
                large
                @click="triggerAddExerciseAction(id)"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-speed-dial>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-layout>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import ExerciseList from '@/components/ExerciseList'
import { getImg, count } from '@/misc/helpers'

export default {
  components: { ExerciseList },
  props: {
    id: String,
    editingWorkout: Boolean
  },
  data: () => ({
    edit: null,
    dialogs: {
      general: false,
      delete: false
    },
    rules: {
      length: len => v =>
        (v || '').length <= len || `A maximum of  ${len} characters is allowed`,
      required: v => !!v || 'This field is required'
    }
  }),
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
    },
    editWorkout() {
      if (this.editingWorkout && this.edit === null) {
        return this.editingWorkout
      }
      return this.edit
    },
    dataName: {
      get() {
        return this.currentWorkout.name
      },
      set(value) {
        this.setWorkoutName({ id: this.currentWorkout.id, value: value })
      }
    },
    dataDescription: {
      get() {
        return this.currentWorkout.description
      },
      set(value) {
        this.setWorkoutDescription({ id: this.currentWorkout.id, value: value })
      }
    }
  },
  methods: {
    count,
    getImg,
    ...mapActions('workouts', [
      'deleteUserWorkout',
      'triggerUpdateWorkout',
      'triggerAddExerciseAction'
    ]),
    ...mapMutations('workouts', ['setWorkoutName', 'setWorkoutDescription']),
    deleteWorkout(id) {
      this.deleteUserWorkout(id)
      this.$router.push({ name: 'workouts' })
    },
    clickUpdateWorkout() {
      this.triggerUpdateWorkout(this.currentWorkout)
      this.dialogs.general = false
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
