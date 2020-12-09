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
        >{{ mdi.arrowLeft }}</v-icon
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
          {{ $t('One Arm') }}
        </span>
        <span>{{ currentType.name }}</span>
        <span v-if="configurable"> Pull-up</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main v-if="currentType">
      <v-container>
        <v-row justify="center" align="start" class="fill-height">
          <v-col cols="12" sm="8" md="6">
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
                      {{ $t('Max.') }}
                      <span
                        v-if="
                          currentStats[index].left === null ||
                            currentStats[index].right === null
                        "
                      >
                        {{ $t('One Arm') }}
                      </span>
                      <span>{{ currentType.name }}</span>
                      <span v-if="configurable"> Pull-up</span>
                    </div>

                    <div id="timer" class="text-h2 font-weight-bold">
                      {{ count(totalTime) }}
                    </div>

                    <div
                      v-if="
                        currentStats[index] &&
                          currentStats[index].recordings.length > 0
                      "
                      class="text-uppercase font-weight-bold"
                    >
                      <span
                        v-if="
                          !configurable &&
                            bestStatsByType({
                              id: currentStats[index].id,
                              type: currentType.id
                            }) > 0
                        "
                      >
                        {{ $t('Best') }}:{{
                          count(
                            bestStatsByType({
                              id: currentStats[index].id,
                              type: currentType.id
                            })
                          )
                        }}
                      </span>
                      <span v-if="configurable">
                        {{ $t('Best') }}:
                        {{ bestStatsById(currentStats[index].id) }}x
                      </span>
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
                    {{ $t('Max.') }}
                    <span
                      v-if="
                        currentStats[index].left === null ||
                          currentStats[index].right === null
                      "
                    >
                      {{ $t('One Arm') }}
                    </span>
                    <span>{{ currentType.name }}</span>
                    <span v-if="configurable"> Pull-up</span>
                  </span>
                  <span v-else>
                    <span v-if="!configurable">{{ $t('Stay hanging') }}</span>
                    <span v-if="configurable">{{ $t('Keep doing them') }}</span>
                  </span>
                </div>
                <div class="subheading">
                  <span v-if="!running">
                    <span v-if="!countingDown">
                      {{ $t('Press below button to start counting down') }}
                    </span>
                    <span v-else>{{ $t('Counting down.. Get ready') }}</span>
                  </span>
                  <span v-else>
                    <span v-if="!configurable">
                      {{ $t('Hang as long as you can') }}
                    </span>
                    <span v-if="configurable">
                      {{ $t('Do as many pull-ups as you can') }}
                    </span>
                  </span>
                </div>
              </div>
            </v-row>
          </v-col>
        </v-row>
      </v-container>

      <v-dialog v-model="dialog" persistent width="500">
        <v-card>
          <span v-if="!configurable">
            <v-card-title class="text-h5"
              >{{ $t('Max.') }} {{ currentType.name }}</v-card-title
            >

            <v-card-subtitle class="title">
              {{ $t('Your time') }}: <strong>{{ count(totalTime) }}</strong>
            </v-card-subtitle>

            <v-card-text>
              <div class="text-body-2">
                {{
                  $t(
                    'If it took some time before you pressed stop please add a fair correction'
                  )
                }}:
              </div>

              <v-btn-toggle v-model="timeCorrection" class="py-4">
                <v-btn v-show="finalTime - 3 >= 0" :value="3">-3 sec.</v-btn>
                <v-btn v-show="finalTime - 2 >= 0" :value="2">-2 sec.</v-btn>
                <v-btn v-show="finalTime - 1 >= 0" :value="1">-1 sec.</v-btn>
                <v-btn
                  v-show="finalTime === 0 && totalTime > finalTime"
                  :value="totalTime"
                  >{{ $t('Reset') }}</v-btn
                >
              </v-btn-toggle>

              <v-row class="">
                <v-col cols="6">
                  <div class="text-subtitle-2">{{ $t('Final Score') }}</div>
                  <div class="text-h4">
                    <strong>{{ count(finalTime) }}</strong>
                  </div>
                </v-col>
                <v-col cols="6">
                  <span
                    v-if="
                      bestStatsByType({
                        id: currentStats[index].id,
                        type: currentType.id
                      }) > 0
                    "
                  >
                    <div class="text-subtitle-2">
                      {{ $t('Best') }}: {{ currentType.name }}
                    </div>
                    <div class="text-h4">
                      {{
                        count(
                          bestStatsByType({
                            id: currentStats[index].id,
                            type: currentType.id
                          })
                        )
                      }}
                    </div>
                  </span>
                </v-col>
              </v-row>

              <div
                v-if="
                  bestStatsByType({
                    id: currentStats[index].id,
                    type: currentType.id
                  }) < finalTime
                "
                class="title"
              >
                {{ $t('This is a new record') }}!
              </div>
            </v-card-text>
          </span>
          <span v-else>
            <v-card-title class="text-h5">{{
              $t('Recording result')
            }}</v-card-title>

            <v-card-text>
              <div>
                {{ $t('How many pull-ups did you do?') }}
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
                        Pull-ups
                      </v-subheader>
                    </div>
                  </v-layout>
                </v-container>
              </div>
            </v-card-text>
          </span>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="saveRecording">
              {{ $t('Save') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-speed-dial bottom right fixed>
        <v-btn
          v-if="!running && !countingDown"
          slot="activator"
          color="secondary"
          dark
          fab
          @click="countDown"
        >
          <v-icon>{{ mdi.timer }}</v-icon>
        </v-btn>
        <v-btn
          v-if="running"
          slot="activator"
          color="secondary"
          dark
          fab
          @click="stopRecording"
        >
          <v-icon>{{ mdi.stop }}</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-main>
  </v-layout>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import NoSleep from 'nosleep.js'
import Hangboard from '@/components/Hangboard'
import { getImg, count, sound, speak } from '@/misc/helpers'
import { mdiStop, mdiTimer, mdiArrowLeft } from '@mdi/js'

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
    timeCorrection: 0,
    configurable: false,
    mdi: {
      stop: mdiStop,
      timer: mdiTimer,
      arrowLeft: mdiArrowLeft
    }
  }),
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
  },
  computed: {
    ...mapState('authentication', ['user']),
    ...mapGetters('progress', [
      'statsById',
      'bestStatsById',
      'bestStatsByType'
    ]),
    ...mapGetters('workouts', ['gripById']),
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
      return this.gripById(this.id)
    },
    finalTime() {
      if (!this.timeCorrection) {
        return this.totalTime
      }
      return this.totalTime - this.timeCorrection
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
      if (this.user.settings.speak && 'speechSynthesis' in window) {
        this.voiceList = window.speechSynthesis.getVoices()
        if (this.user.settings.locale) {
          this.voiceList = this.voiceList.filter(voice => {
            return voice.lang.includes(
              this.user.settings.locale.substring(0, 2)
            )
          })
        } else {
          this.voiceList = this.voiceList.filter(voice =>
            /^(en|EN|US)/.test(voice.lang)
          )
        }
        const utterance = new window.SpeechSynthesisUtterance()
        utterance.text = text
        utterance.voice = this.voiceList[this.user.settings.voice]
        this.speak(utterance)
      }
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
        if (this.totalTime <= 4) {
          // if 0
          if (this.totalTime > 1) {
            if (this.user.settings.speak) {
              this.speakText(this.totalTime - 1)
            } else {
              this.playSound('count.mp3')
            }
          } else {
            clearInterval(countdownTimer)
            this.countingDown = false
            this.startRecording()
            this.vibratePhone()
            this.playSound('start.mp3')
            this.speakText('Go!')
          }
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
      this.vibratePhone()
      this.playSound('stop.mp3')
      this.noSleep.disable()
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
          value: this.finalTime,
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
        this.noSleep.enable()
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`${err.name}, ${err.message}`)
      }
    }
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
