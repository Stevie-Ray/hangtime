<template>
  <v-container v-if="data" grid-list-md text-center-xs>
    <v-layout row wrap>
      <v-flex xs3>
        <!-- exercise image  -->
        <v-avatar>
          <img
            :alt="options[data.exercise].name"
            :src="getImg(options[data.exercise].image)"
          />
        </v-avatar>
      </v-flex>

      <v-flex xs9>
        <!-- exercise  -->
        <v-select
          v-model="dataExercise"
          :items="options"
          item-text="name"
          item-value="id"
          label="Exercise"
          :disabled="!editWorkout"
          required
        >
          <template v-slot:selection="data">
            <span v-text="data.item.name"></span>
          </template>
          <template v-slot:item="data">
            <v-list-item-avatar>
              <img :alt="data.item.name" :src="getImg(data.item.image)" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ data.item.name }}</v-list-item-title>
            </v-list-item-content>
          </template>
        </v-select>
      </v-flex>

      <v-flex xs12>
        <!-- hangboard -->
        <hangboard
          :data="data"
          :edit-workout="editWorkout"
          @left="setLeftHold({ id: id, value: $event, index: index })"
          @right="setRightHold({ id: id, value: $event, index: index })"
        ></hangboard>
      </v-flex>

      <v-flex xs12>
        <v-divider class="my-4"></v-divider>

        <!-- pause  -->
        <v-slider
          v-model="dataPause"
          :max="60"
          :min="5"
          step="5"
          ticks
          always-dirty
          thumb-label="always"
          hint="Time before the exercise"
          persistent-hint
          :disabled="!editWorkout"
          prepend-icon="mdi-clock-outline"
          label="Pause"
        >
          <template #append>
            <v-label v-if="!editWorkout">{{ dataPause }}s.</v-label>
          </template>
        </v-slider>

        <v-divider class="my-4"></v-divider>

        <!-- hold  -->
        <v-slider
          v-model="dataHold"
          :max="60"
          :min="5"
          step="5"
          ticks
          always-dirty
          thumb-label="always"
          prepend-icon="mdi-clock"
          :disabled="!editWorkout"
          hint="Time to do an exercise"
          persistent-hint
          label="Hold"
        >
          <template #append>
            <v-label v-if="!editWorkout">{{ dataHold }}s.</v-label>
          </template>
        </v-slider>

        <v-divider
          v-if="options[data.exercise].configurable"
          class="my-4"
        ></v-divider>

        <!-- pullups  -->
        <v-slider
          v-if="options[data.exercise].configurable"
          v-model="dataPullups"
          :max="10"
          :min="1"
          step="1"
          ticks
          always-dirty
          thumb-label="always"
          :disabled="!editWorkout"
          prepend-icon="mdi-clock-alert"
          hint="Number of pull ups you have to perform"
          persistent-hint
          label="Pull-ups"
        >
          <template #append>
            <v-label v-if="!editWorkout">{{ dataPullups }}x.</v-label>
          </template>
        </v-slider>

        <v-divider class="my-4"></v-divider>

        <!-- repeat  -->
        <v-slider
          v-if="editWorkout || data.repeat > 1"
          v-model="dataRepeat"
          :max="10"
          :min="1"
          step="1"
          ticks
          thumb-label="always"
          :disabled="!editWorkout"
          prepend-icon="mdi-restore-clock"
          hint="Easy way to repeat this exercise"
          persistent-hint
          label="Repeat"
        >
          <template #append>
            <v-label v-if="!editWorkout">{{ dataRepeat }}x.</v-label>
          </template>
        </v-slider>

        <v-divider v-if="data.repeat > 1" class="my-4"></v-divider>

        <!-- rest  -->
        <v-slider
          v-if="data.repeat > 1"
          v-model="dataRest"
          :max="60"
          :min="5"
          step="5"
          ticks
          always-dirty
          thumb-label="always"
          :disabled="!editWorkout"
          prepend-icon="mdi-progress-clock"
          hint="Time to rest between repeating exercises"
          persistent-hint
          label="Rest"
        >
          <template #append>
            <v-label v-if="!editWorkout">{{ dataRest }}s.</v-label>
          </template>
        </v-slider>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Hangboard from '@/components/Hangboard'
import { getImg } from '@/misc/helpers'

export default {
  components: { Hangboard },
  props: {
    id: String,
    index: Number,
    data: Object,
    editWorkout: Boolean
  },
  computed: {
    ...mapState('app', ['networkOnLine']),
    ...mapState('workouts', ['options']),
    ...mapState('authentication', ['user']),
    ...mapState('companies', ['companies']),
    dataExercise: {
      get() {
        return this.data.exercise
      },
      set(value) {
        this.setExercise({ id: this.id, value: value, index: this.index })
      }
    },
    dataPause: {
      get() {
        return this.data.pause
      },
      set(value) {
        this.setPause({ id: this.id, value: value, index: this.index })
      }
    },
    dataHold: {
      get() {
        return this.data.hold
      },
      set(value) {
        this.setHold({ id: this.id, value: value, index: this.index })
      }
    },
    dataPullups: {
      get() {
        return this.data.pullups
      },
      set(value) {
        this.setPullups({ id: this.id, value: value, index: this.index })
      }
    },
    dataRepeat: {
      get() {
        return this.data.repeat
      },
      set(value) {
        this.setRepeat({ id: this.id, value: value, index: this.index })
      }
    },
    dataRest: {
      get() {
        return this.data.rest
      },
      set(value) {
        this.setRest({ id: this.id, value: value, index: this.index })
      }
    }
  },
  methods: {
    ...mapMutations('workouts', [
      'setExercise',
      'setPause',
      'setHold',
      'setPullups',
      'setRepeat',
      'setRest',
      'setLeftHold',
      'setRightHold'
    ]),
    getImg
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
