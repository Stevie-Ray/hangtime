<template>
  <v-container v-if="currentExercise" grid-list-md text-center-xs>
    <v-layout wrap>
      <v-flex xs3>
        <!-- exercise image  -->
        <v-avatar>
          <img
            :alt="options[currentExercise.exercise].name"
            :src="getImg(options[currentExercise.exercise].image)"
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
          :data="currentExercise"
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
          :max="300"
          :min="15"
          step="15"
          ticks
          always-dirty
          thumb-size="48"
          hint="Time before the exercise"
          persistent-hint
          :disabled="!editWorkout"
          prepend-icon="mdi-clock-outline"
          label="Pause"
        >
          <template v-slot:thumb-label="props">
            {{ count(props.value) }}
          </template>
          <template #append>
            <v-label>{{ count(dataPause) }}</v-label>
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
          thumb-size="48"
          prepend-icon="mdi-clock"
          :disabled="!editWorkout"
          hint="Time to do an exercise"
          persistent-hint
          label="Hold"
        >
          <template v-slot:thumb-label="props">
            {{ count(props.value) }}
          </template>
          <template #append>
            <v-label>{{ count(dataHold) }}</v-label>
          </template>
        </v-slider>

        <v-divider
          v-if="options[currentExercise.exercise].configurable"
          class="my-4"
        ></v-divider>

        <!-- pullups  -->
        <v-slider
          v-if="options[currentExercise.exercise].configurable"
          v-model="dataPullups"
          :max="20"
          :min="1"
          step="1"
          ticks
          always-dirty
          thumb-size="48"
          :disabled="!editWorkout"
          prepend-icon="mdi-clock-alert"
          hint="Number of pull ups you have to perform"
          persistent-hint
          label="Pull-ups"
        >
          <template v-slot:thumb-label="props">
            {{ props.value }}x
          </template>
          <template #append>
            <v-label>{{ dataPullups }}x</v-label>
          </template>
        </v-slider>

        <v-divider class="my-4"></v-divider>

        <!-- repeat  -->
        <v-slider
          v-if="editWorkout || currentExercise.repeat > 1"
          v-model="dataRepeat"
          :max="10"
          :min="1"
          step="1"
          ticks
          thumb-size="48"
          :disabled="!editWorkout"
          prepend-icon="mdi-restore-clock"
          hint="Easy way to repeat this exercise"
          persistent-hint
          label="Repeat"
        >
          <template v-slot:thumb-label="props">
            {{ props.value }}x
          </template>
          <template #append>
            <v-label>{{ dataRepeat }}x</v-label>
          </template>
        </v-slider>

        <v-divider v-if="currentExercise.repeat > 1" class="my-4"></v-divider>

        <!-- rest  -->
        <v-slider
          v-if="currentExercise.repeat > 1"
          v-model="dataRest"
          :max="60"
          :min="5"
          step="5"
          ticks
          always-dirty
          thumb-size="48"
          :disabled="!editWorkout"
          prepend-icon="mdi-progress-clock"
          hint="Time to rest between repeating exercises"
          persistent-hint
          label="Rest"
        >
          <template v-slot:thumb-label="props">
            {{ count(props.value) }}
          </template>
          <template #append>
            <v-label>{{ count(dataRest) }}</v-label>
          </template>
        </v-slider>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import Hangboard from '@/components/Hangboard'
import { getImg, count } from '@/misc/helpers'

export default {
  components: { Hangboard },
  props: {
    id: String,
    index: Number,
    editWorkout: Boolean
  },
  computed: {
    ...mapState('app', ['networkOnLine']),
    ...mapState('workouts', ['options']),
    ...mapState('authentication', ['user']),
    ...mapState('companies', ['companies']),
    ...mapGetters('workouts', ['workoutById']),
    currentExercise() {
      return this.workoutById(this.id).exercises[this.index]
    },
    dataExercise: {
      get() {
        return this.currentExercise.exercise
      },
      set(value) {
        this.setExercise({ id: this.id, value: value, index: this.index })
      }
    },
    dataPause: {
      get() {
        return this.currentExercise.pause
      },
      set(value) {
        this.setPause({ id: this.id, value: value, index: this.index })
        this.setTime({ id: this.id, index: this.index })
      }
    },
    dataHold: {
      get() {
        return this.currentExercise.hold
      },
      set(value) {
        this.setHold({ id: this.id, value: value, index: this.index })
        this.setTime({ id: this.id, index: this.index })
      }
    },
    dataPullups: {
      get() {
        return this.currentExercise.pullups
      },
      set(value) {
        this.setPullups({ id: this.id, value: value, index: this.index })
      }
    },
    dataRepeat: {
      get() {
        return this.currentExercise.repeat
      },
      set(value) {
        this.setRepeat({ id: this.id, value: value, index: this.index })
        this.setTime({ id: this.id, index: this.index })
        // reset Rest
        if (value === 1) {
          this.setRest({ id: this.id, value: 0, index: this.index })
        }
      }
    },
    dataRest: {
      get() {
        return this.currentExercise.rest
      },
      set(value) {
        this.setRest({ id: this.id, value: value, index: this.index })
        this.setTime({ id: this.id, index: this.index })
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
      'setTime',
      'setLeftHold',
      'setRightHold'
    ]),
    getImg,
    count
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
