<template>
  <v-layout class="run">
    <v-app-bar color="primary" app dark fixed>
      <v-icon
        v-if="user"
        @click="
          $router.push({
            name: 'progress-list',
            params: { data, index, userId: user.id }
          })
        "
        >mdi-arrow-left</v-icon
      >
      <v-avatar v-if="currentType" size="32px">
        <v-img
          :src="getImg(currentType.image)"
          :alt="currentType.name"
          aspect-ratio="1"
          class="grey lighten-2"
        />
      </v-avatar>
      <v-toolbar-title v-if="currentType">
        <span>Max </span>
        <span
          v-if="
            currentStats[index].left === null ||
              currentStats[index].right === null
          "
        >
          One-Arm
        </span>
        <span>{{ currentType.name }}</span>
        <span v-if="configurable"> Pull-up</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content v-if="currentType">
      <v-container class="fill-height">
        <v-row class="fill-height">
          <v-col cols="12">
            <v-row
              justify="space-around"
              align="center"
              class="fill-height text-center canvas"
              :class="binding"
            >
              <!-- circle -->
              <div class="Counter">
                <v-progress-circular
                  :rotate="270"
                  :size="300"
                  :width="5"
                  :value="100"
                >
                  <div class="d-flex align-center justify-center flex-column">
                    <v-avatar
                      size="80"
                      aspect-ratio="1"
                      class="grey lighten-2 mb-3"
                    >
                      <img
                        :alt="currentType.name"
                        :src="getImg(currentType.image)"
                      />
                    </v-avatar>

                    <div class="subtitle font-weight-bold text-uppercase">
                      Max
                      <span
                        v-if="
                          currentStats[index].left === null ||
                            currentStats[index].right === null
                        "
                      >
                        One-Arm
                      </span>
                      <span>{{ currentType.name }}</span>
                      <span v-if="configurable"> Pull-up</span>
                    </div>

                    <div id="timer" class="display-3 font-weight-bold">
                      {{ count(totalTime) }}
                    </div>

                    <div
                      v-if="
                        currentStats[index] &&
                          currentStats[index].recordings.length > 0
                      "
                      class="text-uppercase font-weight-bold"
                    >
                      <!--                      Best:-->
                      <!--                      <span v-if="!configurable">-->
                      <!--                        {{ count(bestStatsById(currentStats[index].id)) }}-->
                      <!--                      </span>-->
                      <!--                      <span v-else>-->
                      <!--                        {{ bestStatsById(currentStats[index].id) }}x-->
                      <!--                      </span>-->
                    </div>
                  </div>
                </v-progress-circular>
              </div>

              <div class="Hangboard">
                <v-container fluid class="py-0">
                  <v-row>
                    <v-col cols="12" class="py-0">
                      <hangboard
                        v-if="currentStats"
                        :data="currentStats[index]"
                        :edit-workout="false"
                      ></hangboard>
                    </v-col>
                  </v-row>
                </v-container>
              </div>

              <div class="Title">
                <div class="title text-uppercase mb-2">
                  <span v-if="!running">
                    Max
                    <span
                      v-if="
                        currentStats[index].left === null ||
                          currentStats[index].right === null
                      "
                    >
                      One-Arm
                    </span>
                    <span>{{ currentType.name }}</span>
                    <span v-if="configurable"> Pull-up</span>
                  </span>
                  <span v-else>
                    <span v-if="!configurable">Stay hanging</span>
                    <span v-if="configurable">Keep doing them</span>
                  </span>
                </div>
                <div class="subheading">
                  <span v-if="!running">
                    <span v-if="!countingDown"
                      >Press <v-icon small>mdi-timer</v-icon> to start counting
                      down</span
                    >
                    <span v-else>Counting down.. Get in position!</span>
                  </span>
                  <span v-else>
                    <span v-if="!configurable">Hang as long as you can</span>
                    <span v-if="configurable"
                      >Do as many pull-ups as you can</span
                    >
                  </span>
                </div>
              </div>
            </v-row>
          </v-col>
        </v-row>
      </v-container>

      <v-dialog v-model="dialog" persistent width="500">
        <v-card>
          <v-card-title class="headline">Recording result</v-card-title>

          <v-card-text>
            <div v-if="configurable">
              How many pull-ups did you do?
              <v-container fluid grid-list-lg>
                <v-layout wrap>
                  <div style="width: 45px">
                    <v-text-field
                      v-model="pullups"
                      class="mt-0"
                      hide-details
                      single-line
                      type="number"
                    >
                    </v-text-field>
                  </div>

                  <div>
                    <v-subheader>
                      Pullups
                    </v-subheader>
                  </div>
                </v-layout>
              </v-container>
            </div>
            <div v-else>
              <span>
                You did a <strong>Max {{ currentType.name }}</strong> for
                {{ count(totalTime) }}.
              </span>
              <br />
              <!--              <span v-if="bestStatsById(currentStats[index].id) > 0">-->
              <!--                Your best recording:-->
              <!--                {{ count(bestStatsById(currentStats[index].id)) }}.-->
              <!--                <br />-->
              <!--              </span>-->
              <!--              <br />-->
              <!--              <span v-if="bestStatsById(currentStats[index].id) < totalTime">-->
              <!--                This is a new record!-->
              <!--              </span>-->
            </div>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="saveRecording">
              save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-speed-dial bottom right fixed>
        <v-btn
          v-if="!running"
          slot="activator"
          color="secondary"
          dark
          fab
          @click="countDown"
        >
          <v-icon>mdi-timer</v-icon>
        </v-btn>
        <v-btn
          v-if="running"
          slot="activator"
          color="secondary"
          dark
          fab
          @click="stopRecording"
        >
          <v-icon>mdi-stop</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-content>
  </v-layout>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import * as NoSleep from 'nosleep.js/dist/NoSleep'
