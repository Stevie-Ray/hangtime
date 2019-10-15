<template>
  <v-layout class="add-hangboard">
    <v-app-bar color="primary" app fixed dark>
      <v-icon @click="$router.push({ name: 'settings-hangboards' })"
        >mdi-arrow-left</v-icon
      >
      <v-toolbar-title>
        Add a hangboard
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex sm8 md6>
            <select-hangboard></select-hangboard>

            <v-speed-dial bottom right fixed>
              <v-btn
                slot="activator"
                color="secondary"
                fab
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
import { mapState, mapActions } from 'vuex'
import SelectHangboard from '@/components/SelectHangboard'

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
  components: { SelectHangboard },
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
