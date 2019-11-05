<template>
  <v-container fill-height>
    <v-layout align-center justify-center row>
      <v-flex xs12 style="max-width: 500px;">
        <div class="hangboard" :class="hangboard.name">
          <div class="leftside" @click="toggleLeft">
            <svg-inline
              :class="hangboard.holds[data.left].id"
              :custom-class-name="hangboard.holds[data.left].id"
              :src="getImg(hangboard.image)"
              width="100%"
            />
          </div>
          <div class="rightside" @click="toggleRight">
            <svg-inline
              :class="hangboard.holds[data.right].id"
              :custom-class-name="hangboard.holds[data.right].id"
              :src="getImg(hangboard.image)"
              width="100%"
            />
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import { SimpleSVG } from 'vue-simple-svg'
import { getImg } from '@/misc/helpers'

export default {
  components: { 'svg-inline': SimpleSVG },
  props: {
    data: Object,
    editWorkout: Boolean
  },
  data: () => ({}),
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('companies', ['companies']),
    hangboard() {
      return this.companies[
        this.user.settings.hangboards[this.user.settings.selected].company
      ].hangboards[
        this.user.settings.hangboards[this.user.settings.selected].hangboard
      ]
    }
  },
  methods: {
    getImg,
    toggleLeft(e) {
      if (this.editWorkout) {
        const clicked = this.hangboard.holds.find(
          hold => hold.id === e.target.id
        )
        if (clicked) {
          this.$emit('left', clicked.class)
        }
      }
    },
    toggleRight(e) {
      if (this.editWorkout) {
        const clicked = this.hangboard.holds.find(
          hold => hold.id === e.target.id
        )
        if (clicked) {
          this.$emit('right', clicked.class)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
