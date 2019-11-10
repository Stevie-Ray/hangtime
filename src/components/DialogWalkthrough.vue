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

        <v-stepper-step :complete="e1 > 3" step="3">Level</v-stepper-step>

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

            <v-card-title>
              Welcome to HangTime
            </v-card-title>
            <v-card-text>
              <span class="text--primary">
                <span
                  >HangTime lets you create your own training sequences, get and
                  share workouts with our community and track your hangboarding
                  progress.</span
                >
              </span>
            </v-card-text>
          </v-card>

          <v-btn color="primary" @click="e1 = 2">
            Get Started
          </v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card flat class="mb-4">
            <v-card-title>
              Select you hangboard
            </v-card-title>
            <v-card-text>
              <hangboard-select></hangboard-select>
            </v-card-text>
          </v-card>

          <v-btn color="primary" @click="e1 = 3">
            Continue
          </v-btn>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card flat class="mb-4">
            <v-card-title>
              What's your current grade?
            </v-card-title>
            <v-list two-line>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon color="primary lighten-1">mdi-chart-gantt</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-select
                    v-model="settingsScale"
                    :items="ircra.scale()"
                    item-text="name"
                    item-value="value"
                    label="Grading scale"
                  ></v-select>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon color="primary lighten-1"
                    >mdi-chart-timeline-variant</v-icon
                  >
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-select
                    v-model="settingsGrade"
                    :items="grades"
                    :item-text="user.settings.scale"
                    item-value="ircra"
                    label="Grade"
                  ></v-select>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
          <v-btn color="primary" @click="saveWalkthrough">
            Finish
          </v-btn>
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
            <v-card-title>Now start training!</v-card-title>
            <v-card-text>
              <span class="text--primary">
                <span
                  >Add your first workout, do a community workout or start
                  recording your progress. It's up to you!</span
                >
              </span>
            </v-card-text>
          </v-card>

          <v-btn color="primary" @click="finishWalkthrough">
            Add a workout
          </v-btn>
          <v-btn text @click="$emit('input', false)">
            Close
          </v-btn>
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
    e1: 0
  }),
  computed: {
    ...mapState('authentication', ['user', 'hangboardToAdd']),
    ...mapState('companies', ['companies']),
    settingsScale: {
      get() {
        return this.user.settings.scale
      },
      set(value) {
        this.setScale(value)
      }
    },
    settingsGrade: {
      get() {
        const ircraGrade = this.ircra
          .convert('ircra', this.user.settings.grade)
          .to(this.user.settings.scale)[this.user.settings.scale]
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
      return this.ircra.get(this.user.settings.scale)
    }
  },
  methods: {
    ...mapMutations('authentication', [
      'setScale',
      'setGrade',
      'setWalkthrough'
    ]),
    ...mapActions('authentication', [
      'triggerAddHangboardAction',
      'triggerChangeHangboardAction',
      'triggerUpdateUser'
    ]),
    finishWalkthrough() {
      this.$emit('input', false)
      this.$router.push(`/${this.user.id}/workout/new`)
    },
    saveWalkthrough() {
      this.setWalkthrough(true)
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
      } else {
        this.triggerUpdateUser()
      }
      this.e1 = 4
    }
  }
}
</script>