import Hangboard from '@/components/Hangboard'
import { getImg, count, sound, speak } from '@/misc/helpers'

export default {
  components: { Hangboard },
  props: {
    data: Object,
    index: Number,
    id: Number
  },
  data: () => ({
    dialog: false,
    noSleep: new NoSleep(),
    pullups: 0,
    countingDown: false,
    running: false,
    timer: null,
    totalTime: 5,
    configurable: false
  }),
  computed: {
    ...mapState('authentication', ['user']),
    ...mapGetters('progress', ['statsById', 'bestStatsById']),
    ...mapGetters('workouts', ['typeById']),
    binding() {
      const binding = {}

      if (this.$vuetify.breakpoint.xs) binding.column = true

      return binding
    },
    currentStats() {
      return this.statsById({
        type: this.currentType.id,
        settings: this.user.settings
      })
    },
    currentType() {
      return this.typeById(this.id)
    }
  },
  methods: {
    ...mapActions('progress', ['AddRecording']),
    getImg,
    count,
    speak,
    sound,
    encodeUrl(url) {
      return url
        .toString() // Convert to string
        .normalize('NFD') // Change diacritics
        .replace(/[\u0300-\u036f]/g, '') // Remove illegal characters
        .replace(/\s+/g, '-') // Change whitespace to dashes
        .toLowerCase() // Change to lowercase
        .replace(/&/g, '-and-') // Replace ampersand
        .replace(/[^\-a-z0-9]/g, '') // Remove anything that is not a letter, number or dash
        .replace(/-+/g, '-') // Remove duplicate dashes
        .replace(/^-*/, '') // Remove starting dashes
        .replace(/-*$/, '') // Remove trailing dashes
    },
    counter() {
      this.totalTime += 1
    },
    speakText(text) {
      if (this.user.settings.speak) this.speak(text)
    },
    playSound(path) {
      if (this.user.settings.sound) this.sound(path)
    },
    vibratePhone() {
      if ('vibrate' in navigator) {
        if (this.user.settings.vibrate) navigator.vibrate([80, 40, 120])
      }
    },
    countDown() {
      this.countingDown = true
      const countdownTimer = setInterval(() => {
        if (this.totalTime <= 1) {
          clearInterval(countdownTimer)
          this.countingDown = false
          this.startRecording()
          this.vibratePhone()
          this.playSound('start.mp3')
          this.speakText('Go!')
        }
        this.totalTime -= 1
      }, 1000)
    },
    async startRecording() {
      this.running = true
      await this.requestWakeLock()
      this.timer = setInterval(() => this.counter(), 1000)
    },
    stopRecording() {
      clearInterval(this.timer)
      this.running = false
      if ('wakeLock' in navigator && 'request' in navigator.wakeLock) {
        this.wakeLock.release()
        this.wakeLock = null
      } else {
        this.noSleep.disable()
      }
      this.dialog = true
    },
    saveRecording() {
      if (this.configurable) {
        this.AddRecording({
          data: this.currentStats[this.index],
          value: Number(this.pullups),
          type: this.id
        })
      } else {
        this.AddRecording({
          data: this.currentStats[this.index],
          value: this.totalTime,
          type: this.id
        })
      }
      this.$router.push({
        name: 'progress-list',
        params: { data: this.data, index: this.index, userId: this.user.id }
      })
    },
    async requestWakeLock() {
      try {
        if ('wakeLock' in navigator && 'request' in navigator.wakeLock) {
          this.wakeLock = await navigator.wakeLock.request('screen')
          this.wakeLock.addEventListener('release', () => {
            // eslint-disable-next-line no-console
            console.log('Wake Lock was released')
          })
          // eslint-disable-next-line no-console
          console.log('Wake Lock is active')
        } else {
          // eslint-disable-next-line no-console
          console.log('noSleep')
          this.noSleep.enable()
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`${err.name}, ${err.message}`)
      }
    }
  },
  head: {
    title: {
      inner: 'Record'
    },
    meta: [
      {
        name: 'description',
        content: '',
        id: 'desc'
      }
    ]
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
#app .workout {
  .v-toolbar {
    &__content,
    &__extension {
      // sm
      @media (min-width: 600px) {
        flex-basis: 100%;
        max-width: 100%;
      }
      @media (min-width: 960px) {
        flex-basis: 66.6666666667%;
        max-width: 66.6666666667%;
      }
      @media (min-width: 1264px) {
        flex-basis: 50%;
        max-width: 50%;
      }
    }
  }
}
</style>
