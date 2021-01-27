<template>
  <v-dialog v-model="show" width="500">
    <v-card class="modal-wrapper mx-auto">
      <v-card-title primary-title class="pb-0">
        <div>{{ $t("You're almost there") }}!</div>
      </v-card-title>

      <v-card-text>
        <div class="text-subtitle-2 mb-6">
          {{ $t('Name your workout and get going') }}.
        </div>
        <v-form class="workout-action-bar">
          <v-text-field
            v-model="workoutToCreateName"
            :placeholder="$t('New workout')"
            class="input-workout-name required"
            counter="36"
            :rules="[rules.required, rules.length(36)]"
            :label="$t('Name')"
          >
          </v-text-field>

          <v-textarea
            v-model="workoutToCreateDescription"
            counter="140"
            rows="3"
            :rules="[rules.required, rules.length(140)]"
            class="input-workout-description required"
            :placeholder="
              $t('For example indicate when this workout is most beneficial')
            "
            :label="$t('Description')"
          ></v-textarea>

          <v-select
            v-model="workoutToCreateDifficulty"
            :items="levels"
            item-text="name"
            item-value="value"
            class="input-workout-difficulty required"
            :label="
              user
                ? $t('Difficulty for a {grade} climber', {
                    grade: ircra
                      .convert('ircra', user.settings.grade)
                      .to(user.settings.scale)[user.settings.scale]
                  })
                : $t('Difficulty for a {grade} climber', { grade: 'new' })
            "
            :rules="[rules.required]"
          >
            <template #selection="{ item }">
              {{ $t(item.name) }}
            </template>
            <template #item="{ item }">
              {{ $t(item.name) }}
            </template>
          </v-select>

          <v-text-field
            v-model="workoutToCreateVideo"
            placeholder="https://www.youtube.com/watch?v=xxxxxxxx"
            class="input-workout-video"
            :label="$t('Video')"
          >
          </v-text-field>

          <v-checkbox
            v-model="workoutToCreateShare"
            class="checkbox-share"
            hide-details="auto"
            :label="$t('Share with the community')"
          ></v-checkbox>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="button-workout-close"
          text
          color="primary"
          @click="$emit('input', false)"
        >
          {{ $t('Close') }}
        </v-btn>
        <v-btn
          text
          class="button-workout-save"
          :disabled="
            workoutToCreateName === '' ||
            typeof workoutToCreateName === 'undefined' ||
            workoutToCreateDescription === '' ||
            typeof workoutToCreateDescription === 'undefined' ||
            typeof workoutToCreateDifficulty === 'undefined'
          "
          @click="saveWorkout"
        >
          {{ $t('Save') }}
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
    ircra: new IRCRA(),
    rules: {
      length: (len) => (v) =>
        (v || '').length <= len || `A maximum of  ${len} characters is allowed`,
      required: (v) => !!v || 'This field is required'
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
      if (this.user) {
        this.triggerAddWorkoutAction($event)
      }
      this.$emit('input', false)
      this.$router.push({ name: 'workouts' })
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-wrapper {
  .text-h5 {
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
