<template>
  <v-layout class="progress-list">
    <v-app-bar color="primary" app dark fixed>
      <v-icon @click="$router.push({ path: currentTab })"
        >mdi-arrow-left</v-icon
      >
      <v-toolbar-title>
        Record your progress
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn icon @click="filterDialog = true">
        <v-icon>mdi-tune</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container>
        <v-row justify="center" align="start" class="fill-height">
          <v-col cols="12" sm="8" md="6">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <line-chart
                          :chart-data="chartData"
                          :height="300"
                          class="justify-center d-flex"
                  ></line-chart>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
          <v-col cols="12">
            <hangboard
              v-if="currentStats[index]"
              :data="currentStats[index]"
              :edit-workout="false"
            ></hangboard>

            <v-list
              v-if="
                currentStats[index] &&
                  currentStats[index]['recordings'].length > 0 &&
                  selected.includes(currentType.id)
              "
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
                    <v-list-item-title v-if="currentStats[index]">
                      <span
                        v-if="
                          currentStats[index].left === null ||
                            currentStats[index].right === null
                        "
                        >One-Arm
                      </span>
                      <span>{{ currentType.name }}</span>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ currentStats[index]['recordings'][item].label }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text>
                      <span>
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
          </v-col>
        </v-row>
      </v-container>

      <v-dialog v-model="filterDialog" max-width="500">
        <v-card>
          <v-card-title class="headline">Select workout types</v-card-title>

          <v-card-text>
            <v-container fluid>
              <v-checkbox
                v-for="option in options"
                :key="option.id"
                v-model="selected"
                :label="option.name"
                :value="option.id"
              ></v-checkbox>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text @click="filterDialog = false">
              Close
            </v-btn>

            <v-btn color="primary" text @click="filterDialog = false">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="selectTypeDialog" max-width="500">
        <v-card>
          <v-card-title class="headline">Select workout types</v-card-title>
          <v-card-text>
            <v-container fluid>
              <v-radio
                v-for="option in options"
                :key="option.id"
                :label="option.name"
                :value="option.id"
              ></v-radio>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text @click="filterDialog = false">
              Close
            </v-btn>

            <v-btn color="primary" text @click="filterDialog = false">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-fab-transition>
        <v-btn
          slot="activator"
          color="secondary"
          dark
          fab
          bottom
          right
          fixed
          @click="selectTypeDialog = true"
        >
          <v-icon>mdi-timer</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-content>
  </v-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Hangboard from '@/components/Hangboard'
import LineChart from '@/components/LineChart'
import { getImg, count, shortDate } from '@/misc/helpers'

export default {
  components: { Hangboard, LineChart },
  props: {
    data: Object,
    index: Number
  },
  data: () => ({
    tab: null,
    filterDialog: false,
    selectTypeDialog: false,
    selected: [0]
  }),
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('app', ['networkOnLine', 'currentTab']),
    ...mapState('workouts', ['options']),
    ...mapGetters('progress', ['statsById']),
    ...mapGetters('workouts', ['typeById']),
    binding() {
      const binding = {}

      if (this.$vuetify.breakpoint.xs) binding.column = true

      return binding
    },
    currentStats() {
      return this.statsById({
        // type: this.currentType.id,
        settings: this.user.settings
      })
    },
    currentType() {
      if (!this.currentStats) return
      // eslint-disable-next-line consistent-return
      return this.typeById(this.currentStats[this.index].type)
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
    currentStatsValuePlus() {
      if (
              this.currentStats[this.index] &&
              this.currentStats[this.index].recordings.length === 0
      ) {
        return
      }
      // eslint-disable-next-line consistent-return
      return this.currentStats[this.index].recordings.map(a => {
        const random = Math.floor(Math.random() * (40 - 20 + 1) + 20);
        return a.value - random
      })
    },
    chartData() {
      if (!this.currentStatsValue && !this.currentStatsLabels) return
      // eslint-disable-next-line func-names
      const filtered = this.options.filter(function(e) {
        return this.indexOf(e.id) >= 0
      }, this.selected)

      const datasets = []
      const self = this
      filtered.forEach(option => {
        datasets.push({
          label: option.name,
          backgroundColor: option.color,
          borderColor: option.border,
          data: self.currentStatsValue
        });
      datasets.push({
        label: `${option.name} Pull-ups`,
        backgroundColor: option.color,
        borderColor: option.border,
        data: self.currentStatsValuePlus
      });
        })
      // eslint-disable-next-line consistent-return
      return {
        labels: this.currentStatsLabels,
        datasets
      }
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
    selectType() {
      this.$router.push({ name: 'workouts' })
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
