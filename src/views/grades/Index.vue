<template>
  <v-layout class="grades">
    <v-app-bar color="primary" app fixed dark>
      <v-icon @click="$router.push({ name: 'workouts' })">{{
        mdi.arrowLeft
      }}</v-icon>
      <v-toolbar-title>
        {{ $t('Grade conversion') }}
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row justify="center" align="start">
          <v-col cols="12">
            <v-col cols="12" md="4">
              <v-select
                v-model="select"
                :items="scale"
                item-text="name"
                item-value="value"
                :label="$t('Grading system')"
                @change="resetOptions"
              ></v-select>
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                v-if="select && select !== 'french'"
                v-model="grade"
                :items="gradeList"
                :label="$t('Select grade')"
              ></v-select>
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                v-if="select && grade"
                v-model="convert"
                :items="scale"
                item-text="name"
                item-value="value"
                :label="$t('Convert to')"
              ></v-select>
            </v-col>

            <v-col v-if="select && grade && convert" cols="12">
              <div class="text-h2">
                {{
                  Object.values(
                    ircra.convert(select, grade).to(convert)
                  ).toString()
                }}
              </div>
            </v-col>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import IRCRA from 'ircra'
import { mdiArrowLeft } from '@mdi/js'

export default {
  data: () => ({
    ircra: new IRCRA(),
    scale: new IRCRA().scale(),
    select: '',
    grade: '',
    convert: '',
    mdi: {
      arrowLeft: mdiArrowLeft
    }
  }),
  head: {
    title: {
      inner: 'Grade converter'
    },
    meta: [
      {
        name: 'description',
        content: '',
        id: 'desc'
      }
    ]
  },
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('app', ['networkOnLine']),
    gradeList() {
      return this.ircra.get(this.select).filter((element) => element != null)
    }
  },
  methods: {
    resetOptions() {
      this.grade = ''
      this.convert = ''
    }
  }
}
</script>
<style lang="scss">
.v-input__icon .v-icon {
  touch-action: manipulation;
}
</style>
