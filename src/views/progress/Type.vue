<template>
  <v-layout row class="workout">
    <v-app-bar color="primary" app dark fixed>
      <v-icon @click="$router.push({ name: 'progress' })"
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
        {{ currentType.name }}
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex xs12 sm8 md6>
            <v-list v-if="!currentStats.length">
              <v-list-item>
                <v-list-item-title>
                  No recordings added yet
                </v-list-item-title>
              </v-list-item>
            </v-list>

            <v-card v-for="(data, index) in currentStats" :key="index">
              <v-card-text>
                <hangboard :data="data" :edit-workout="false"></hangboard>
                <div class="text-xs-center">
                  <span v-if="!data.configurable">
                    Best: {{ count(Math.max(...data.value)) }}
                  </span>
                  <span v-else> Best: {{ Math.max(...data.value) }}x </span>
                  <span> - </span>
                  <span> {{ data.value.length }} Recordings </span>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text>
                  Recordings
                </v-btn>
                <v-btn
                  color="primary"
                  text
                  @click="
                    $router.push({
                      name: 'progress-record',
                      params: { data: data, index: index, id: data.id }
                    })
                  "
                >
                  Start
                </v-btn>
              </v-card-actions>
            </v-card>

            <v-dialog v-model="dialog">
              <v-card>
                <v-card-title class="headline" primary-title>
                  Select Holds
                </v-card-title>

                <v-card-text>
                  <hangboard
                    :data="hangboardData"
                    :edit-workout="false"
                  ></hangboard>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="
                    $router.push({
                      name: 'progress-record',
                      params: { data: {left: 0, right: 0}, index: 0, id: currentType.id }
                    })
                  ">
                    Start recording
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-speed-dial bottom right fixed>
              <v-btn
                slot="activator"
                color="secondary"
                dark
                fab
                large
                @click="dialog = true"
              >
                <v-img :src="getImg('icons/hangboard.svg')"></v-img>
              </v-btn>
            </v-speed-dial>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Hangboard from '@/components/Hangboard'
import { getImg, count } from '@/misc/helpers'

export default {
  components: { Hangboard },
  props: {
    id: Number
  },
  data: () => ({
    dialog: false,
    hangboardData: {
      left: 0,
      right: 0
    }
  }),
  head: {
    title: {
      inner: 'Progress'
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
    ...mapGetters('authentication', ['statsById']),
    ...mapGetters('exercises', ['typeById']),
    currentStats() {
      return this.statsById({ type: this.currentType.id })
    },
    currentType() {
      return this.typeById(this.id)
    }
  },
  methods: {
    getImg,
    count
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
