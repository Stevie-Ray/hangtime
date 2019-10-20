<template>
  <v-dialog v-model="show" width="500">
    <v-card>
      <v-card-title class="headline mb-0">Switch hangboard</v-card-title>

      <v-card-text>
        <v-radio-group
          v-if="user"
          v-model="hangboardSelected"
          column
          class="mt-0"
        >
          <v-radio
            v-for="(item, index) in user.settings.hangboards"
            :key="index"
            :value="index"
            @change="changeHangboard(index)"
          >
            <template v-slot:label>
              <div>
                {{ companies[item.company].name }} -
                {{ companies[item.company].hangboards[item.hangboard].name }}
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import { getImg } from '@/misc/helpers'

export default {
  props: {
    value: Boolean
  },
  data: () => ({}),
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('companies', ['companies']),
    show: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    hangboardSelected: {
      get() {
        return this.user.settings.selected
      },
      set(value) {
        this.setSelected(value)
      }
    }
  },
  methods: {
    ...mapActions('authentication', [
      'triggerUpdateUser',
      'triggerSwitchHangboard'
    ]),
    ...mapMutations('authentication', ['setSelected']),
    changeHangboard(index) {
      this.setSelected(index)
      this.triggerUpdateUser()
      this.triggerSwitchHangboard()
    },
    getImg
  }
}
</script>

<style lang="scss" scoped></style>
