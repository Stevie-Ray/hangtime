<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" style="max-width: 500px;">
        <div class="hangboard" :class="hangboard.name">
          <div class="leftside" @click="toggleLeft">
            <svg-inline
              :class="setLeftClass()"
              :custom-class-name="setLeftClass()"
              :src="getImg(hangboard.image)"
              width="100%"
            />
          </div>
          <div class="rightside" @click="toggleRight">
            <svg-inline
              :class="setRightClass()"
              :custom-class-name="setRightClass()"
              :src="getImg(hangboard.image)"
              width="100%"
            />
          </div>
        </div>
      </v-col>
    </v-row>
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
        const hold = e.target.id
        const n = hold.startsWith('h')

        if (n && hold.length <= 3) {
          const number = parseInt(hold.substr(1), 10) - 1
          this.$emit('left', number)
        }
      }
    },
    toggleRight(e) {
      if (this.editWorkout) {
        const hold = e.target.id
        const n = hold.startsWith('h')

        if (n && hold.length <= 3) {
          const number = parseInt(hold.substr(1), 10) - 1
          this.$emit('right', number)
        }
      }
    },
    setLeftClass() {
      if (this.data.left || this.data.left === 0) {
        return `h${(this.data.left + 1).toString()}`
      }
      return ''
    },
    setRightClass() {
      if (this.data.right || this.data.right === 0) {
        return `h${(this.data.right + 1).toString()}`
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped></style>
