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
          :prepend-icon="mdi.clockOutline"
          label="Pause"
        >
          <template #thumb-label="props">
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

    <v-row>
      <v-col cols="12">
        <!-- hangboard -->
        <hangboard
          :data="currentExercise"
          :edit-workout="editWorkout"
          @left="setLeft($event)"
          @right="setRight($event)"
        ></hangboard>

        <v-divider class="mb-0"></v-divider>
      </v-col>
    </v-row>

    <v-row wrap>
      <v-col cols="12">
        <v-expansion-panels v-model="openAdvancedTab" accordion flat>
          <!-- exercise -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              <div>
                <v-btn icon>
                  <v-icon>{{ mdi.menu }}</v-icon>
                </v-btn>
                <span>Exercise</span>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row align="center" justify="center">
                <v-col cols="8">
                  <!-- exercise  -->
                  <v-select
                    v-model="dataGrip"
                    :items="grip"
                    item-text="name"
                    item-value="id"
                    label="Hang / Lock off"
                    :disabled="!editWorkout"
                    required
                  >
                    <template #selection="data">
                      <span v-text="data.item.name"></span>
                    </template>
                    <template #item="data">
                      <v-list-item-avatar>
                        <img
                          :alt="data.item.name"
                          :src="getImg(data.item.image)"
                        />
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>{{
                          data.item.name
                        }}</v-list-item-title>
                      </v-list-item-content>
                    </template>
                    <template #append-outer>
                      <v-tooltip bottom>
                        <template #activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            {{ mdi.help }}
                          </v-icon>
                        </template>
                        <span v-if="dataGrip">{{
                          grip[dataGrip].description
                        }}</span>
                      </v-tooltip>
                    </template>
                  </v-select>
                </v-col>

                <v-col cols="4" class="text-center" align-self="center">
                  <!-- exercise image  -->
                  <v-avatar size="72px">
                    <img
                      v-if="currentExercise.grip"
                      :alt="grip[currentExercise.grip].name"
                      :src="getImg(grip[currentExercise.grip].image)"
                      aspect-ratio="1"
                      class="grey lighten-2"
                    />
                    <img
                      v-else
                      :src="getImg(grip[currentExercise.exercise].image)"
                      alt=""
                      aspect-ratio="1"
                      class="grey lighten-2"
                    />
                  </v-avatar>
                </v-col>

                <v-col cols="6">
                  <v-select
                    v-model="dataExercise"
                    label="Arms"
                    :items="exerciseByType('arms')"
                    item-text="name"
                    item-value="id"
                    :disabled="!editWorkout"
                  >
                    <template #append-outer>
                      <v-row>
                        <v-col cols="12" align="center" justify="center">
                          or
                        </v-col>
                      </v-row>
                    </template>
                  </v-select>
                </v-col>

                <v-col cols="6">
                  <v-select
                    v-model="dataExercise"
                    label="Legs"
                    :items="exerciseByType('legs')"
                    item-text="name"
                    item-value="id"
                    :disabled="!editWorkout"
                  >
                    <template v-if="editWorkout" #append-outer>
                      <v-tooltip v-if="dataExercise === 0" bottom>
                        <template #activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            {{ mdi.help }}
                          </v-icon>
                        </template>
                        <span
                          >Select an optional arm or leg exercise to
                          perform.</span
                        >
                      </v-tooltip>
                      <div v-else>
                        <v-icon
                          @click="
                            dataExercise = 0
                            dataPullups = 1
                          "
                        >
                          {{ mdi.undo }}
                        </v-icon>
                      </div>
                    </template>
                  </v-select>
                </v-col>

                <v-col cols="12">
                  <v-slider
                    v-if="editWorkout || currentExercise.pullups > 0"
                    v-model="dataPullups"
                    :max="20"
                    :min="1"
                    step="1"
                    ticks
                    always-dirty
                    thumb-size="48"
                    label="Amount"
                    :prepend-icon="mdi.clockAlert"
                    :disabled="!editWorkout || currentExercise.exercise === 0"
                    hint="Number of pull ups you have to perform"
                  >
                    <template #thumb-label="props">
                      {{ props.value }}x</template
                    >
                    <template #append>
                      <v-label>{{ dataPullups }}x</v-label>
                    </template>
                  </v-slider>
                </v-col>

                <v-col cols="12">
                  <!-- hold  -->
                  <v-slider
                    v-model="dataHold"
                    :max="180"
                    :min="3"
                    step="1"
                    always-dirty
                    thumb-size="48"
                    :prepend-icon="mdi.clock"
                    :disabled="!editWorkout"
                    hint="Time to hold / perform the exercise"
                    persistent-hint
                    label="Time"
                  >
                    <template #thumb-label="props">
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
                </v-col>
              </v-row>

              <v-divider></v-divider>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <!-- repeat  -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              <div>
                <v-btn icon>
                  <v-icon>{{ mdi.menu }}</v-icon>
                </v-btn>
                <span
                  :class="{ 'text--secondary': currentExercise.repeat === 0 }"
                  >Repeat</span
                >
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
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
                :prepend-icon="mdi.history"
                hint="Repeat current exercise (1x = no repeat)"
                persistent-hint
              >
                <template #thumb-label="props"
                  >{{ props.value + 1 }}x
                </template>
                <template #append>
                  <v-label>{{ dataRepeat + 1 }}x</v-label>
                </template>
              </v-slider>

              <!-- rest  -->
              <v-divider
                v-if="currentExercise.repeat > 0"
                class="my-4"
              ></v-divider>

              <v-slider
                v-model="dataRest"
                :max="300"
                :min="2.5"
                step="2.5"
                always-dirty
                thumb-size="48"
                :disabled="!editWorkout || currentExercise.repeat >= 0"
                :prepend-icon="mdi.progressClock"
                hint="Time to rest between repeating the exercise"
                persistent-hint
                label="Rest"
              >
                <template #thumb-label="props">
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
                  <v-label v-else>{{ count(Math.round(dataRest)) }} </v-label>
                </template>
              </v-slider>

              <v-divider class="mt-4"></v-divider>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <!-- hand  -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              <div>
                <v-btn icon>
                  <v-icon>{{ mdi.menu }}</v-icon>
                </v-btn>
                <span
                  :class="{
                    'text--secondary':
                      (currentExercise.leftHand &&
                        currentExercise.rightHand &&
                        !currentExercise.leftHand.length &&
                        !currentExercise.rightHand.length) ||
                      (!currentExercise.leftHand && !currentExercise.rightHand)
                  }"
                  >Fingers</span
                >
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <hand
                class="mb-2"
                :data="currentExercise"
                :edit-workout="editWorkout"
                @left="setLeftHand($event)"
                @right="setRightHand($event)"
              ></hand>

              <v-divider class="my-4"></v-divider>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <!-- weight  -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              <div>
                <v-btn icon>
                  <v-icon>{{ mdi.menu }}</v-icon>
                </v-btn>
                <span
                  :class="{
                    'text--secondary':
                      currentExercise.weight === 0 || !currentExercise.weight
                  }"
                  >Weight</span
                >
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-slider
                v-model="dataWeight"
                :max="50"
                :min="-50"
                step="1"
                ticks
                always-dirty
                thumb-size="48"
                :disabled="!editWorkout"
                :prepend-icon="mdi.weight"
                hint="Add/remove weight using a kettle/dumb-bells or pulley system"
                persistent-hint
              >
                <template #thumb-label="props">
                  {{ weightConverter(props.value, user) }}{{ weightShort }}
                </template>
                <template #append>
                  <v-label
                    >{{ weightConverter(dataWeight, user) }}{{ weightShort }}
                  </v-label>
                </template>
              </v-slider>

              <v-divider class="my-4"></v-divider>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <!-- notes  -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              <div>
                <v-btn icon>
                  <v-icon>{{ mdi.menu }}</v-icon>
                </v-btn>
                <span
                  :class="{
                    'text--secondary':
                      currentExercise.notes === '' || !currentExercise.notes
                  }"
                  >Notes</span
                >
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-textarea
                v-model="dataNotes"
                :rules="[rules.length(140)]"
                counter="140"
                filled
                auto-grow
                rows="2"
                row-height="24"
                :disabled="!editWorkout"
              ></v-textarea>

              <v-divider class="mt-4"></v-divider>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import Hangboard from '@/components/Hangboard'
