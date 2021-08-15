<template>
  <app-container name="Hangboards" :back-link="{ path: '/settings' }">
    <div v-for="(item, index) in user.settings['hangboards']" :key="index">
      <v-card flat class="mb-2">
        <v-container fluid class="py-0">
          <v-row>
            <v-col cols="12">
              <div class="hangboard mt-4">
                <div class="leftside">
                  <v-img
                    :src="
                      getImg(
                        companies[item.company].hangboards[item.hangboard].image
                      )
                    "
                  />
                </div>
                <div class="rightside">
                  <v-img
                    :src="
                      getImg(
                        companies[item.company].hangboards[item.hangboard].image
                      )
                    "
                  />
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>

        <v-card-title primary-title>
          <div class="text-center">
            <h3 class="text-h5">
              {{ companies[item.company].name }}
              {{ companies[item.company].hangboards[item.hangboard].name }}
            </h3>
          </div>
        </v-card-title>

        <v-card-actions>
          <v-btn v-if="user.settings.selected === index" text disabled>
            {{ $t('Selected') }}
          </v-btn>
          <v-btn v-else text @click="triggerChangeHangboardAction(index)">
            {{ $t('Select') }}
          </v-btn>
          <v-btn
            v-if="user.settings.selected !== index"
            text
            color="primary"
            @click="triggerRemoveHangboardAction(index)"
          >
            {{ $t('Delete') }}
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>

      <v-divider></v-divider>
    </div>
    <v-speed-dial bottom right fixed>
      <v-btn
        slot="activator"
        color="secondary"
        dark
        fab
        to="/settings/hangboards/add"
      >
        <v-icon>{{ mdi.plus }}</v-icon>
      </v-btn>
    </v-speed-dial>
  </app-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mdiPlus } from '@mdi/js'
import AppContainer from '@/components/molecules/AppContainer/AppContainer'
import { getImg } from '@/misc/helpers'

export default {
  components: {
    AppContainer
  },
  data: () => ({
    mdi: {
      plus: mdiPlus
    }
  }),
  head: {
    title: {
      inner: 'Your Hangboards'
    },
    meta: [
      {
        name: 'description',
        content: 'Manage your hangboards',
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
      'triggerChangeHangboardAction',
      'triggerRemoveHangboardAction'
    ]),
    getImg
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
