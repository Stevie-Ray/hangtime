<template>
  <app-container
    v-if="user"
    :name="user.displayName"
    :back-link="{ path: currentTab }"
  >
    <v-card flat class="mx-auto" color="#26c6da" tile dark>
      <v-img
        class="white--text justify-center align-center text-center"
        height="200px"
        src="https://cdn.stocksnap.io/img-thumbs/960w/SVR6UFHF7Q.jpg"
        gradient="to bottom, rgba(1,46,64,.66), rgba(0,0,0,.33)"
      >
        <v-card-title class="justify-center align-center">
          <v-row>
            <v-col class="text-right">
              <div class="text-overline">Grade</div>
              <div>
                {{
                  ircra
                    .convert('ircra', user.settings.grade)
                    .to(user.settings.scale)[user.settings.scale]
                }}
              </div>
            </v-col>
            <v-col cols="3">
              <v-avatar>
                <img
                  v-if="user.photoURL"
                  :src="user.photoURL"
                  :alt="user.displayName"
                />
              </v-avatar>
            </v-col>
            <v-col class="text-left">
              <div class="text-overline">Workouts</div>
              <div>0</div>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="pa-0">
          {{ user.status }}
        </v-card-text>
        <v-card-subtitle class="mt-0">
          Joined {{ shortDate(user.createTimestamp) }}
        </v-card-subtitle>
      </v-img>
    </v-card>

    <v-card flat>
      <v-card-title> Hangboards </v-card-title>
      <v-card-text>
        <v-item-group>
          <v-row>
            <v-col
              v-for="(item, index) in user.settings['hangboards']"
              :key="index"
              cols="6"
              sm="4"
              md="3"
              lg="2"
            >
              <v-card color="primary" dark flat tile class="pl-4 pr-0">
                <v-row
                  class="align-center"
                  style="display: flex; height: 100px"
                >
                  <v-img
                    class="my-2"
                    :src="
                      getImg(
                        companies[item.company].hangboards[item.hangboard].image
                      )
                    "
                  />
                </v-row>
              </v-card>
              <div>{{ companies[item.company].name }}</div>
              <div>
                {{ companies[item.company].hangboards[item.hangboard].name }}
              </div>
            </v-col>
          </v-row>
        </v-item-group>
      </v-card-text>
    </v-card>

    <v-card v-if="userId" flat>
      <div class="title">This feature is in development.</div>
      <div class="text-subtitle-1">User ID: {{ userId }}</div>
    </v-card>
  </app-container>
</template>

<script>
import { mapState } from 'vuex'
import AppContainer from '@/components/molecules/AppContainer/AppContainer'
import IRCRA from 'ircra'
import { getImg, shortDate } from '@/misc/helpers'

export default {
  components: {
    AppContainer
  },
  props: {
    userId: String
  },
  data: () => ({
    ircra: new IRCRA()
  }),
  head: {
    title: {
      inner: 'Profile'
    },
    meta: [
      {
        name: 'description',
        content: 'User profile page',
        id: 'desc'
      }
    ]
  },
  computed: {
    ...mapState('app', ['networkOnLine', 'currentTab']),
    ...mapState('authentication', ['user']),
    ...mapState('companies', ['companies'])
  },
  methods: {
    getImg,
    shortDate
  }
}
</script>

<style lang="scss" scoped></style>
