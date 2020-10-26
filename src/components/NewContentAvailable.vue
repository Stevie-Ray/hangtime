<template>
  <v-snackbar v-model="snackbar" :timeout="-1" bottom>
    <div v-if="refreshingApp">
      Loading new content...
    </div>
    <div v-else>
      New content available
    </div>
    <template v-if="!refreshingApp" #action="{ attrs }">
      <v-btn text v-bind="attrs" @click="refesh">
        Refresh
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
