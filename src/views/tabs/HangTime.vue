<template>
  <v-layout row>
    <v-flex>
      <v-list two-line>
        <v-list-item v-if="user">
          <v-list-item-avatar>
            <v-img
              :src="user.photoURL"
              :alt="user.displayName"
              aspect-ratio="1"
              class="grey lighten-2"
            />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.displayName }}</v-list-item-title>
            <v-list-item-subtitle
              >Record your progress and become a better climber
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <div class="text-xs-center">
        <v-btn-toggle v-model="type" class="mb-4" mandatory>
          <v-btn text value="hangtime">
            Hangtime
          </v-btn>
          <v-btn text value="pullups">
            Pull-ups
          </v-btn>
        </v-btn-toggle>
      </div>

      <v-sheet
        v-if="stats[type].labels.length > 1"
        class="mx-auto"
        color="secondary"
        elevation="12"
        max-width="calc(100% - 32px)"
      >
        <v-sparkline
          :labels="stats[type].labels"
          :value="stats[type].value"
          color="white"
          line-width="2"
          padding="16"
        ></v-sparkline>
      </v-sheet>

      <v-list>
        <v-list-item v-for="(item, index) in stats[type].labels" :key="index">
          <v-list-item-avatar>
            <v-icon>mdi-timer</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>
              <span>{{ stats[type].labels[index] }} - </span>
              <span>{{ stats[type].value[index] }}</span>
              <span v-if="type === 'pullups'">
                pull-ups
              </span>
              <span v-else>
                seconds
              </span>
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-icon>mdi-delete</v-icon>
          </v-list-item-action>
        </v-list-item>

        <v-list-item v-if="stats[type].labels.length === 0">
          <v-list-item-content>
            <v-list-item-title class="text-xs-center">
              <span>
                Record your
                <span v-if="type === 'hangtime'">hangtime</span>
                <span v-if="type === 'pullups'">pull-ups</span>
                using the <v-icon small>mdi-timer</v-icon> button
              </span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  head: {
    title: {
      inner: 'Measure strength'
    },
    meta: [
      {
        name: 'description',
        content: 'HangTime home page',
        id: 'desc'
      }
    ]
  },
  components: {},
  data: () => ({
    type: 'hangtime'
  }),
  computed: {
    ...mapState('authentication', ['user', 'stats']),
    ...mapState('app', ['networkOnLine'])
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
