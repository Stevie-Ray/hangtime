<template>
  <v-layout row class="workout">
    <v-app-bar color="primary" app dark fixed>
      <v-icon
        v-if="currentType"
        @click="
          $router.push({
            name: 'progress-type',
            params: { type: encodeUrl(currentType.name), id: currentType.id }
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
        <span>Record your </span>
        <span>{{ currentType.name }}</span>
        <span v-if="currentType.configurable">s</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content v-if="currentType">
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex xs12 md8 lg6>
            <v-layout
              justify-space-around
              align-center
              fill-height
              text-xs-center
              v-bind="binding"
              class="canvas"
            >
              <!-- circle -->
              <v-flex class="Counter">
                <v-progress-circular
                  class="mt-3"
                  :rotate="270"
                  :size="300"
                  :width="5"
                  :value="100"
                >
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
                    <span>{{ currentType.name }}</span>
                  </div>

                  <div id="timer" class="display-3 font-weight-bold">
                    {{ count(totalTime) }}
                  </div>

                  <div
                    v-if="currentStats[index].recordings.length > 0"
                    class="text-uppercase font-weight-bold"
                  >
                    Best:
                    <span v-if="!currentType.configurable">
                      {{ count(bestStatsById(currentStats[index].id)) }}
                    </span>
                    <span v-else>
                      {{ bestStatsById(currentStats[index].id) }}x
                    </span>
                  </div>
                </v-progress-circular>
              </v-flex>

              <v-flex class="Hangboard">
                <hangboard
                  v-if="currentStats"
                  :data="currentStats[index]"
                  :edit-workout="false"
                ></hangboard>
              </v-flex>

              <v-flex class="Title">
                <div class="title text-uppercase mb-2">
                  <span v-if="!running">
                    <span>Record your </span>
                    <span>{{ currentType.name }}</span>
                    <span v-if="currentType.configurable">s</span>
                  </span>
                  <span v-else>
                    <span v-if="!currentType.configurable">Stay hanging</span>
                    <span v-if="currentType.configurable">Keep doing them</span>
                  </span>
                </div>
                <div class="subheading">
                  <span v-if="!running"
                    >Use the <v-icon small>mdi-timer</v-icon> to start</span
                  >
                  <span v-else>
                    <span v-if="!currentType.configurable"
                      >Hang as long as you can</span
                    >
                    <span v-if="currentType.configurable"
                      >Do as many pull-ups as you can</span
                    >
                  </span>
                </div>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>

      <v-dialog v-model="dialog" persistent width="400">
        <v-card>
          <v-card-title class="headline">Pull-ups result</v-card-title>

          <v-card-text>
            How many pull-ups did you do?
            <v-container fluid grid-list-lg>
              <v-layout row wrap>
                <v-flex shrink style="width: 45px">
                  <v-text-field
                    v-model="pullups"
                    class="mt-0"
                    hide-details
                    single-line
                    type="number"
                  >
                  </v-text-field>
                </v-flex>

                <v-flex>
                  <v-subheader>
                    Pullups
                  </v-subheader>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="savePullups">
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
          large
          @click="startRecording"
        >
          <v-icon>mdi-timer</v-icon>
        </v-btn>
        <v-btn
          v-if="running"
          slot="activator"
          color="secondary"
          dark
          fab
          large
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
import Hangboard from '@/components/Hangboard'
import { getImg, count } from '@/misc/helpers'

export default {
  components: { Hangboard },
  props: {
    id: Number,
    data: Object,
    index: Number
  },
  data: () => ({
    totalTime: 0,
    timer: null,
    running: false,
    pullups: 0,
    dialog: false
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
    ...mapGetters('progress', ['statsById', 'bestStatsById']),
    ...mapGetters('workouts', ['typeById']),
    binding() {
      const binding = {}

      if (this.$vuetify.breakpoint.xs) binding.column = true

      return binding
    },
    currentStats() {
      return this.statsById(this.currentType.id)
    },
    currentType() {
      return this.typeById(this.id)
    }
  },
  methods: {
    ...mapActions('progress', ['AddRecording']),
    getImg,
    count,
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
      this.totalTime = this.totalTime + 1
    },
    startRecording() {
      this.timer = setInterval(() => this.counter(), 1000)
      this.running = true
    },
    stopRecording() {
      this.running = false
      if (this.currentType.configurable) {
        this.dialog = true
        return
      }
      this.AddRecording({
        data: this.currentStats[this.index],
        value: this.totalTime
      })
      this.$router.push({
        name: 'progress-type',
        params: {
          type: this.encodeUrl(this.currentType.name),
          id: this.currentType.id
        }
      })
    },
    savePullups() {
      this.AddRecording({
        data: this.currentStats[this.index],
        value: this.pullups
      })
      this.$router.push({
        name: 'progress-type',
        params: {
          type: this.encodeUrl(this.currentType.name),
          id: this.currentType.id
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
