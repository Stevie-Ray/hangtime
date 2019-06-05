<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <div class="loading">
          <v-progress-circular :size="60" color="primary" indeterminate>
          </v-progress-circular>
          <div class="text-xs-center">
            Loading...
          </div>
        </div>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { mapState } from 'vuex'
import isNil from 'lodash/isNil'

export default {
  computed: mapState('authentication', ['user']),
  watch: {
    user: {
      handler(user) {
        if (user === undefined) return

        if (this.$route.query.redirectUrl === this.$route.path) {
          this.$router.push('/')
        }

        const redirectUrl = isNil(user)
          ? `/login?redirectUrl=${this.$route.query.redirectUrl}`
          : this.$route.query.redirectUrl

        this.$router.push(redirectUrl)
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped></style>