import Hand from '@/components/Hand'
import { getImg, count, weightConverter } from '@/misc/helpers'
import {
  mdiClockOutline,
  mdiArrowLeft,
  mdiClock,
  mdiClockAlert,
  mdiMenu,
  mdiProgressClock,
  mdiHistory,
  mdiWeight,
  mdiHelpCircleOutline,
  mdiUndo
} from '@mdi/js'

export default {
  components: { Hangboard, Hand },
  props: {
    id: String,
    index: Number,
    editWorkout: Boolean
  },
  data: () => ({
    rules: {
      number: v => !v.isNaN || 'NaN',
      required: v => !!v || 'This field is required',
      length: length => v =>
        (v || '').length <= length || `Max ${length} characters`,
      min: min => v => v >= min || `A minimun of  ${min} is allowed`,
      max: max => v => v <= max || `A maximum of  ${max} is allowed`
    },
    mdi: {
      arrowLeft: mdiArrowLeft,
      clockOutline: mdiClockOutline,
      menu: mdiMenu,
      clock: mdiClock,
      progressClock: mdiProgressClock,
      history: mdiHistory,
      clockAlert: mdiClockAlert,
      weight: mdiWeight,
      help: mdiHelpCircleOutline,
      undo: mdiUndo
    }
  }),
  computed: {
    ...mapState('app', ['networkOnLine']),
    ...mapState('workouts', ['grip', 'exercises']),
    ...mapState('authentication', ['user']),
    ...mapState('companies', ['companies']),
    ...mapGetters('workouts', ['workoutById', 'exerciseByType']),
    ...mapGetters('authentication', ['weightShort']),
    openAdvancedTab: {
      get() {
        if (!this.editWorkout) return 0
        return false
      },
      set() {
        return 0
      }
    },
    currentExercise() {
      if (!this.workoutById(this.id)) return
      // eslint-disable-next-line consistent-return
      return this.workoutById(this.id).exercises[this.index]
    },
    dataGrip: {
      get() {
        if (!this.currentExercise.grip) {
          return this.currentExercise.exercise
        }
        return this.currentExercise.grip
      },
      set(value) {
        this.setData({
          id: this.id,
          value: { grip: value },
          // value,
          // key: 'exercise',
          index: this.index
        })
      }
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
    },
    dataWeight: {
      get() {
        if (this.currentExercise.weight) {
          return this.currentExercise.weight
        }
        return 0
      },
      set(value) {
        this.setData({
          id: this.id,
          value: { weight: Math.round(value) },
          index: this.index
        })
      }
    },
    dataNotes: {
      get() {
        return this.currentExercise.notes
      },
      set(value) {
        this.setData({
          id: this.id,
          value: { notes: value },
          index: this.index
        })
      }
    }
  },
  methods: {
    ...mapMutations('workouts', ['setTime', 'setData']),
    getImg,
    count,
    weightConverter,
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
    },
    setRightHand(event) {
      if (this.currentExercise.rightHand !== event) {
        this.setData({
          id: this.id,
          value: { rightHand: event },
          index: this.index
        })
      }
    },
    setLeftHand(event) {
      if (this.currentExercise.leftHand !== event) {
        this.setData({
          id: this.id,
          value: { leftHand: event },
          index: this.index
        })
      }
    }
  }
}
</script>

<style lang="scss">
.exercise {
  .v-expansion-panel-header,
  .v-expansion-panel-content__wrap {
    padding-right: 0;
    padding-left: 0;
  }
}
</style>
