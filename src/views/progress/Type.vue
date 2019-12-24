<template>
  <v-layout class="progress-type">
    <v-app-bar color="primary" app dark fixed>
      <v-icon @click="$router.push({ path: currentTab })"
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
            <v-speed-dial bottom right fixed>
              <v-btn
                slot="activator"
                color="secondary"
                dark
                fab
                @click="dialog = true"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-speed-dial>

            <v-container v-if="currentStats && !currentStats.length" fluid>
              <v-row justify="center" align="center">
                <v-avatar aspect-ratio="1" class="grey lighten-2" size="164">
                  <img src="@/assets/sloth/sleepy.svg" alt="sloth sleepy" />
                </v-avatar>
              </v-row>
              <v-row>
                <v-card flat>
                  <v-card-title>
                    No recordings added yet
                  </v-card-title>
                  <v-card-subtitle>
                    Start recording your progress using the
                    <v-icon small>mdi-plus</v-icon> icon.
                  </v-card-subtitle>
                </v-card>
              </v-row>
            </v-container>

            <div v-for="(data, index) in currentStats" :key="index">
              <v-card flat @click="goToRecordings(data, index)">
                <v-container>
                  <v-row>
                    <v-col cols="8">
                      <hangboard :data="data" :edit-workout="false"></hangboard>
                    </v-col>
                    <v-col cols="4" align-self="center">
                      <div v-if="data.recordings.length">
                        <div>
                          <strong>
                            <v-icon small class="mr-1">mdi-medal</v-icon>
                            {{ count(bestStatsById(data.id)) }}
                          </strong>
                        </div>
                        <!--                        <div>-->
                        <!--                          <strong>-->
                        <!--                            <v-icon small class="mr-1">mdi-medal</v-icon>-->
                        <!--                            {{ bestStatsById(data.id) }}x-->
                        <!--                          </strong>-->
                        <!--                        </div>-->
                        <div class="caption">
                          <v-icon small>mdi-page-last</v-icon>
                          {{ shortDate(data.updateTimestamp) }}
                        </div>
                        <div>
                          <v-icon small class="mr-1">mdi-repeat</v-icon>
                          <span>{{ data.recordings.length }}</span>
                        </div>
                      </div>
                      <div v-else class="text-center">
                        <v-btn fab small color="secondary">
                          <v-icon dark>mdi-timer</v-icon>
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
              <v-divider></v-divider>
            </div>

            <v-dialog v-model="dialog" width="500">
              <v-card>
                <v-card-title class="headline" primary-title>
                  Select Holds
                </v-card-title>

                <v-card-subtitle>
                  Or deselect to use one hand
                </v-card-subtitle>

                <v-card-text>
                  <hangboard
                    :data="hangboardData"
                    :edit-workout="true"
                    @left="setLeft($event)"
                    @right="setRight($event)"
                  ></hangboard>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="clickAddHangboard">
                    Track your progress
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('app', ['networkOnLine', 'currentTab']),
    ...mapGetters('progress', ['statsById', 'bestStatsById']),
    ...mapGetters('workouts', ['typeById']),
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
    ...mapActions('progress', ['triggerAddHangboardAction']),
    getImg,
    count,
    shortDate,
    clickAddHangboard() {
      const progress = this.hangboardData
      const { selected } = this.user.settings
      progress.type = this.id
      progress.recordings = []
      progress.hangboard = this.user.settings.hangboards[selected].hangboard
      progress.company = this.user.settings.hangboards[selected].company

      const exists = this.currentStats.some(
        el =>
          el.right === this.hangboardData.right &&
          el.left === this.hangboardData.left
      )

      if (!exists) {
        this.triggerAddHangboardAction(progress)
      }

      this.dialog = false
    },
    goToRecordings(data, index) {
      if (data.recordings.length > 0) {
        this.$router.push({
          name: 'progress-list',
          params: { data, index, id: this.currentType.id }
        })
      } else {
        this.$router.push({
          name: 'progress-record',
          params: { data, index, id: this.currentType.id }
        })
      }
    },
    setLeft(event) {
      if (this.hangboardData.left !== event) {
        this.hangboardData.left = event
      } else if (this.hangboardData.right !== null) {
        this.hangboardData.left = null
      }
    },
    setRight(event) {
      if (this.hangboardData.right !== event) {
        this.hangboardData.right = event
      } else if (this.hangboardData.left !== null) {
        this.hangboardData.right = null
      }
    }
  },
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
