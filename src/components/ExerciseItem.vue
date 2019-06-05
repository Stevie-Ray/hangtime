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
          required
        >
          <template v-slot:selection="data">
            <span v-text="data.item.name"></span>
          </template>
          <template v-slot:item="data">
            <v-list-item-avatar tile>
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
        <div
          class="hangboard"
          :class="
            companies[user.settings.hangboards[user.settings.selected].company]
              .hangboards[
              user.settings.hangboards[user.settings.selected].hangboard
            ].name
          "
        >
          <div class="leftside">
            <img
              :class="
                companies[
                  user.settings.hangboards[user.settings.selected].company
                ].hangboards[
                  user.settings.hangboards[user.settings.selected].hangboard
                ].holds[data.left].id
              "
              :src="
                getImg(
                  companies[
                    user.settings.hangboards[user.settings.selected].company
                  ].hangboards[
                    user.settings.hangboards[user.settings.selected].hangboard
                  ].image
                )
              "
            />
          </div>
          <div class="rightside">
            <img
              :class="
                companies[
                  user.settings.hangboards[user.settings.selected].company
                ].hangboards[
                  user.settings.hangboards[user.settings.selected].hangboard
                ].holds[data.right].id
              "
              :src="
                getImg(
                  companies[
                    user.settings.hangboards[user.settings.selected].company
                  ].hangboards[
                    user.settings.hangboards[user.settings.selected].hangboard
                  ].image
                )
              "
            />
          </div>
        </div>
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
          prepend-icon="mdi-clock-outline"
          label="Pause"
        >
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
          hint="Time to do an exercise"
          persistent-hint
          label="Hold"
        >
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
          prepend-icon="mdi-clock-alert"
          hint="Number of pull ups you have to perform"
          persistent-hint
          label="Pull-ups"
        >
        </v-slider>

        <v-divider class="my-4"></v-divider>

        <!-- repeat  -->
        <v-slider
          v-model="dataRepeat"
          :max="10"
          :min="1"
          step="1"
          ticks
          thumb-label="always"
          prepend-icon="mdi-restore-clock"
          hint="Easy way to repeat this exercise"
          persistent-hint
          label="Repeat"
        >
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
          prepend-icon="mdi-progress-clock"
          hint="Time to rest between repeating exercises"
          persistent-hint
          label="Rest"
        >
        </v-slider>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { getImg } from '@/misc/helpers'

export default {
  components: {},
  props: {
    id: String,
    data: Object
  },
  computed: {
    ...mapState('app', ['networkOnLine']),
    ...mapState('exercises', ['options']),
    ...mapState('authentication', ['user']),
    ...mapState('companies', ['companies']),
    dataExercise: {
      get() {
        return this.data.exercise
      },
      set(value) {
        this.setExercise({ id: this.data.id, value: value })
      }
    },
    dataPause: {
      get() {
        return this.data.pause
      },
      set(value) {
        this.setPause({ id: this.data.id, value: value })
      }
    },
    dataHold: {
      get() {
        return this.data.hold
      },
      set(value) {
        this.setHold({ id: this.data.id, value: value })
      }
    },
    dataPullups: {
      get() {
        return this.data.pullups
      },
      set(value) {
        this.setPullups({ id: this.data.id, value: value })
      }
    },
    dataRepeat: {
      get() {
        return this.data.repeat
      },
      set(value) {
        this.setRepeat({ id: this.data.id, value: value })
      }
    },
    dataRest: {
      get() {
        return this.data.rest
      },
      set(value) {
        this.setRest({ id: this.data.id, value: value })
      }
    }
  },
  created() {
    // TODO: remove ugly code
    this.$store.dispatch('exercises/getWorkoutExercises', this.id)
  },
  methods: {
    ...mapMutations('exercises', [
      'setExercise',
      'setPause',
      'setHold',
      'setPullups',
      'setRepeat',
      'setRest'
    ]),
    getImg
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
