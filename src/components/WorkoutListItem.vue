<template>
  <div class="workout-item">
    <v-list-item ripple>
      <v-list-item-avatar @click.stop="overlay = true">
        <v-img
          v-if="data.user"
          :src="data.user.photoURL"
          :alt="data.user.displayName"
          aspect-ratio="1"
          class="grey lighten-2"
        />
      </v-list-item-avatar>

      <v-dialog :key="index" v-model="overlay" height="250" width="250">
        <v-card>
          <v-img
            height="100%"
            :src="data.user.photoURL"
            :alt="data.user.displayName"
          >
            <v-row
              justify="space-between"
              class="fill-height flex-column flex-grow-0"
            >
              <v-col class="py-0">
                <v-list-item
                  color="rgba(0, 0, 0, .4)"
                  dark
                  dense
                  style="background-color: rgba(0, 0, 0, .5)"
                >
                  <v-list-item-content class="py-0">
                    <v-list-item-title class="subtitle-1">{{
                      data.user.displayName
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-img>
        </v-card>
        <v-bottom-navigation>
          <v-btn>
            <span class="title">
              {{
                ircra.convert('ircra', data.user.grade).to(user.settings.scale)[
                  user.settings.scale
                ]
              }}
            </span>
          </v-btn>
          <v-btn>
            <v-tooltip top style="opacity: 1 !important;">
              <template v-slot:activator="{ on }">
                <v-icon class="mb-0" v-on="on">mdi-information-outline</v-icon>
              </template>
              <span>Soon</span>
            </v-tooltip>
          </v-btn>
        </v-bottom-navigation>
      </v-dialog>

      <v-list-item-content @click="$emit('goToWorkoutDetails', data.id)">
        <v-list-item-title>{{ data.name }}</v-list-item-title>
        <v-list-item-subtitle
          >{{ count(data.time) }} - {{ data.description }}</v-list-item-subtitle
        >
      </v-list-item-content>

      <v-list-item-action class="text-right">
        <v-list-item-action-text>
          <v-chip v-if="difficultyById(data.level)" class="mt-2" x-small>
            {{ difficultyById(data.level).name }}
          </v-chip>
          <div class="mr-3 mt-1">
            {{
              ircra.convert('ircra', data.user.grade).to(user.settings.scale)[
                user.settings.scale
              ]
            }}
          </div>
        </v-list-item-action-text>
      </v-list-item-action>
    </v-list-item>

    <v-divider inset></v-divider>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import IRCRA from 'ircra'
import { getImg, count } from '@/misc/helpers'

export default {
  props: {
    data: Object,
    index: Number
  },
  data: () => ({
    ircra: new IRCRA(),
    overlay: false
  }),
  computed: {
    ...mapState('authentication', ['user']),
    ...mapGetters('workouts', ['difficultyById'])
  },
  methods: {
    getImg,
    count
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
