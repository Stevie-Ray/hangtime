<template>
  <v-main>
    <v-row align="center" justify="center" class="fill-height" no-gutters>
      <v-col cols="12">
        <div class="loading text-center">
          <v-progress-circular :size="60" color="primary" indeterminate>
          </v-progress-circular>
          <div class="pt-4">
            {{ $t('Loading...') }}
          </div>
        </div>
      </v-col>
    </v-row>
    <v-alert v-if="error" type="error">{{ error }}</v-alert>
  </v-main>
</template>

<script>
import { mapState } from 'vuex'
import isNil from 'lodash/isNil'

export default {
  head: {
    title: {
      inner: 'Checking Login'
    },
    meta: [
      {
        name: 'description',
        content: 'Check if user is logged in',
        id: 'desc'
      }
    ]
  },
  computed: mapState('authentication', ['user', 'error']),
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

<style lang="scss" scoped>
.v-alert {
  position: fixed;
  bottom: 8px;
  left: 8px;
  right: 8px;
}
</style>
