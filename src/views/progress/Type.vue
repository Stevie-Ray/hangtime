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
            <v-list v-if="currentStats && !currentStats.length">
              <v-list-item>
                <v-list-item-title>
                  No recordings added yet
                </v-list-item-title>
              </v-list-item>
            </v-list>

            <v-flex v-for="(data, index) in currentStats" :key="index">
              <v-card flat>
                <v-img class="" min-height="150px">
                  <hangboard :data="data" :edit-workout="false"></hangboard>
                </v-img>

                <v-card-title>
                  <span v-if="!currentType.configurable">
                    {{ count(bestStatsById(data.id)) }}
                  </span>
                  <span v-else> {{ bestStatsById(data.id) }}x </span>
                </v-card-title>
                <v-card-text>
                  <div>
                    <strong>{{ data.recordings.length }} Recordings</strong>
                  </div>
                  <div v-if="data.recordings.length">
                    <i>Last recording: {{ shortDate(data.updateTimestamp) }}</i>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    text
                    @click="
                      $router.push({
                        name: 'progress-record',
                        params: { data: data, index: index, id: currentType.id }
                      })
                    "
                  >
                    Start
                  </v-btn>
                  <v-btn
                    v-if="data.recordings.length > 0"
                    text
                    color="primary"
                    @click="
                      $router.push({
                        name: 'progress-list',
                        params: { data: data, index: index, id: currentType.id }
                      })
                    "
                  >
                    Recordings
                  </v-btn>
                </v-card-actions>
              </v-card>

              <v-divider></v-divider>
            </v-flex>

            <v-dialog v-model="dialog">
              <v-card>
                <v-card-title class="headline" primary-title>
                  Select Holds
                </v-card-title>

                <v-card-text>
                  <hangboard
                    :data="hangboardData"
                    :edit-workout="true"
                    @left="hangboardData.left = $event.value"
                    @right="hangboardData.right = $event.value"
                  ></hangboard>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="clickAddHangboard">
                    Add Holds
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
import { mapState, mapGetters, mapActions } from 'vuex'
import Hangboard from '@/components/Hangboard'
import { getImg, count, shortDate } from '@/misc/helpers'

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
    ...mapGetters('progress', ['statsById', 'bestStatsById']),
    ...mapGetters('workouts', ['typeById']),
    currentStats() {
      return this.statsById(this.currentType.id)
    },
    currentType() {
      return this.typeById(this.id)
    }
  },
  methods: {
    ...mapActions('progress', ['triggerAddHangboardAction']),
    getImg,
    count,
    shortDate,
    clickAddHangboard() {
      const progress = this.hangboardData
      progress['type'] = this.id
      progress['recordings'] = []
      progress['hangboard'] = this.user.settings.hangboards[
        this.user.settings.selected
      ].hangboard
      progress['company'] = this.user.settings.hangboards[
        this.user.settings.selected
      ].company
      this.triggerAddHangboardAction(progress)
      this.dialog = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
