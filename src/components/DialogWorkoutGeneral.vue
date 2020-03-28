<template>
  <v-dialog v-model="show" width="500">
    <v-card class="mx-auto">
      <v-card-title v-if="!editWorkout" class="title pb-0" primary-title>
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
          <v-row wrap>
            <v-col cols="12">
              <v-text-field
                v-model="dataName"
                placeholder="New workout"
                counter="24"
                :rules="[rules.required, rules.length(24)]"
                label="Workout name *"
                required
              >
              </v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-if="editWorkout"
                v-model="dataDescription"
                counter="140"
                :rules="[rules.required, rules.length(140)]"
                placeholder="For example indicate when this training is suitable"
                label="Workout description *"
              >
              </v-textarea>
            </v-col>

            <v-col cols="12">
              <v-select
                v-model="dataDifficulty"
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
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-checkbox
                label="Share with the community"
                @change="shareWorkout(currentWorkout.id)"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-list-item v-if="!editWorkout && currentWorkout" class="grow my-2">
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
        <v-btn
          v-if="shareAPI && currentWorkout && currentWorkout.share"
          text
          primary
          @click="shareExternal"
          >Share
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="!edit && userWorkout"
          text
          primary
          @click="$emit('edit', true)"
          >Edit</v-btn
        >
        <v-btn text @click="$emit('input', false)">Close</v-btn>
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
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import IRCRA from 'ircra'

export default {
  props: {
    value: Boolean,
    editWorkout: Boolean,
    edit: Boolean,
    currentWorkout: Object,
    userWorkout: Boolean
  },
  data: () => ({
    ircra: new IRCRA(),
    shareAPI: navigator.share,
    rules: {
      length: len => v =>
        (v || '').length <= len || `A maximum of  ${len} characters is allowed`,
      required: v => !!v || 'This field is required'
    }
  }),
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('workouts', ['levels']),
    ...mapGetters('workouts', ['difficultyById']),
    show: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
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
  methods: {
    ...mapActions('workouts', ['triggerUpdateWorkout', 'shareWorkout']),
    ...mapMutations('workouts', [
      'setWorkoutName',
      'setWorkoutDescription',
      'setWorkoutDifficulty'
    ]),
    UpdateWorkout() {
      this.triggerUpdateWorkout(this.currentWorkout)
      this.$emit('input', false)
    },
    shareExternal() {
      navigator
        .share({
          title: `${this.currentWorkout.name} | Hangtime`,
          text: this.currentWorkout.description,
          url: document.location.href
        })
        .then(() => {
          // eslint-disable-next-line no-console
          console.log('Thanks for sharing!')
        })
        .catch(
          // eslint-disable-next-line no-console
          console.error
        )
    }
  }
}
</script>

<style lang="scss" scoped></style>
