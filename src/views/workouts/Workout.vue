<template>
  <v-layout class="workout-list">
    <v-app-bar color="primary" app dark fixed>
      <v-icon @click="$router.push({ path: currentTab })">{{
        mdi.arrowLeft
      }}</v-icon>
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
          {{ $t('Fetching workout...') }}
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
        <v-icon>{{ mdi.pencil }}</v-icon>
      </v-btn>

      <!-- save -->
      <v-btn v-if="editWorkout" icon @click="edit = false">
        <v-icon>{{ mdi.contentSave }}</v-icon>
      </v-btn>

      <!-- menu -->
      <v-menu v-if="editWorkout" bottom left min-width="200">
        <template #activator="{ on }">
          <v-btn dark icon v-on="on">
            <v-icon>{{ mdi.dotsVertical }}</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click.stop="dialogs.general = true">
            <v-list-item-title>{{ $t('Rename Workout') }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="dialogs.delete = true">
            <v-list-item-title>{{ $t('Delete Workout') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-responsive
              v-if="
                currentWorkout &&
                  currentWorkout.video &&
                  parseVideo(currentWorkout.video)
              "
              :aspect-ratio="16 / 9"
            >
              <iframe
                width="100%"
                height="100%"
                :src="parseVideo(currentWorkout.video)"
                frameborder="0"
              ></iframe>
            </v-responsive>

            <!-- Get exercises list -->
            <exercise-list
              :id="id"
              :edit-workout="editWorkout"
              class="exercise-list"
            ></exercise-list>

            <!--  Check if user has current hangboard-->
            <v-dialog v-model="hasHangboard" persistent max-width="500">
              <v-card>
                <v-card-title class="text-h5">
                  {{ $t('You are not using this hangboard') }}
                </v-card-title>

                <v-card-text>
                  {{
                    $t(
                      "To view this workout we'll add this hangboard to your hangboards"
                    )
                  }}
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn color="green darken-1" text @click="addHangboard">
                    {{ $t('Ok') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- General Dialog -->
            <dialog-workout-general
              v-if="currentWorkout"
              v-model="dialogs.general"
              :edit="edit"
              :edit-workout="editWorkout"
              :current-workout="currentWorkout"
              :user-workout="userWorkout"
              @edit="edit = true"
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
              :data="currentWorkout.user"
            ></dialog-user-image>

            <v-speed-dial bottom right fixed>
              <v-btn
                v-if="!editWorkout"
                slot="activator"
                color="secondary"
                dark
                fab
                :to="{ name: 'run', params: { data: currentWorkout } }"
              >
                <v-icon>{{ mdi.play }}</v-icon>
              </v-btn>
              <v-btn
                v-if="editWorkout"
                slot="activator"
                color="secondary"
                dark
                fab
                @click="addExercise"
              >
                <v-icon>{{ mdi.playlistPlus }}</v-icon>
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
import ExerciseList from '@/components/ExerciseList'
import WorkoutSubscribe from '@/components/WorkoutSubscribe'
import WorkoutShare from '@/components/WorkoutShare'
import DialogWorkoutGeneral from '@/components/DialogWorkoutGeneral'
import DialogWorkoutDelete from '@/components/DialogWorkoutDelete'
import DialogUserImage from '@/components/DialogUserImage'
import { count } from '@/misc/helpers'
import urlParser from 'js-video-url-parser'
import {
  mdiArrowLeft,
  mdiDotsVertical,
  mdiContentSave,
  mdiPlay,
  mdiPlaylistPlus,
  mdiPencil
} from '@mdi/js'

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
    company: Number,
    hangboard: Number,
    editingWorkout: Boolean,
    userId: String
  },
  data: () => ({
    edit: null,
    meta: {
      title: 'Workout'
    },
    dialogs: {
      general: false,
      delete: false,
      user: false
    },
    mdi: {
      arrowLeft: mdiArrowLeft,
      dotsVertical: mdiDotsVertical,
      contentSave: mdiContentSave,
      pencil: mdiPencil,
      play: mdiPlay,
      playlistPlus: mdiPlaylistPlus
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
    },
    hasHangboard() {
      const exists = this.user.settings.hangboards.some(
        el => el.company === this.company && el.hangboard === this.hangboard
      )
      if (!exists) {
        // show dialog to add new hangboard
        return true
      }
      // if hangboard exists but is not selected, switch hangboard
      if (
        this.company !==
          this.user.settings.hangboards[this.user.settings.selected].company ||
        this.hangboard !==
          this.user.settings.hangboards[this.user.settings.selected].hangboard
      ) {
        const index = this.user.settings.hangboards.findIndex(
          list =>
            list.company === this.company && list.hangboard === this.hangboard
        )
        this.setSelected(index)
        this.triggerUpdateUser()
        // get community workouts
        this.triggerSwitchHangboard()
      }
      // do nothing
      return false
    }
  },
  mounted() {
    if (this.userWorkout && !this.currentWorkout.exercises.length) {
      this.edit = true
    }
    if (this.currentWorkout) {
      this.meta.title = `${this.currentWorkout.name} | Workout `
      // eslint-disable-next-line vue/custom-event-name-casing
      this.$emit('updateHead')
    }
  },
  methods: {
    count,
    ...mapActions('workouts', ['triggerAddExerciseAction']),
    ...mapActions('authentication', [
      'triggerAddHangboardAction',
      'triggerUpdateUser',
      'triggerSwitchHangboard'
    ]),
    ...mapMutations('authentication', [
      'setCompany',
      'setHangboard',
      'setSelected'
    ]),
    addExercise() {
      this.triggerAddExerciseAction(this.id)
      this.$router.push({
        name: 'exercise',
        params: {
          id: this.id,
          company: this.currentWorkout.company,
          hangboard: this.currentWorkout.hangboard,
          index: this.currentWorkout.exercises.length - 1,
          editingWorkout: true
        }
      })
    },
    /**
     * If a climber goes to a workout with a hangboard he is not using
     * this function will add the hangboard for the user and selects it.
     */
    addHangboard() {
      this.setCompany(this.company)
      this.setHangboard(this.hangboard)
      this.triggerAddHangboardAction()
      this.setSelected(this.user.settings.hangboards.length - 1)
      this.triggerUpdateUser()
      this.triggerSwitchHangboard()
    },
    parseVideo(video) {
      const videoData = urlParser.parse(video)
      if (!videoData) return
      const videoEmbed = urlParser.create({
        videoInfo: { ...videoData },
        format: 'embed'
      })

      // eslint-disable-next-line consistent-return
      return videoEmbed
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
