<template>
  <v-container fill-height>
    <v-layout align-center justify-center row>
      <v-flex xs12 style="max-width: 500px;">
        <div class="hangboard" :class="hangboard.name">
          <div class="leftside" @click="toggleLeft">
            <svg-inline
              :class="hangboard.holds[data.left].id"
              :filepath="getImg(hangboard.image)"
            />
          </div>
          <div class="rightside" @click="toggleRight">
            <svg-inline
              :class="hangboard.holds[data.right].id"
              :filepath="getImg(hangboard.image)"
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

<style lang="scss">
.hangboard {
  padding: 0 16px;
  margin: 0 auto;
  max-width: 500px;

  .leftside,
  .rightside {
    display: inline-block;
    width: 50%;
    text-align: right;
  }
  .rightside {
    transform: rotateY(180deg);
  }
}

.simple-svg-wrapper {
  &.h1 #h1,
  &.h2 #h2,
  &.h3 #h3,
  &.h4 #h4,
  &.h5 #h5,
  &.h6 #h6,
  &.h7 #h7,
  &.h8 #h8,
  &.h9 #h9,
  &.h10 #h10,
  &.h11 #h11,
  &.h12 #h12,
  &.h13 #h13,
  &.h14 #h14,
  &.h15 #h15,
  &.h16 #h16,
  &.h17 #h17,
  &.h18 #h18{
    fill: #366d73;
  }
}
</style>
