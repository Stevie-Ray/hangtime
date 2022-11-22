<template>
  <app-container
    v-if="currentWorkout"
    name="Run"
    :back-link="{
      name: 'workout',
      params: { id: currentWorkout.id, userId: userId }
    }"
  >
    <template #avatar>
      <v-avatar size="32px" class="grey lighten-2">
        <v-img
          v-if="networkOnLine && currentWorkout.user.photoURL"
          :src="userPhoto"
          :alt="currentWorkout.user.displayName"
        />
      </v-avatar>
    </template>
    <template #title>
      {{ currentWorkout.name }}
      <div class="subheading">{{ currentWorkout.description }}</div>
    </template>

    <v-row
      v-if="currentExercise"
      justify="space-around"
      align="center"
      class="fill-height text-center canvas"
      :class="binding"
    >
      <!-- circle -->
      <div class="Counter">
        <circle-timer
          :current-exercise="currentExercise"
          :current-workout="currentWorkout"
          :start-button="startWorkout"
          :pause-button="pauseWorkout"
          @current-step="editCurrentStep"
        ></circle-timer>
      </div>

      <!-- hangboard -->
      <div class="Hangboard">
        <v-container fluid class="py-0">
          <v-row>
            <v-col cols="12" class="py-0">
              <hangboard :user="user" :data="currentExercise"></hangboard>
              <hand
                v-if="currentExercise.leftHand || currentExercise.rightHand"
                :data="currentExercise"
              ></hand>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- title -->
      <div class="Title">
        <div class="title">
          <workout-item-name :data="currentExercise"></workout-item-name>
        </div>
        <div class="subheading">
          <span
            >{{ $t('Hold for {hold} sec.', { hold: currentExercise.hold }) }}
          </span>
          <span v-if="currentExercise.repeat > 0">
            {{ $t('Rest for {rest} sec.', { rest: currentExercise.rest }) }}
          </span>
        </div>
        <div v-if="currentExercise.notes !== ''" class="text--secondary">
          {{ currentExercise.notes }}
        </div>
      </div>
    </v-row>

    <!-- Show pay wall if device can pay, has user, didn't pay before, had completed 100 minutes -->
    <dialog-subscribe-to-app
      v-if="
        canSubscribePlayBilling &&
        user &&
        !user.subscribed &&
        user.completed &&
        user.completed.time / 60 > (subscribeLimit / 4) * 3
      "
      :limit="subscribeLimit"
      :user="user"
      class="dialog-subscribe-to-app"
    >
    </dialog-subscribe-to-app>

    <v-fab-transition>
      <v-btn
        v-if="startWorkout"
        slot="activator"
        color="secondary"
        fixed
        bottom
        right
        fab
        @click="pauseWorkout = !pauseWorkout"
      >
        <v-icon v-if="!pauseWorkout">{{ mdi.pause }}</v-icon>
        <v-icon v-else>{{ mdi.play }}</v-icon>
      </v-btn>
      <v-btn
        v-else
        slot="activator"
        color="secondary"
        fixed
        bottom
        right
        fab
        @click="startWorkout = !startWorkout"
      >
        <v-icon>{{ mdi.play }}</v-icon>
      </v-btn>
    </v-fab-transition>
  </app-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { mdiPlay, mdiPause } from '@mdi/js'
import companies from '@/misc/hangboards'
import AppContainer from '@/components/molecules/AppContainer/AppContainer'
import Hangboard from '@/components/atoms/Hangboard/Hangboard'
import Hand from '@/components/atoms/Hand/Hand'
import WorkoutItemName from '@/components/atoms/WorkoutItemName/WorkoutItemName'
import CircleTimer from '@/components/molecules/CircleTimer/CircleTimer'
import DialogSubscribeToApp from '@/components/molecules/DialogSubscribeToApp/DialogSubscribeToApp'

export default {
  components: {
    AppContainer,
    WorkoutItemName,
    Hangboard,
    Hand,
    CircleTimer,
    DialogSubscribeToApp
  },
  props: {
    id: String,
    userId: String
  },
  data: () => ({
    companies,
    currentStep: 0,
    initialStart: true,
    startWorkout: false,
    pauseWorkout: false,
    PAYMENT_METHOD: 'https://play.google.com/billing',
    canSubscribe: window.getDigitalGoodsService,
    canSubscribePlayBilling: false,
    subscribeLimit: 30,
    mdi: {
      play: mdiPlay,
      pause: mdiPause
    },
    meta: {
      title: 'Workout'
    }
  }),
  head: {
    title() {
      return {
        // inner: `${this.currentWorkout.name} | Workout `
        inner: this.meta.title
      }
    },
    meta: [
      {
        name: 'description',
        content: '',
        id: 'desc'
      }
    ]
  },
  computed: {
    ...mapState('app', ['networkOnLine']),
    ...mapState('authentication', ['user']),
    ...mapState('workouts', ['grip', 'exercises']),
    ...mapGetters('workouts', ['workoutById']),
    // vuetify grid-system breakpoint binding
    binding() {
      const binding = {}

      if (this.$vuetify.breakpoint.xs) binding.column = true

      return binding
    },
    currentExercise() {
      if (!this.currentWorkout) return
      // eslint-disable-next-line consistent-return
      return this.currentWorkout.exercises[this.currentStep]
    },
    currentWorkout() {
      return this.workoutById(this.id)
    },
    userPhoto() {
      if (this.currentWorkout.user.pictureURL) {
        return this.currentWorkout.user.pictureURL
      }
      return this.currentWorkout.user.photoURL
    }
  },
  mounted() {
    if (this.currentWorkout) {
      this.meta.title = `${this.currentWorkout.name} | Workout `
      // eslint-disable-next-line vue/custom-event-name-casing
      this.$emit('updateHead')
    }
    this.canUsePlayBilling()
  },
  methods: {
    editCurrentStep(step) {
      this.currentStep = step
    },
    async canUsePlayBilling() {
      if (this.canSubscribe === undefined) {
        console.log("window doesn't have getDigitalGoodsService.")
        return
      }
      try {
        const service = await window.getDigitalGoodsService(this.PAYMENT_METHOD)
        console.log(service)
        if (service === null) {
          console.log('Play Billing is not available.')
        } else {
          const details = await service.getDetails(['subscription'])
          console.log(details)
          if (details === null) {
            console.log('Are you running a Play Store build?')
          } else if (details.length === 0) {
            console.log('Are you running a Play Store build? 2')
          } else {
            this.canSubscribePlayBilling = true
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
