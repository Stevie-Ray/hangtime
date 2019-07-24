<template>
  <div class="workout-item">
    <v-list-item ripple @click="$emit('goToWorkoutDetails', data.id)">
      <v-list-item-avatar>
        <v-img
          v-if="data.user"
          :src="data.user.photoURL"
          :alt="data.user.displayName"
          aspect-ratio="1"
          class="grey lighten-2"
        />
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>{{ data.name }}</v-list-item-title>
        <v-list-item-subtitle
          >{{ count(data.time) }} - {{ data.description }}</v-list-item-subtitle
        >
      </v-list-item-content>

      <v-list-item-action class="text-right">
        <v-list-item-action-text>
          <span>{{
            gradeConvert(data.user.grade, 'ircra', user.settings.scale)
          }}</span>
          <br />
          <strong v-if="difficultyById(data.level)">
            {{ difficultyById(data.level).name }}
          </strong>
        </v-list-item-action-text>
      </v-list-item-action>
    </v-list-item>

    <v-divider inset></v-divider>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { getImg, count } from '@/misc/helpers'
import gradeConvert from '@/misc/ircra'

export default {
  props: {
    data: Object,
    index: Number
  },
  computed: {
    ...mapState('authentication', ['user']),
    ...mapGetters('workouts', ['difficultyById'])
  },
  methods: {
    getImg,
    count,
    gradeConvert
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
