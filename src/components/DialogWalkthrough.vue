<template>
  <v-dialog v-model="show" persistent width="500">
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1">Welcome</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" step="2">
          Hangboard
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 3" step="3">Grading</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="4">Finish</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card flat class="mb-4">
            <v-container fluid>
              <v-row justify="center">
                <v-avatar aspect-ratio="1" class="grey lighten-2" size="164">
                  <img src="@/assets/sloth/hello.svg" alt="sloth hello" />
                </v-avatar>
              </v-row>
            </v-container>

            <v-card-title> Welcome to {{ appTitle }} </v-card-title>
            <v-card-text>
              <span class="text--primary">
                <span
                  >{{ appTitle }} lets you create your own training sequences,
                  do community workouts and track your hangboarding
                  progress.</span
                >
              </span>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="gotoHangboard">
                Select hangboard
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card flat class="mb-4">
            <v-card-title>
              Select you hangboard
            </v-card-title>
            <v-card-text>
              <hangboard-select></hangboard-select>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="e1 = 3">
                Select grade system
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card flat class="mb-4">
            <v-card-title>
              What's your current grade?
            </v-card-title>
            <v-list two-line>
              <v-list-item>
                <v-list-item-content>
                  <v-select
                    v-model="settingsScale"
                    :items="ircra.scale()"
                    item-text="name"
                    item-value="value"
                    label="Grading scale"
                  >
                    <template v-slot:prepend>
                      <v-icon color="primary lighten-1">mdi-chart-gantt</v-icon>
                    </template>
                  </v-select>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="user">
                <v-list-item-content>
                  <v-select
                    v-model="settingsGrade"
                    :items="grades"
                    :item-text="user.settings.scale"
                    item-value="ircra"
                    label="Grade"
                  >
                    <template v-slot:prepend>
                      <v-icon color="primary lighten-1"
                        >mdi-chart-timeline-variant</v-icon
                      >
                    </template>
                  </v-select>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-card-actions>
              <v-btn color="primary" @click="saveWalkthrough">
                Get ready
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="4">
          <v-card flat class="mb-4">
            <v-container fluid>
              <v-row justify="center">
                <v-avatar aspect-ratio="1" class="grey lighten-2" size="164">
                  <img
                    src="@/assets/sloth/upside-down.svg"
                    alt="sloth upside down"
                  />
                </v-avatar>
              </v-row>
            </v-container>
            <v-card-title>And start hangboarding!</v-card-title>
            <v-card-text>
              <span class="text--primary">
                <span
                  >Add your first workout, do a community workout or start
                  recording your progress. It's up to you.
                  <strong
                    >Always make sure that you are warmed up and that you're
                    training at your own level.</strong
                  ></span
                >
              </span>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="finishWalkthrough(true)">
                Add a workout
              </v-btn>
              <v-btn text @click="finishWalkthrough(false)">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import IRCRA from 'ircra'
import HangboardSelect from '@/components/HangboardSelect'

export default {
  components: { HangboardSelect },
  props: {
    value: Boolean
  },
  data: () => ({
    ircra: new IRCRA(),
    e1: 1
  }),
  computed: {
    ...mapState('authentication', ['user', 'hangboardToAdd']),
    ...mapState('companies', ['companies']),
    ...mapState('app', ['appTitle']),
    settingsScale: {
      get() {
        if (!this.user) return
        // eslint-disable-next-line consistent-return
        return this.user.settings.scale
      },
      set(value) {
        this.setScale(value)
      }
    },
    settingsGrade: {
      get() {
        if (!this.user) return
        const ircraGrade = this.ircra
          .convert('ircra', this.user.settings.grade)
          .to(this.user.settings.scale)[this.user.settings.scale]
        // eslint-disable-next-line consistent-return
        return ircraGrade
      },
      set(value) {
        const ircraGrade = this.ircra
          .convert(this.user.settings.scale, value)
          .to('ircra').ircra
        this.setGrade(ircraGrade)
      }
    },
    show: {
      get() {
        return this.value
      },
      set() {}
    },
    grades() {
      if (!this.user) return
      // eslint-disable-next-line consistent-return
      return this.ircra.get(this.user.settings.scale).filter(n => n)
    }
  },
  methods: {
    ...mapMutations('authentication', [
      'setScale',
      'setGrade',
      'setCompany',
      'setWalkthrough'
    ]),
    ...mapActions('authentication', [
      'triggerAddHangboardAction',
      'triggerChangeHangboardAction',
      'triggerUpdateUser'
    ]),
    finishWalkthrough(addWorkout) {
      this.setWalkthrough(true)
      this.triggerUpdateUser()
      this.$emit('input', false)
      if (addWorkout) {
        this.$router.push(`/${this.user.id}/workout/new`)
      }
    },
    gotoHangboard() {
      this.e1 = 2
      this.setCompany(1)
    },
    saveWalkthrough() {
      this.setCompany(0)
      const exists = this.user.settings.hangboards.some(
        el =>
          el.company === this.hangboardToAdd.company &&
          el.hangboard === this.hangboardToAdd.hangboard
      )
      if (!exists) {
        this.triggerAddHangboardAction()
        this.triggerChangeHangboardAction(
          this.user.settings.hangboards.length - 1
        )
      }
      this.e1 = 4
    }
  }
}
</script>
