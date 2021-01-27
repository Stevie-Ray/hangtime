<template>
  <v-dialog v-model="show" width="500">
    <v-card>
      <v-card-title class="text-h5" primary-title>
        {{ $t('Select holds') }}
      </v-card-title>

      <v-card-subtitle>
        {{ $t('Or deselect to use one hand') }}
      </v-card-subtitle>

      <v-card-text>
        <hangboard
          :user="user"
          :data="hangboardData"
          :edit-workout="true"
          @left="setLeft($event)"
          @right="setRight($event)"
          @rotate="setRotate($event)"
        ></hangboard>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="clickAddHangboard">
          {{ $t('Track your progress') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Hangboard from '@/components/atoms/Hangboard/Hangboard'

export default {
  name: 'DialogAddProgress',
  components: { Hangboard },
  props: {
    value: Boolean,
    user: Object
  },
  data: () => ({
    hangboardData: {
      left: 0,
      right: 0,
      rotate: null
    }
  }),
  computed: {
    ...mapGetters('progress', ['statsById', 'bestStatsById']),
    currentStats() {
      if (!this.user) return
      // eslint-disable-next-line consistent-return
      return this.statsById({
        settings: this.user.settings
      })
    },
    show: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    ...mapActions('progress', ['triggerAddHangboardAction']),
    setLeft(event) {
      if (this.hangboardData.left !== event) {
        this.hangboardData.left = event
      } else if (this.hangboardData.right !== null) {
        this.hangboardData.left = null
      }
    },
    setRight(event) {
      if (this.hangboardData.right !== event) {
        this.hangboardData.right = event
      } else if (this.hangboardData.left !== null) {
        this.hangboardData.right = null
      }
    },
    setRotate(event) {
      if (this.hangboardData.rotate !== event) {
        this.hangboardData.rotate = event
      }
    },
    clickAddHangboard() {
      if (!this.user) return
      // eslint-disable-next-line consistent-return
      const progress = this.hangboardData
      const { selected } = this.user.settings
      progress.recordings = []
      progress.hangboard = this.user.settings.hangboards[selected].hangboard
      progress.company = this.user.settings.hangboards[selected].company

      const exists = this.currentStats.some(
        (el) =>
          el.right === this.hangboardData.right &&
          el.left === this.hangboardData.left
      )

      if (!exists) {
        this.triggerAddHangboardAction(progress)

        this.$router.push({
          name: 'progress-list',
          params: {
            data: this.currentStats[this.currentStats.length],
            index: this.currentStats.length,
            userId: this.user.id
          }
        })
      }
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped></style>
