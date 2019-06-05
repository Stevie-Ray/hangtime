<template>
  <v-snackbar v-model="snackbar" timeout bottom>
    <template v-if="refreshingApp">
      Loading new content...
    </template>
    <template v-else>
      New content available
      <v-btn flat @click="refesh">
        refesh
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  props: {
    refreshingApp: Boolean
  },
  data: () => ({
    snackbar: true
  }),
  methods: {
    refesh() {
      this.$emit('refresh')
      this.snackbar = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
