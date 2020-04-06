<template>
  <div>
    <v-list two-line>
      <v-list-item>
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
            <template v-slot:prepend>
              <v-icon color="primary lighten-1">mdi-numeric-1-box</v-icon>
            </template>
          </v-select>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
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
            <template v-slot:prepend>
              <v-icon color="primary lighten-1">mdi-numeric-2-box</v-icon>
            </template>
          </v-select>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-container fluid class="py-0">
      <div
        class="hangboard mx-auto pa-0"
        :class="
          companies[hangboardToAdd.company].hangboards[hangboardToAdd.hangboard]
            .name
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
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8" class="">
          <div class="text-center">
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
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { getImg } from '@/misc/helpers'

export default {
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
    ...mapMutations('authentication', [
      'setCompany',
      'setHangboard',
      'resetHangboard'
    ]),
    getImg
  }
}
</script>
