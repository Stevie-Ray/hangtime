<template>
  <v-dialog v-model="dialog" width="500">
    <v-card class="modal-wrapper">
      <v-card-title class="headline" primary-title>
        <v-img
          class="app-logo"
          contain
          max-height="40px"
          max-width="40px"
          :src="getImg('logo.svg')"
        />

        Install HangTime
      </v-card-title>

      <v-card-text>
        <p class="description">
          Install this application to your home screen for quickly and easy
          access when you're on the go.
        </p>
        <p class="footer">
          Just tap <v-icon class="mx-2">mdi-open-in-app</v-icon> then '<strong
            >Add to Home Screen</strong
          >'
        </p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('close')">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { getImg } from '@/misc/helpers'

export default {
  data: () => ({
    dialog: true
  }),
  methods: {
    getImg
  }
}
</script>

<style lang="scss" scoped>
.modal-wrapper {
  .headline {
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
