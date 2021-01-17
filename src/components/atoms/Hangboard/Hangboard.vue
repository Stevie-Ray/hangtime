<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" style="max-width: 500px;">
        <div
          v-if="hangboard"
          class="hangboard"
          :class="hangboard.name"
          style="position: relative"
        >
          <v-btn
            v-if="editWorkout && hangboard.sides && hangboard.sides.length"
            style="position: absolute; right: -15px; top: -15px; z-index: 10"
            fab
            color="primary"
            x-small
            @click="nextImage"
          >
            <v-icon>
              {{ mdi.formatRotate90 }}
            </v-icon>
          </v-btn>
          <div class="leftside" @click="toggleLeft">
            <svg-inline
              :class="setLeftClass()"
              :custom-class-name="setLeftClass()"
              :src="getHangboardImage()"
              width="100%"
            />
          </div>
          <div class="rightside" @click="toggleRight">
            <svg-inline
              :class="setRightClass()"
              :custom-class-name="setRightClass()"
              :src="getHangboardImage()"
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
import { mdiFormatRotate90 } from '@mdi/js'
import { getImg } from '@/misc/helpers'

export default {
  components: { 'svg-inline': SimpleSVG },
  props: {
    user: Object,
    data: Object,
    editWorkout: Boolean
  },
  data: () => ({
    mdi: {
      formatRotate90: mdiFormatRotate90
    }
  }),
  computed: {
    ...mapState('companies', ['companies']),
    hangboard() {
      if (!this.user) return
      // eslint-disable-next-line consistent-return
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
    },
    getHangboardImage() {
      if (this.hangboard.sides && this.hangboard.sides.length) {
        if (this.data.rotate) {
          return this.getImg(this.hangboard.sides[this.data.rotate].image)
        }
        return this.getImg(this.hangboard.sides[0].image)
      }
      return this.getImg(this.hangboard.image)
    },
    nextImage() {
      if (this.data.rotate === undefined) {
        this.$emit('rotate', 1)
      } else if (this.data.rotate + 1 !== this.hangboard.sides.length) {
        this.$emit('rotate', this.data.rotate + 1)
      } else {
        this.$emit('rotate', 0)
      }
    }
  }
}
</script>

<style lang="scss"></style>
