<template>
  <v-container v-if="currentExercise" grid-list-md text-center-xs>
    <v-row wrap>
      <v-col cols="12">
        <!-- pause  -->
        <v-slider
          v-model="dataPause"
          :max="300"
          :min="2.5"
          step="2.5"
          ticks
          always-dirty
          thumb-size="48"
          hint="Time to prepare / break before the exercise"
          persistent-hint
          :disabled="!editWorkout"
          prepend-icon="mdi-clock-outline"
          label="Pause"
        >
          <template v-slot:thumb-label="props">
            {{ count(Math.round(props.value)) }}
          </template>
          <template #append>
            <v-text-field
              v-if="editWorkout"
              v-model="dataPause"
              class="mt-0 pt-0"
              min="2.5"
              max="300"
              step="2.5"
              hide-details
              single-line
              type="number"
              style="width: 40px"
              :rules="[
                rules.required,
                rules.number,
                rules.min(2.5),
                rules.max(300)
              ]"
            ></v-text-field>
            <v-label v-else>{{ count(Math.round(dataPause)) }}</v-label>
          </template>
        </v-slider>

        <v-divider class="mt-4"></v-divider>
      </v-col>
    </v-row>
    <v-row wrap>
      <v-col cols="3">
        <!-- exercise image  -->
        <v-avatar>
          <img
            :alt="options[currentExercise.exercise].name"
            :src="getImg(options[currentExercise.exercise].image)"
            aspect-ratio="1"
            class="grey lighten-2"
          />
        </v-avatar>
      </v-col>

      <v-col cols="9">
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
      </v-col>
    </v-row>

    <v-row wrap>
      <v-col cols="12">
        <v-divider class="mb-4"></v-divider>

        <!-- hangboard -->
        <hangboard
          :data="currentExercise"
          :edit-workout="editWorkout"
          @left="setLeft($event)"
          @right="setRight($event)"
        ></hangboard>
      </v-col>

      <v-col cols="12">
        <v-divider class="mb-4"></v-divider>

        <!-- hold  -->
        <v-slider
          v-model="dataHold"
          :max="180"
          :min="3"
          step="1"
          always-dirty
          thumb-size="48"
          prepend-icon="mdi-clock"
          :disabled="!editWorkout"
          hint="Time to perform the exercise"
          persistent-hint
          label="Hold"
        >
          <template v-slot:thumb-label="props">
            {{ count(props.value) }}
          </template>
          <template #append>
            <v-text-field
              v-if="editWorkout"
              v-model="dataHold"
              class="mt-0 pt-0"
              min="3"
              max="180"
              step="1"
              hide-details
              single-line
              type="number"
              style="width: 40px"
              :rules="[
                rules.required,
                rules.number,
                rules.min(3),
                rules.max(180)
              ]"
            ></v-text-field>
            <v-label v-else>{{ count(dataHold) }}</v-label>
          </template>
        </v-slider>

        <div v-if="editWorkout">
          <v-divider class="mt-4"></v-divider>

          <v-subheader><strong>Optional</strong></v-subheader>

          <v-divider class="mb-4"></v-divider>
        </div>

        <div v-else>
          <v-divider class="my-4"></v-divider>
        </div>

        <!-- pullups  -->
        <v-slider
          v-if="editWorkout || currentExercise.pullups > 0"
          v-model="dataPullups"
          :max="20"
          :min="0"
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
          <template v-slot:thumb-label="props"> {{ props.value }}x </template>
          <template #append>
            <v-label>{{ dataPullups }}x</v-label>
          </template>
        </v-slider>

        <v-divider
          v-if="editWorkout || currentExercise.pullups > 0"
          class="my-4"
        ></v-divider>

        <!-- repeat  -->
        <v-slider
          v-if="editWorkout || currentExercise.repeat > 0"
          v-model="dataRepeat"
          :max="9"
          :min="0"
          step="1"
          ticks
          thumb-size="48"
          :disabled="!editWorkout"
          prepend-icon="mdi-history"
          hint="Option to repeat current exercise"
          persistent-hint
          label="Repeat"
        >
          <template v-slot:thumb-label="props"
            >{{ props.value + 1 }}x
          </template>
          <template #append>
            <v-label>{{ dataRepeat + 1 }}x</v-label>
          </template>
        </v-slider>

        <v-divider v-if="currentExercise.repeat > 0" class="my-4"></v-divider>

        <!-- rest  -->
        <v-slider
          v-if="currentExercise.repeat > 0"
          v-model="dataRest"
          :max="300"
          :min="2.5"
          step="2.5"
          always-dirty
          thumb-size="48"
          :disabled="!editWorkout"
          prepend-icon="mdi-progress-clock"
          hint="Time to rest between sets"
          persistent-hint
          label="Rest"
        >
          <template v-slot:thumb-label="props">
            {{ count(Math.round(props.value)) }}
          </template>
          <template #append>
            <v-text-field
              v-if="editWorkout"
              v-model="dataRest"
              class="mt-0 pt-0"
              min="2.5"
              max="300"
              step="2.5"
              hide-details
              single-line
              type="number"
              style="width: 40px"
              :rules="[
                rules.required,
                rules.number,
                rules.min(2.5),
                rules.max(300)
              ]"
            ></v-text-field>
            <v-label v-else>{{ count(Math.round(dataRest)) }}</v-label>
          </template>
        </v-slider>
      </v-col>
    </v-row>
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
  data: () => ({
    rules: {
      number: v => !v.isNaN || 'NaN',
      required: v => !!v || 'This field is required',
      min: min => v => v >= min || `A minimun of  ${min} is allowed`,
      max: max => v => v <= max || `A maximum of  ${max} is allowed`
    }
  }),
  computed: {
    ...mapState('app', ['networkOnLine']),
    ...mapState('workouts', ['options']),
    ...mapState('authentication', ['user']),
    ...mapState('companies', ['companies']),
    ...mapGetters('workouts', ['workoutById']),
    // currentWorkout() {
    //   return this.workoutById(this.id)
    // },
    currentExercise() {
      return this.workoutById(this.id).exercises[this.index]
    },
    dataExercise: {
      get() {
        return this.currentExercise.exercise
      },
      set(value) {
        this.setData({
          id: this.id,
          value: { exercise: value },
          // value,
          // key: 'exercise',
          index: this.index
        })
      }
    },
    dataPause: {
      get() {
        return this.currentExercise.pause

        // if (!this.$store.state.workoutToCreate.exercises) return
        // return this.workoutById(this.id).exercises[this.index].pause
        // return this.$store.state.workoutToCreate.exercises[this.index].pause
      },
      set(value) {
        this.setData({
          id: this.id,
          value: { pause: Math.round(value) },
          // value,
          // key: 'pause',
          index: this.index
        })
        this.setTime({ id: this.id, index: Math.round(this.index) })
      }
    },
    dataHold: {
      get() {
        return this.currentExercise.hold
      },
      set(value) {
        this.setData({
          id: this.id,
          value: { hold: value },
          // value, key: 'hold',
          index: this.index
        })
        this.setTime({ id: this.id, index: this.index })
      }
    },
    dataPullups: {
      get() {
        return this.currentExercise.pullups
      },
      set(value) {
        this.setData({
          id: this.id,
          value: { pullups: value },
          // value,
          // key: 'pullups',
          index: this.index
        })
      }
    },
    dataRepeat: {
      get() {
        return this.currentExercise.repeat
      },
      set(value) {
        this.setData({
          id: this.id,
          // value,
          // key: 'repeat',
          value: { repeat: value },
          index: this.index
        })
        this.setTime({ id: this.id, index: this.index })
        // reset Rest
        if (value === 0) {
          this.setData({
            id: this.id,
            // value: 0,
            // key: 'repeat',
            value: { repeat: 0 },
            index: this.index
          })
        }
      }
    },
    dataRest: {
      get() {
        return Math.round(this.currentExercise.rest)
      },
      set(value) {
        this.setData({
          id: this.id,
          value: { rest: Math.round(value) },
          index: this.index
        })
        this.setTime({ id: this.id, index: Math.round(this.index) })
      }
    }
  },
  methods: {
    ...mapMutations('workouts', ['setTime', 'setData']),
    getImg,
    count,
    setLeft(event) {
      if (this.currentExercise.left !== event) {
        this.setData({
          id: this.id,
          value: { left: event },
          // value,
          // key: 'exercise',
          index: this.index
        })
      } else if (this.currentExercise.right !== null) {
        this.setData({
          id: this.id,
          value: { left: null },
          // value,
          // key: 'exercise',
          index: this.index
        })
      }
    },
    setRight(event) {
      if (this.currentExercise.right !== event) {
        this.setData({
          id: this.id,
          value: { right: event },
          // value,
          // key: 'exercise',
          index: this.index
        })
      } else if (this.currentExercise.left !== null) {
        this.setData({
          id: this.id,
          value: { right: null },
          // value,
          // key: 'exercise',
          index: this.index
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
