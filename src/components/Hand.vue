<template>
  <div class="hand-container">
    <v-row class="hand-text">
      <v-list width="100%">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title v-if="editWorkout"
              >{{ $t('Tap on fingers that are not allowed') }}
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-action v-if="editWorkout" @click="resetHands">
            <v-btn
              v-if="
                (data.leftHand && data.leftHand.length) ||
                  (data.rightHand && data.rightHand.length)
              "
              icon
            >
              <v-icon>{{ mdi.undo }}</v-icon>
            </v-btn>
            <v-btn v-else icon>
              <v-icon>{{ mdi.hand }}</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-row>
    <div class="hand">
      <div class="left-hand" @click="toggleLeft">
        <svg-inline
          v-if="data.left !== null"
          :class="setLeftClass()"
          :custom-class-name="setLeftClass()"
          :src="getImg('icons/hand.svg')"
          width="100%"
        />
      </div>
      <div class="right-hand" @click="toggleRight">
        <svg-inline
          v-if="data.right !== null"
          :class="setRightClass()"
          :custom-class-name="setRightClass()"
          :src="getImg('icons/hand.svg')"
          width="100%"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { SimpleSVG } from 'vue-simple-svg'
import { getImg } from '@/misc/helpers'
import { mdiHand, mdiUndo } from '@mdi/js'

export default {
  components: { 'svg-inline': SimpleSVG },
  props: {
    editWorkout: Boolean,
    data: Object
  },
  data: () => ({
    mdi: {
      undo: mdiUndo,
      hand: mdiHand
    }
  }),
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('companies', ['companies'])
  },
  methods: {
    getImg,
    toggleLeft(e) {
      if (this.editWorkout) {
        const finger = e.target.id
        const n = finger.startsWith('f')

        if (n && finger.length <= 2) {
          const number = parseInt(finger.substr(1), 10)
          let left = []
          if (this.data.leftHand) {
            if (this.data.leftHand.length > 3) return
            left = [...this.data.leftHand]
          }
          left.push(number)
          this.$emit('left', left)
        }
      }
    },
    toggleRight(e) {
      if (this.editWorkout) {
        const finger = e.target.id
        const n = finger.startsWith('f')

        if (n && finger.length <= 2) {
          const number = parseInt(finger.substr(1), 10)
          let right = []
          if (this.data.rightHand) {
            if (this.data.rightHand.length > 3) return
            right = [...this.data.rightHand]
          }
          right.push(number)
          this.$emit('right', right)
        }
      }
    },
    setLeftClass() {
      if (this.data.leftHand) {
        if (this.data.leftHand.length) {
          const left = this.data.leftHand
            .map(finger => {
              return `f${finger}`
            })
            .join(' ')
          return left
        }
        return `f${this.data.leftHand}`
      }
      return ''
    },
    setRightClass() {
      if (this.data.rightHand) {
        if (this.data.rightHand.length) {
          const right = this.data.rightHand
            .map(finger => {
              return `f${finger}`
            })
            .join(' ')

          return right
        }
        return `f${this.data.rightHand}`
      }
      return ''
    },
    resetHands() {
      this.$emit('left', [])
      this.$emit('right', [])
    }
  }
}
</script>

<style lang="scss" scoped>
.hand {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-evenly;
  .left-hand,
  .right-hand {
    width: 50%;
    max-width: 100px;
  }

  .left-hand {
    transform: rotateY(180deg);
  }
}
</style>
