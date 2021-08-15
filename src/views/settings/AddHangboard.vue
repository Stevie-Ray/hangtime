<template>
  <app-container
    name="Add a Hangboard"
    :back-link="{ path: '/settings' }"
    class="text-center"
  >
    <hangboard-select @image="hangboardImage"></hangboard-select>

    <v-divider class="mb-4" />

    <div class="mt-8">
      {{ $t('Is your hangboard missing?') }}
      <a href="mailto:mail@stevie-ray.nl?subject=Hangboard%20Request">
        {{ $t('Get in touch') }}
      </a>
    </div>

    <v-speed-dial bottom right fixed>
      <v-btn
        slot="activator"
        :disabled="disableButton"
        color="secondary"
        fab
        @click="addHangboard"
      >
        <v-icon>{{ mdi.contentSave }}</v-icon>
      </v-btn>
    </v-speed-dial>
  </app-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mdiContentSave } from '@mdi/js'
import AppContainer from '@/components/molecules/AppContainer/AppContainer'
import HangboardSelect from '@/components/molecules/HangboardSelect/HangboardSelect'

export default {
  components: {
    AppContainer,
    HangboardSelect
  },
  data: () => ({
    disableButton: false,
    mdi: {
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
        (el) =>
          el.company === this.hangboardToAdd.company &&
          el.hangboard === this.hangboardToAdd.hangboard
      )
      if (!exists) {
        this.triggerAddHangboardAction()
      }
      this.$router.push('/settings/hangboards/')
    },
    hangboardImage(value) {
      this.disableButton = value === false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
