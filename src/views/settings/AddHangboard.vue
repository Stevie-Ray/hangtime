<template>
  <v-layout class="add-hangboard">
    <v-app-bar color="primary" app fixed dark>
      <v-icon @click="$router.push({ name: 'settings-hangboards' })">{{
        mdi.arrowLeft
      }}</v-icon>
      <v-toolbar-title>
        Add a hangboard
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row justify="center" align="start">
          <v-col cols="12">
            <hangboard-select></hangboard-select>

            <v-speed-dial bottom right fixed>
              <v-btn
                slot="activator"
                color="secondary"
                fab
                @click="addHangboard"
              >
                <v-icon>{{ mdi.contentSave }}</v-icon>
              </v-btn>
            </v-speed-dial>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import HangboardSelect from '@/components/HangboardSelect'
import { mdiArrowLeft, mdiContentSave } from '@mdi/js'

export default {
  components: { HangboardSelect },
  data: () => ({
    mdi: {
      arrowLeft: mdiArrowLeft,
      contentSave: mdiContentSave
    }
  }),
  head: {
    title: {
      inner: 'Add Hangboard'
    },
    meta: [
      {
        name: 'description',
        content: 'Add a new hangboard to use',
        id: 'desc'
      }
    ]
  },
  computed: {
    ...mapState('app', ['networkOnLine']),
    ...mapState('authentication', ['user', 'hangboardToAdd'])
  },
  methods: {
    ...mapActions('authentication', ['triggerAddHangboardAction']),
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
