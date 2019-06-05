<template>
  <v-layout row class="help">
    <v-app-bar color="primary" app fixed dark>
      <v-icon @click="$router.push({ name: 'settings' })"
        >mdi-arrow-left</v-icon
      >
      <v-toolbar-title>
        Help
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex xs12 sm8 md6>
            <v-subheader>Exercises</v-subheader>

            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>Dead Hang</v-expansion-panel-header>
                <v-expansion-panel-content>
                  This is the fundamental exercise for developing contact
                  strength. You should master the dead hang on any particular
                  hold before attempting any other exercise on that hold. Never
                  lock you elbows completely. Always keep a slight bend to
                  prevent injury.
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header
                  >Bent Arm Hang</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  A variation of the dead hang which will begin to develop your
                  ability to pull through and lock-off. This can be done at any
                  angle, and should be varied as much as possible. Pull yourself
                  up to the designated angle and hold a static contraction for
                  the designated amount of time. Be careful of doing maximal
                  contractions at full lock-off, as they can be as injurious as
                  fully locked-out elbows.
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header
                  >Offset Hangs</v-expansion-panel-header
                >

                <v-expansion-panel-content>
                  Begin as with the bent arm hang. Shift your weight all the way
                  to one side and hold a contraction. Shift your weight
                  laterally, all the way to the other side, without lowering
                  your body and hold an equal contraction. Repeat. Vary the
                  angle of your lock-off, the duration of your lock-off, and the
                  number of repetitions.
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-content>
                  <v-expansion-panel-header>Pull-ups</v-expansion-panel-header>

                  Try to be as smooth as possible. Don't jerk, kip, swing, or
                  otherwise cheat. Keep your lower body quiet. Don't lock your
                  elbows completely at the bottom. Focus on maintaining perfect
                  form, and don't worry about the number of repetitions.
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-content>
                  <v-expansion-panel-header
                    >Offset Pull-ups</v-expansion-panel-header
                  >

                  The first step to one-arm pull-ups. Position yourself with
                  your weight centered under one arm, as if to do a one-arm
                  pull-up. Choose a lower hold with the other hand and give
                  yourself just enough assistance to complete the exercise.
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header
                  >One-arm Pull-ups</v-expansion-panel-header
                >

                <v-expansion-panel-content>
                  Now you really have some power! Follow the same guidelines as
                  for pull-ups but pronate your arm more. If you're getting
                  close, but can't quite do one-arms, do an offset pull-up, but
                  perform the negative contraction (lower yourself) as a pure
                  one-arm. The potential for injury is very high, so it is
                  absolutely critical to be smooth. Don't bounce!
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>L-Hang</v-expansion-panel-header>

                <v-expansion-panel-content>
                  The emphasis here is on core strength. Choose a hold that
                  you're fairly comfortable on. You can dead hang or bent arm
                  hang. Pull your legs up from the hips, keeping your knees
                  straight and your toes pointed. Hold a static contraction with
                  your legs at 90 degrees to your torso or do slow repetitions
                  raising your legs as far as you can but only lowering to about
                  45 below horizontal. If you lower you legs all the way, it
                  will take the tension off your abs and constitute a rest. The
                  idea is to keep your abdominal muscles contracted the entire
                  time. If straight leg raises are too difficult, bend your
                  knees at a 90 degree angle.
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>Front Lever</v-expansion-panel-header>

                <v-expansion-panel-content>
                  Work up to these by performing them first with both legs bent
                  at the knees, and then with one leg straight and one bent. If
                  you can do a good front lever, try it with one arm.
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <!-- <v-subheader>Contact us</v-subheader>-->

            <v-list>
              <v-list-item href="mailto:mail@stevie-ray.nl">
                <v-list-item-title>Question? Need help?</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Terms and Privacy Policy</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-layout>
</template>

<script>
export default {
  data: () => ({}),
  computed: {},
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
