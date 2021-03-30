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
          {{ $t('Difficulty') }}:
          <strong v-if="difficultyById(currentWorkout.level)">
            {{ $t(difficultyById(currentWorkout.level).name) }}
          </strong>
        </div>

        <v-container v-if="editWorkout" grid-list-md>
          <v-row wrap>
            <v-col cols="12">
              <v-text-field
                v-model="dataName"
                :placeholder="$t('New workout')"
                counter="36"
                class="required"
                :rules="[rules.required, rules.length(36)]"
                :label="$t('Name')"
                required
              >
              </v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-if="editWorkout"
                v-model="dataDescription"
                counter="140"
                rows="3"
                class="required"
                :rules="[rules.required, rules.length(140)]"
                :placeholder="
                  $t(
                    'For example indicate when this workout is most beneficial'
                  )
                "
                :label="$t('Description')"
              >
              </v-textarea>
            </v-col>

            <v-col cols="12">
              <v-select
                v-model="dataDifficulty"
                :items="levels"
                item-text="name"
                item-value="value"
                :rules="[rules.required]"
                class="required"
                :label="
                  user
                    ? $t('Difficulty for a {grade} climber', {
                        grade: ircra
                          .convert('ircra', user.settings.grade)
                          .to(user.settings.scale)[user.settings.scale]
                      })
                    : $t('Difficulty for a {grade} climber', { grade: 'new' })
                "
              >
                <template #selection="{ item }">
                  {{ $t(item.name) }}
                </template>
                <template #item="{ item }">
                  {{ $t(item.name) }}
                </template>
              </v-select>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="dataVideo"
                placeholder="https://www.youtube.com/watch?v=xxxxxxxx"
                class="workout-video-input"
                :label="$t('Video')"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12">
              <v-checkbox
                v-model="dataShare"
                hide-details="auto"
                :label="$t('Share with the community')"
                @change="shareWorkout(currentWorkout.id)"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-list-item v-if="!editWorkout && currentWorkout" class="grow my-2">
        <v-list-item-avatar
          size="32"
          class="grey lighten-2"
          style="margin-right: 12px"
        >
          <v-img
            v-if="currentWorkout.user && currentWorkout.user.photoURL"
            :src="currentWorkout.user.photoURL"
            :alt="currentWorkout.user.displayName"
            width="32px"
          />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-if="currentWorkout.user">{{
            currentWorkout.user.displayName
          }}</v-list-item-title>
          <v-list-item-subtitle v-if="user">
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
          >{{ $t('Share') }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="!edit && userWorkout"
          text
          primary
          @click="$emit('edit', true)"
          >{{ $t('Edit') }}</v-btn
        >
        <v-btn text @click="$emit('input', false)">
          {{ $t('Close') }}
        </v-btn>
        <v-btn
          v-if="editWorkout"
          text
          :disabled="currentWorkout.name === ''"
          @click="UpdateWorkout"
          >{{ $t('Save') }}
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
      length: (len) => (v) =>
        (v || '').length <= len || `A maximum of  ${len} characters is allowed`,
      required: (v) => !!v || 'This field is required'
    }
  }),
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('workouts', ['levels']),
    ...mapGetters('workouts', ['difficultyById']),
    ...mapState('app', ['appTitle']),
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
    dataVideo: {
      get() {
        return this.currentWorkout.video
      },
      set(value) {
        this.setWorkoutVideo({ id: this.currentWorkout.id, value })
      }
    },
    dataDifficulty: {
      get() {
        return this.currentWorkout.level
      },
      set(value) {
        this.setWorkoutDifficulty({ id: this.currentWorkout.id, value })
      }
    },
    dataShare: {
      get() {
        return this.currentWorkout.share
      },
      set(value) {
        this.setWorkoutShare({ id: this.currentWorkout.id, value })
      }
    }
  },
  methods: {
    ...mapActions('workouts', ['triggerUpdateWorkout', 'shareWorkout']),
    ...mapMutations('workouts', [
      'setWorkoutName',
      'setWorkoutDescription',
      'setWorkoutVideo',
      'setWorkoutDifficulty'
    ]),
    UpdateWorkout() {
      this.triggerUpdateWorkout(this.currentWorkout)
      this.$emit('input', false)
    },
    shareExternal() {
      navigator
        .share({
          title: `${this.currentWorkout.name} | ${this.appTitle}`,
          text: `${this.data.name} | ${this.appTitle} - ${this.data.description}`,
          url: document.location.href
        })
        .then(() => {
          // eslint-disable-next-line no-console
          console.log('Thanks for sharing!')
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
