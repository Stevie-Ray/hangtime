<template>
  <v-dialog v-model="dialog" width="500">
    <v-card class="modal-wrapper">
      <v-card-title>
        <v-img
          class="app-logo"
          contain
          max-height="40px"
          max-width="40px"
          :src="getImg('logo.svg')"
        />
        {{ $t('Install {appTitle}', { appTitle: appTitle }) }}
      </v-card-title>

      <v-card-text>
        <p class="description">
          {{
            $t(
              "Install this application to your home screen for quick and easy access when you're on the go"
            )
          }}
        </p>
        <p class="footer">
          Just tap <v-icon class="mx-2">{{ mdi.openInApp }}</v-icon> then
          '<strong>{{ $t('Add to Home Screen') }}</strong
          >'
        </p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('close')">
          {{ $t('Close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { getImg } from '@/misc/helpers'
import { mdiOpenInApp } from '@mdi/js'

export default {
  data: () => ({
    dialog: true,
    mdi: {
      openInApp: mdiOpenInApp
    }
  }),
  computed: {
    ...mapState('app', ['appTitle'])
  },
  methods: {
    getImg
  }
}
</script>

<style lang="scss" scoped>
.modal-wrapper {
  .text-h5 {
    display: flex;
    /*justify-content: center;*/
    align-items: center;
  }

  .app-logo {
    max-width: 50px;
    margin-right: 10px;
  }

  .footer {
    display: flex;
    /*justify-content: center;*/
    align-items: flex-end;
    /*font-size: 12px;*/

    .apple-navigation-action-img {
      max-width: 15px;
      margin: 0 10px;
    }
  }
}
</style>
