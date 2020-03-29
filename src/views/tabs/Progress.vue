<template>
  <div>
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
      <v-card
        flat
        @click="
          $router.push({
            name: 'progress-list',
            params: { data, index, userId: user.id }
          })
        "
      >
        <v-container>
          <v-row>
            <v-col cols="8" class="d-flex align-center pt-0 pb-0">
              <hangboard
                class="pa-0"
                :data="data"
                :edit-workout="false"
              ></hangboard>
            </v-col>
            <v-col cols="4" align-self="center">
              <div v-if="data.recordings.length">
                <div class="flex">
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
                <div class="flex caption">
                  <v-icon small>mdi-page-last</v-icon>
                  {{ shortDate(data.updateTimestamp) }}
                </div>
                <div class="flex">
                  <v-icon small class="mr-1">mdi-repeat</v-icon>
                  <span>{{ data.recordings.length }}</span>
                </div>
              </div>
              <div v-else class="text-center">
                <v-btn icon small>
                  <v-icon dark>mdi-timer</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <v-divider></v-divider>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Hangboard from '@/components/Hangboard'
import { getImg, count, shortDate } from '@/misc/helpers'

export default {
  components: { Hangboard },
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('app', ['networkOnLine', 'currentTab']),
    ...mapGetters('progress', ['statsById', 'bestStatsById']),
    // ...mapGetters('workouts', ['typeById']),
    currentStats() {
      return this.statsById({
        // type: this.currentType.id,
        settings: this.user.settings
      })
    }
    // currentType() {
    //   return this.typeById(this.id)
    // }
  },
  methods: {
    getImg,
    count,
    shortDate
  },
  head: {
    title: {
      inner: 'Progress'
    },
    meta: [
      {
        name: 'description',
        content: 'Measure strength and become a better climber',
        id: 'desc'
      }
    ]
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
