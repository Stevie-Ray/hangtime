<template>
  <app-container name="Grades" :back-link="{ name: 'workouts' }">
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
        {{ Object.values(ircra.convert(select, grade).to(convert)).toString() }}
      </div>
    </v-col>
  </app-container>
</template>

<script>
import { mapState } from 'vuex'
import IRCRA from 'ircra'
import AppContainer from '@/components/molecules/AppContainer/AppContainer'

export default {
  components: {
    AppContainer
  },
  data: () => ({
    ircra: new IRCRA(),
    scale: new IRCRA().scale(),
    select: '',
    grade: '',
    convert: ''
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
