<template>
  <v-layout row class="hangboards">
    <v-app-bar color="primary" app dark fixed>
      <v-icon @click="$router.push({ name: 'settings' })"
        >mdi-arrow-left</v-icon
      >
      <v-toolbar-title>
        Your hangboards
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex xs12 sm8 md6>
            <v-flex
              v-for="(item, index) in user.settings['hangboards']"
              :key="index"
            >
              <v-card flat class="mb-2">
                <div class="hangboard mt-4">
                  <div class="leftside">
                    <v-img
                      :src="
                        getImg(
                          companies[item.company].hangboards[item.hangboard]
                            .image
                        )
                      "
                    />
                  </div>
                  <div class="rightside">
                    <v-img
                      :src="
                        getImg(
                          companies[item.company].hangboards[item.hangboard]
                            .image
                        )
                      "
                    />
                  </div>
                </div>

                <v-card-title primary-title>
                  <div class="text-xs-center">
                    <h3 class="headline ">
                      {{ companies[item.company].name }}
                      {{
                        companies[item.company].hangboards[item.hangboard].name
                      }}
                    </h3>
                  </div>
                </v-card-title>

                <v-card-actions>
                  <v-btn v-if="user.settings.selected === index" text disabled>
                    Selected
                  </v-btn>
                  <v-btn
                    v-else
                    text
                    @click="triggerChangeHangboardAction(index)"
                  >
                    Select
                  </v-btn>
                  <v-btn
                    v-if="user.settings.selected !== index"
                    text
                    color="primary"
                    @click="triggerRemoveHangboardAction(index)"
                  >
                    Delete
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>

              <v-divider></v-divider>
            </v-flex>

            <v-speed-dial bottom right fixed>
              <v-btn
                slot="activator"
                color="secondary"
                dark
                fab
                large
                to="/settings/hangboards/add"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-speed-dial>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { getImg } from '@/misc/helpers'

export default {
  head: {
    title: {
      inner: 'Select Hangboard'
    },
    meta: [
      {
        name: 'description',
        content: 'HangTime user',
        id: 'desc'
      }
    ]
  },
  computed: {
    ...mapState('app', ['networkOnLine']),
    ...mapState('authentication', ['user']),
    ...mapState('companies', ['companies'])
  },
  methods: {
    ...mapActions('authentication', [
      'triggerUpdateUser',
      'triggerChangeHangboardAction',
      'triggerRemoveHangboardAction'
    ]),
    ...mapMutations('authentication', ['setSelected']),
    getImg
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
