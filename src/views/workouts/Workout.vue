<template>
  <v-layout class="workout-list">
    <v-app-bar color="primary" app dark fixed>
      <v-icon @click="$router.push({ path: currentTab })"
        >mdi-arrow-left</v-icon
      >
      <v-avatar v-if="currentWorkout" size="32px">
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
      <v-btn
        v-if="currentWorkout && userWorkout && !editWorkout"
        icon
        @click="triggerShareWorkout"
      >
        <v-icon v-if="!currentWorkout.share">mdi-share</v-icon>
        <v-icon v-else>mdi-share-off</v-icon>
      </v-btn>

      <!-- subscribe -->
      <v-btn v-if="currentWorkout && !userWorkout" icon>
        <v-icon
          v-if="isSubscribed"
          @click="
            triggerRemoveWorkoutSubscriber({
              id: id,
              user: user.id,
              userId: userId
            })
          "
        >
          mdi-star
        </v-icon>
        <v-icon
          v-else
          @click="
            triggerAddWorkoutSubscriber({
              id: id,
              user: user.id,
              userId: userId
            })
          "
        >
          mdi-star-outline
        </v-icon>
        <span v-if="currentSubscribers && currentSubscribers.length > 0">
          {{ currentSubscribers.length }}
        </span>
      </v-btn>

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
                  <div v-if="!editWorkout">
                    {{ currentWorkout.description }}
                  </div>

                  <div v-if="!editWorkout">
                    <br />
                    Difficulty:
                    <strong v-if="difficultyById(currentWorkout.level)">
                      {{ difficultyById(currentWorkout.level).name }}
                    </strong>
                  </div>

                  <v-container v-if="editWorkout" grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12>
                        <v-text-field
                          v-model="dataName"
                          placeholder="New workout"
                          counter="24"
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

                      <v-flex xs12>
                        <v-select
                          v-model="dataDifficulty"
                          :items="levels"
                          item-text="name"
                          item-value="value"
                          label="Difficulty"
                        >
                        </v-select>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>

                <v-list-item
                  v-if="!editWorkout && currentWorkout"
                  class="grow my-2"
                >
                  <v-list-item-avatar size="32" style="margin-right: 12px;">
                    <v-img
                      :src="currentWorkout.user.photoURL"
                      :alt="currentWorkout.user.displayName"
                      width="32px"
                      class="grey lighten-2"
                      aspect-ratio="1"
                    />
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>{{
                      currentWorkout.user.displayName
                    }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{
                        ircra
                          .convert('ircra', currentWorkout.user.grade)
                          .to(user.settings.scale)[user.settings.scale]
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="!edit && userWorkout"
                    text
                    primary
                    @click="edit = true"
                    >Edit</v-btn
                  >
                  <v-btn text @click="dialogs.general = false">Close</v-btn>
                  <v-btn
                    v-if="editWorkout"
                    text
                    :disabled="currentWorkout.name === ''"
                    @click="UpdateWorkout"
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

            <!-- Share Dialog -->
            <v-dialog v-if="currentWorkout" v-model="dialogs.share" width="500">
              <v-card>
                <v-card-title class="headline">Share workout</v-card-title>

                <v-card-text>
                  Are you sure you want to share
                  <strong>{{ currentWorkout.name }}</strong> with the community?
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="dialogs.share = false">
                    Cancel
                  </v-btn>
                  <v-btn text @click="clickshareWorkout">
                    Share
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
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import IRCRA from 'ircra'
import ExerciseList from '@/components/ExerciseList'
import { getImg, count } from '@/misc/helpers'

export default {
  components: { ExerciseList },
  props: {
    id: String,
    editingWorkout: Boolean,
    userId: String
  },
  data: () => ({
    ircra: new IRCRA(),
    edit: null,
    dialogs: {
      general: false,
      share: false,
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
    ...mapState('app', ['networkOnLine', 'currentTab']),
    ...mapState('authentication', ['user']),
    ...mapState('workouts', ['levels']),
    ...mapGetters('workouts', ['workoutById', 'difficultyById']),
    currentWorkout() {
      return this.workoutById(this.id)
    },
    currentSubscribers() {
      if (!this.currentWorkout) return
      // eslint-disable-next-line consistent-return
      return this.currentWorkout.subscribers
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
    },
    isSubscribed() {
      if (!this.currentSubscribers) return
      if (!this.currentSubscribers.length > 0) return
      const subscribed = this.currentSubscribers.some(
        subscriber => subscriber === this.user.id
      )
      // eslint-disable-next-line consistent-return
      return subscribed
    },
    dataName: {
      get() {
        return this.currentWorkout.name
      },
      set(value) {
        this.setWorkoutName({ id: this.currentWorkout.id, value })
      }
    },
    dataDescription: {
      get() {
        return this.currentWorkout.description
      },
      set(value) {
        this.setWorkoutDescription({ id: this.currentWorkout.id, value })
      }
    },
    dataDifficulty: {
      get() {
        return this.currentWorkout.level
      },
      set(value) {
        this.setWorkoutDifficulty({ id: this.currentWorkout.id, value })
      }
    }
  },
  mounted() {
    if (this.userWorkout && !this.currentWorkout.exercises.length) {
      this.edit = true
    }
  },
  methods: {
    count,
    getImg,
    ...mapActions('workouts', [
      'deleteUserWorkout',
      'triggerUpdateWorkout',
      'triggerAddExerciseAction',
      'shareWorkout',
      'triggerAddWorkoutSubscriber',
      'triggerRemoveWorkoutSubscriber'
    ]),
    ...mapMutations('workouts', [
      'setWorkoutName',
      'setWorkoutDescription',
      'setWorkoutDifficulty'
    ]),
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
    },
    deleteWorkout(id) {
      this.deleteUserWorkout(id)
      this.$router.push({ name: 'workouts' })
    },
    UpdateWorkout() {
      this.triggerUpdateWorkout(this.currentWorkout)
      this.dialogs.general = false
    },
    triggerShareWorkout() {
      if (!this.currentWorkout.share) {
        this.dialogs.share = true
      } else {
        this.shareWorkout(this.currentWorkout.id)
        this.$router.push({ path: this.currentTab })
      }
    },
    clickshareWorkout() {
      this.shareWorkout(this.currentWorkout.id)
      this.dialogs.share = false
      this.$router.push({ name: 'community' })
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
