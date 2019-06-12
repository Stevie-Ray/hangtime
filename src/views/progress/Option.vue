<template>
  <v-layout row class="workout">
    <v-app-bar color="primary" app dark fixed>
      <v-icon @click="$router.push({ name: 'progress' })"
        >mdi-arrow-left</v-icon
      >
      <v-avatar size="32px">
        <v-img
          :src="getImg(option.image)"
          :alt="option.name"
          aspect-ratio="1"
          class="grey lighten-2"
        />
      </v-avatar>
      <v-toolbar-title>
        {{ option.name }}
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex xs12 sm8 md6>
            <v-list v-if="!stats.length">
              <v-list-item>
                <v-list-item-title>
                  No recordings added yet
                </v-list-item-title>
              </v-list-item>
            </v-list>

            <v-card v-for="(data, index) in stats" :key="index">
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
                <v-btn color="primary" text>
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
                  <hangboard :data="data" :edit-workout="true"></hangboard>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="dialog = false">
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
import { mapState } from 'vuex'
import Hangboard from '@/components/Hangboard'
import { getImg, count } from '@/misc/helpers'

export default {
  components: { Hangboard },
  props: {
    option: Object
  },
  data: () => ({
    dialog: false,
    data: {
      left: 0,
      right: 0
    }
  }),
  head: {
    title: {
      inner: 'Workout'
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
    ...mapState('authentication', ['user', 'stats'])
  },
  methods: {
    getImg,
    count
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
