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
        <span
          v-if="
            currentStats[index].left === null ||
              currentStats[index].right === null
          "
          >One-Arm
        </span>
        <span>{{ currentType.name }}</span>
        <span v-if="tab === 1"> Pull-up</span>
        <span> Strength</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content v-if="currentType">
      <v-container fluid fill-height>
        <v-layout class="justify-center">
          <v-flex xs12 sm8 md6>
            <v-tabs-items v-model="tab" class="mt-4">
              <v-tab-item key="0">
                <v-sheet
                  v-if="currentStats[index]"
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
              </v-tab-item>
              <v-tab-item key="1"> </v-tab-item>
            </v-tabs-items>
            <v-container fluid fill-height class="py-0">
              <v-row justify="center">
                <v-col cols="12" class="pb-0">
                  <hangboard
                    :data="currentStats[index]"
                    :edit-workout="false"
                  ></hangboard>
                </v-col>
              </v-row>
              <v-row class="fill-height">
                <v-col cols="12" class="py-0">
                  <v-tabs v-model="tab" background-color="transparent" grow>
                    <v-tab key="0">
                      Hangs
                    </v-tab>
                    <v-tab key="1">
                      Pull-ups
                    </v-tab>
                  </v-tabs>
                  <v-tabs-items v-model="tab" class="fill-height">
                    <v-tab-item key="0"
                      ><v-list
                        v-if="currentStats[index]['recordings'].length > 0"
                        two-line
                      >
                        <span
                          v-for="(notUsed, item) in currentStats[index][
                            'recordings'
                          ].length"
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
                                {{
                                  currentStats[index]['recordings'][item].label
                                }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                              <v-list-item-action-text>
                                <span>
                                  {{
                                    count(
                                      currentStats[index]['recordings'][item]
                                        .value
                                    )
                                  }}
                                </span>
                              </v-list-item-action-text>
                            </v-list-item-action>
                          </v-list-item>
                          <v-divider inset></v-divider>
                        </span>
                      </v-list>
                    </v-tab-item>
                    <v-tab-item key="1">
                      <v-list two-line>
                        <v-list-item>
                          <v-list-item-avatar>
                            <v-img
                              src="@/assets/exercises/pullup.svg"
                              :alt="currentType.name"
                              aspect-ratio="1"
                              class="grey lighten-2"
                            />
                          </v-list-item-avatar>

                          <v-list-item-content>
                            <v-list-item-title>
                              No pull-up data available
                            </v-list-item-title>
                            <v-list-item-subtitle>
                              This feature is in development
                            </v-list-item-subtitle>
                          </v-list-item-content>
                          <v-list-item-action>
                            <v-list-item-action-text> </v-list-item-action-text>
                          </v-list-item-action>
                        </v-list-item>
                      </v-list>
                    </v-tab-item>
                  </v-tabs-items>
                </v-col>
              </v-row>
            </v-container>
          </v-flex>
        </v-layout>
      </v-container>

      <v-fab-transition>
        <v-btn
          slot="activator"
          :key="activeFab.icon"
          color="secondary"
          dark
          fab
          bottom
          right
          fixed
          @click="
            $router.push({
              name: 'progress-record',
              params: {
                data: data,
                index: index,
                id: currentType.id,
                configurable: tab === 1 ? true : false
              }
            })
          "
        >
          <v-icon>{{ activeFab.icon }}</v-icon>
        </v-btn>
      </v-fab-transition>
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
  data: () => ({
    tab: null
  }),
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
    },
    activeFab() {
      switch (this.tab) {
        case 0:
          return { icon: 'mdi-timer' }
        case 1:
          return { icon: 'mdi-clock-alert' }
        default:
          return {}
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
