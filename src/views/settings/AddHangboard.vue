<template>
  <v-layout row class="add-hangboard">
    <v-app-bar color="primary" app fixed dark>
      <v-toolbar-title>
        <v-icon @click="$router.push({ name: 'settings-hangboards' })"
          >mdi-arrow-left</v-icon
        >
        Add a hangboard
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex sm8 md6>
            <v-list two-line>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon color="primary lighten-1">mdi-numeric-1-box</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-select
                    v-model="settingsCompany"
                    :items="companies"
                    item-text="name"
                    item-value="id"
                    label="Hangboard manufacturer"
                    required
                    style="width: calc(100% - 32px)"
                    @change="resetHangboard"
                  >
                  </v-select>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-avatar>
                  <v-icon color="primary lighten-1">mdi-numeric-2-box</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <!--                  @change="setSetting"-->
                  <v-select
                    v-model="settingsHangboard"
                    :items="companies[hangboardToAdd.company].hangboards"
                    item-text="name"
                    item-value="id"
                    label="Select your model"
                    required
                    style="width: calc(100% - 32px)"
                  >
                  </v-select>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <v-flex xs12>
              <div
                class="hangboard"
                :class="
                  companies[hangboardToAdd.company].hangboards[
                    hangboardToAdd.hangboard
                  ].name
                "
              >
                <div class="leftside">
                  <img
                    :src="
                      getImg(
                        companies[hangboardToAdd.company].hangboards[
                          hangboardToAdd.hangboard
                        ].image
                      )
                    "
                  />
                </div>
                <div class="rightside">
                  <img
                    :src="
                      getImg(
                        companies[hangboardToAdd.company].hangboards[
                          hangboardToAdd.hangboard
                        ].image
                      )
                    "
                  />
                </div>
              </div>
              <div class="text-xs-center">
                <p>
                  Hangboard by
                  <a
                    :href="companies[hangboardToAdd.company].website"
                    target="_blank"
                  >
                    {{ companies[hangboardToAdd.company].name }}
                  </a>
                </p>
              </div>
            </v-flex>

            <v-speed-dial bottom right fixed>
              <v-btn
                slot="activator"
                color="secondary"
                fab
                large
                @click="addHangboard"
              >
                <v-icon>mdi-content-save</v-icon>
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
    ...mapState('authentication', ['user', 'hangboardToAdd']),
    ...mapState('companies', ['companies']),
    settingsCompany: {
      get() {
        return this.hangboardToAdd.company
      },
      set(value) {
        this.setCompany(value)
      }
    },
    settingsHangboard: {
      get() {
        return this.hangboardToAdd.hangboard
      },
      set(value) {
        this.setHangboard(value)
      }
    }
  },
  methods: {
    ...mapActions('authentication', [
      'triggerUpdateUser',
      'triggerAddHangboardAction'
    ]),
    ...mapMutations('authentication', [
      'setCompany',
      'setHangboard',
      'resetHangboard'
    ]),
    getImg,
    addHangboard() {
      const exists = this.user.settings.hangboards.some(
        el =>
          el.company === this.hangboardToAdd.company &&
          el.hangboard === this.hangboardToAdd.hangboard
      )
      if (!exists) {
        this.triggerAddHangboardAction()
      }
      this.$router.push('/settings/hangboards/')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
