<template>
  <v-layout class="help">
    <v-app-bar color="primary" app fixed dark>
      <v-icon @click="$router.push({ name: 'settings' })">{{
        mdi.arrowLeft
      }}</v-icon>
      <v-toolbar-title>
        Help
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row justify="center" align="start">
          <v-col cols="12">
            <v-subheader>Exercises</v-subheader>

            <v-expansion-panels>
              <v-expansion-panel v-for="option in options" :key="option.id">
                <v-expansion-panel-header>
                  {{ option.name }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  {{ option.description }}
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <v-list>
              <v-list-item
                href="https://www.metoliusclimbing.com/"
                target="_blank"
              >
                <v-list-item-title>Source: Metolius Climbing</v-list-item-title>
              </v-list-item>
              <v-list-item href="mailto:mail@stevie-ray.nl">
                <v-list-item-title>Question? Need help?</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Terms and Privacy Policy</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { mdiArrowLeft } from '@mdi/js'

export default {
  data: () => ({
    mdi: {
      arrowLeft: mdiArrowLeft
    }
  }),
  computed: {
    ...mapState('workouts', ['options'])
  },
  methods: {},
  head: {
    title: {
      inner: 'Help'
    },
    meta: [
      {
        name: 'description',
        content: '',
        id: 'desc'
      }
    ]
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
