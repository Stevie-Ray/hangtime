<template>
  <v-dialog v-model="show" height="250" width="250">
    <v-card>
      <v-img
        height="250"
        width="250"
        :src="data.user.photoURL"
        :alt="data.user.displayName"
      >
        <v-row
          justify="space-between"
          class="fill-height flex-column flex-grow-0"
        >
          <v-col class="pt-0">
            <v-list-item
              color="rgba(0, 0, 0, .4)"
              dark
              dense
              style="background-color: rgba(0, 0, 0, .5)"
            >
              <v-list-item-content class="py-0">
                <v-list-item-title class="subtitle-1">{{
                  data.user.displayName
                }}</v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn
                  icon
                  @click="
                    $router.push({
                      path: `/profile/${data.user.id}`
                    })
                  "
                >
                  <v-icon>mdi-information-outline</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-col>
        </v-row>
      </v-img>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import IRCRA from 'ircra'

export default {
  props: {
    value: Boolean,
    data: Object
  },
  data: () => ({
    ircra: new IRCRA()
  }),
  computed: {
    ...mapState('authentication', ['user']),
    show: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped></style>
