<template>
  <v-dialog v-model="show" width="500">
    <v-card class="modal-wrapper mx-auto">
      <v-card-title primary-title class="pb-0">
        <div>You're almost there!</div>
      </v-card-title>

      <v-card-text>
        <div class="subtitle-2 mb-6">Name your workout and get going.</div>
        <v-form class="workout-action-bar">
          <v-text-field
            v-model="workoutToCreateName"
            placeholder="New workout"
            class="workout-name-input"
            counter="36"
            :rules="[rules.required, rules.length(36)]"
            label="Workout name *"
          >
          </v-text-field>

          <v-textarea
            v-model="workoutToCreateDescription"
            counter="140"
            rows="3"
            :rules="[rules.required, rules.length(140)]"
            class="workout-description-input"
            placeholder="For example indicate when this training is suitable"
            label="Workout description *"
          ></v-textarea>

          <v-select
            v-model="workoutToCreateDifficulty"
            :items="levels"
            item-text="name"
            item-value="value"
            :label="
              `Difficulty for a ${
                ircra
                  .convert('ircra', user.settings.grade)
                  .to(user.settings.scale)[user.settings.scale]
              } climber *`
            "
            :rules="[rules.required]"
          >
          </v-select>

          <v-text-field
            v-model="workoutToCreateVideo"
            placeholder="https://www.youtube.com/watch?v=xxxxxxxx"
            class="workout-video-input"
            label="Video (optional)"
          >
          </v-text-field>

          <v-checkbox
            v-model="workoutToCreateShare"
            hide-details="auto"
            label="Share with the community"
          ></v-checkbox>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="$emit('input', false)">
          Close
        </v-btn>
        <v-btn
          text
          class="add-exersice-btn"
          :disabled="
            workoutToCreateName === '' ||
              typeof workoutToCreateName === 'undefined' ||
              workoutToCreateDescription === '' ||
              typeof workoutToCreateDescription === 'undefined' ||
              typeof workoutToCreateDifficulty === 'undefined'
          "
          @click="saveWorkout"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import IRCRA from 'ircra'
import { getImg } from '@/misc/helpers'

export default {
  props: {
    value: Boolean
  },
  data: () => ({
    dialog: true,
    ircra: new IRCRA(),
    rules: {
      length: len => v =>
        (v || '').length <= len || `A maximum of  ${len} characters is allowed`,
      required: v => !!v || 'This field is required'
    }
  }),
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('workouts', [
      'levels',
      'workoutToCreate',
      'workoutCreationPending'
    ]),
    workoutToCreateName: {
      get() {
        return this.workoutToCreate.name
      },
      set(input) {
        this.setWorkoutToCreate({ name: input })
      }
    },
    workoutToCreateDescription: {
      get() {
        return this.workoutToCreate.description
      },
      set(input) {
        this.setWorkoutToCreate({ description: input })
      }
    },
    workoutToCreateVideo: {
      get() {
        return this.workoutToCreate.video
      },
      set(input) {
        this.setWorkoutToCreate({ video: input })
      }
    },
    workoutToCreateDifficulty: {
      get() {
        return this.workoutToCreate.level
      },
      set(input) {
        this.setWorkoutToCreate({ level: input })
      }
    },
    workoutToCreateShare: {
      get() {
        return this.workoutToCreate.share
      },
      set(input) {
        this.setWorkoutToCreate({ share: input })
      }
    },
    show: {
      get() {
        return this.value
      },
      set() {}
    }
  },
  methods: {
    ...mapMutations('workouts', ['setWorkoutToCreate']),
    ...mapActions('workouts', ['triggerAddWorkoutAction']),
    getImg,
    saveWorkout($event) {
      this.triggerAddWorkoutAction($event)
      this.$emit('input', false)
      this.$router.push({ name: 'workouts' })
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-wrapper {
  .headline {
    display: flex;
    /*justify-content: center;*/
    align-items: center;
  }

  .app-logo {
    max-width: 50px;
    margin-right: 10px;
  }

  .footer {
    display: flex;
    /*justify-content: center;*/
    align-items: flex-end;
    /*font-size: 12px;*/

    .apple-navigation-action-img {
      max-width: 15px;
      margin: 0 10px;
    }
  }
}
</style>
