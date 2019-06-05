<template>
  <div class="workout-item">
    <v-list-item ripple @click="$emit('goToWorkoutDetails', data.id)">
      <!-- TODO: get actual workout user -->
      <v-list-item-avatar v-if="user">
        <v-img
          :src="user.photoURL"
          :alt="user.displayName"
          aspect-ratio="1"
          class="grey lighten-2"
        />
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>{{ data.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ data.description }}</v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-action>
        <v-list-item-action-text>{{
          count(data.time)
        }}</v-list-item-action-text>
      </v-list-item-action>
    </v-list-item>

    <v-divider inset></v-divider>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getImg, count } from '@/misc/helpers'

export default {
  props: {
    data: Object,
    index: Number
  },
  computed: {
    ...mapState('authentication', ['user'])
  },
  methods: {
    getImg,
    count
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
