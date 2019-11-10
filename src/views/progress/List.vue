<template>
  <v-layout class="progress-list">
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
        <span>{{ currentType.name }}</span>
        <span> Recordings</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content v-if="currentType">
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex xs12 sm8 md6>
            <v-sheet
              v-if="currentStats[index]"
              class="mt-4 mb-2"
              color="secondary"
              max-width="calc(100% - 32px)"
              style="margin: 0 auto"
            >
              <v-sparkline
                :labels="currentStatsLabels"
                :value="currentStatsValue"
                color="white"
                line-width="2"
                padding="16"
              ></v-sparkline>
            </v-sheet>

            <v-flex>
              <hangboard
                :data="currentStats[index]"
                :edit-workout="false"
              ></hangboard>
            </v-flex>

            <v-list
              v-if="currentStats[index]['recordings'].length > 0"
              two-line
            >
              <span
                v-for="(notUsed, item) in currentStats[index]['recordings']
                  .length"
                :key="item"
              >
                <v-list-item>
                  <v-list-item-avatar>
                    <v-img
                      :src="getImg(currentType.image)"
                      :alt="currentType.name"
                      aspect-ratio="1"
                      class="grey lighten-2"
                    />
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>
                      <span>{{ currentType.name }}</span>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ currentStats[index]['recordings'][item].label }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text>
                      <span v-if="currentType.configurable">
                        {{ currentStats[index]['recordings'][item].value }}x
                      </span>
                      <span v-else>
                        {{
                          count(currentStats[index]['recordings'][item].value)
                        }}
                      </span>
                    </v-list-item-action-text>
                  </v-list-item-action>
                </v-list-item>
                <v-divider inset></v-divider>
              </span>
            </v-list>
          </v-flex>
        </v-layout>
      </v-container>

      <v-speed-dial bottom right fixed>
        <v-btn
          slot="activator"
          color="secondary"
          dark
          fab
          @click="
            $router.push({
              name: 'progress-record',
              params: { data: data, index: index, id: currentType.id }
            })
          "
        >
          <v-icon>mdi-timer</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-content>
  </v-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Hangboard from '@/components/Hangboard'
import { getImg, count, shortDate } from '@/misc/helpers'

export default {
  components: { Hangboard },
  props: {
    id: Number,
    data: Object,
    index: Number
  },
  data: () => ({}),
  computed: {
    ...mapState('authentication', ['user']),
    ...mapGetters('progress', ['statsById']),
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
    currentStatsLabels() {
      if (
        this.currentStats[this.index] &&
        this.currentStats[this.index].recordings.length === 0
      ) {
        return
      }
      // eslint-disable-next-line consistent-return
      return this.currentStats[this.index].recordings.map(a => a.label)
    },
    currentStatsValue() {
      if (
        this.currentStats[this.index] &&
        this.currentStats[this.index].recordings.length === 0
      ) {
        return
      }
      // eslint-disable-next-line consistent-return
      return this.currentStats[this.index].recordings.map(a => a.value)
    },
    currentType() {
      return this.typeById(this.id)
    }
  },
  methods: {
    getImg,
    count,
    shortDate,
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
      // this.$store.dispatch('addRecording', [this.type, 'value', this.totalTime]);
      this.$router.push({
        name: 'progress-type',
        params: {
          type: this.encodeUrl(this.currentType.name),
          id: this.currentType.id
        }
      })
    },
    savePullups() {
      // const value = parseInt(this.pullups, 10);
      // this.$store.dispatch('addRecording', [this.type, 'value', value]);
      this.$router.push({
        name: 'progress-type',
        params: {
          type: this.encodeUrl(this.currentType.name),
          id: this.currentType.id
        }
      })
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
<style lang="scss"></style>
