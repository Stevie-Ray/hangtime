<template>
  <v-layout row>
    <v-flex>
      <!--      <v-subheader>-->
      <!--        {{ companies[user.settings.hangboards[user.settings.selected].company].name }}-->
      <!--        {{ companies[user.settings.hangboards[user.settings.selected].company-->
      <!--        ].hangboards[user.settings.hangboards[user.settings.selected].hangboard].name }}-->
      <!--      </v-subheader>-->

      <v-list two-line>
        <span v-for="(option, index) in options" :key="index">
          <v-list-item
            @click="
              $router.push({
                name: 'progress-type',
                params: { type: encodeUrl(option.name), id: option.id }
              })
            "
          >
            <v-list-item-avatar>
              <img :alt="option.name" :src="getImg(option.image)" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title> {{ option.name }}</v-list-item-title>
              <v-list-item-subtitle></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text>
                <span v-if="option.configurable">
                  0x
                </span>
                <span v-else>
                  {{ count(0) }}
                </span>
              </v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>
          <v-divider inset></v-divider>
        </span>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { getImg, count } from '@/misc/helpers'

export default {
  head: {
    title: {
      inner: 'Progress'
    },
    meta: [
      {
        name: 'description',
        content: 'Measure strength and become a better climber',
        id: 'desc'
      }
    ]
  },
  components: {},
  data: () => ({
    type: 'hangtime'
  }),
  computed: {
    ...mapState('authentication', ['user', 'stats']),
    ...mapState('exercises', ['options']),
    ...mapState('app', ['networkOnLine']),
    ...mapState('companies', ['companies'])
  },
  methods: {
    getImg,
    count,
    encodeUrl(url) {
      return url
        .toString() // Convert to string
        .normalize('NFD') // Change diacritics
        .replace(/[\u0300-\u036f]/g, '') // Remove illegal characters
        .replace(/\s+/g, '-') // Change whitespace to dashes
        .toLowerCase() // Change to lowercase
        .replace(/&/g, '-and-') // Replace ampersand
        .replace(/[^\-a-z0-9]/g, '') // Remove anything that is not a letter, number or dash
        .replace(/-+/g, '-') // Remove duplicate dashes
        .replace(/^-*/, '') // Remove starting dashes
        .replace(/-*$/, '') // Remove trailing dashes
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
</style>
