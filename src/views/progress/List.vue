<template>
  <v-layout class="progress-list">
    <v-app-bar color="primary" app dark fixed>
      <v-icon @click="$router.push({ path: currentTab })">{{
        mdi.arrowLeft
      }}</v-icon>
      <v-toolbar-title>
        {{ $t('Your progress') }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <span v-if="currentStats[index] && currentStats[index].recordings.length">
        <v-btn v-if="edit" icon @click="edit = false">
          <v-icon>{{ mdi.pencilOff }}</v-icon>
        </v-btn>
        <v-btn v-if="!edit" icon @click="edit = true">
          <v-icon>{{ mdi.pencil }}</v-icon>
        </v-btn>
      </span>

      <v-btn
        v-if="currentStats[index] && currentStats[index].recordings.length"
        icon
        @click="filterDialog = true"
      >
        <v-icon>{{ mdi.tune }}</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-row justify="center" align="start" class="fill-height">
          <v-col cols="12" sm="8" md="6">
            <v-container
              v-if="
                currentStats[index] && !currentStats[index].recordings.length
              "
            >
              <v-row justify="center" align="center">
                <v-avatar aspect-ratio="1" class="grey lighten-2" size="164">
                  <img src="@/assets/sloth/sleepy.svg" alt="sloth sleepy" />
                </v-avatar>
              </v-row>
              <v-row>
                <v-card flat>
                  <v-card-title>
                    {{ $t('No recordings added yet') }}
                  </v-card-title>
                  <v-card-subtitle>
                    {{
                      $t('Start recording your progress using the below button')
                    }}
                  </v-card-subtitle>
                </v-card>
              </v-row>
            </v-container>
            <v-container
              v-if="
                currentStats[index] && currentStats[index].recordings.length
              "
            >
              <v-row>
                <v-col cols="12">
                  <line-chart
                    :chart-data="chartData"
                    :height="300"
                    class="justify-center d-flex"
                  ></line-chart>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
          <v-col cols="12">
            <hangboard
              v-if="currentStats[index]"
              :data="currentStats[index]"
              :edit-workout="false"
            ></hangboard>
            <v-list
              v-if="
                currentStats[index] &&
                  currentStats[index]['recordings'].length > 0
              "
              two-line
            >
              <span v-for="(recording, item) in filteredRecordings" :key="item">
                <v-list-item>
                  <v-list-item-avatar>
                    <v-img
                      v-if="grip[returnType(recording.type)]"
                      :src="getImg(grip[returnType(recording.type)].image)"
                      :alt="grip[returnType(recording.type)].name"
                      aspect-ratio="1"
                      class="grey lighten-2"
                    />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title
                      v-if="
                        currentStats[index] &&
                          currentStats[index]['recordings'].length
                      "
                    >
                      <span>Max </span>
                      <span
                        v-if="
                          (currentStats[index] &&
                            currentStats[index].left === null) ||
                            (currentStats[index] &&
                              currentStats[index].right === null)
                        "
                        >{{ $t('One Arm') }}
                      </span>
                      <span v-if="grip[returnType(recording.type)]">
                        {{ grip[returnType(recording.type)].name }}
                      </span>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ recording.label }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text>
                      <span>
                        {{ count(recording.value) }}
                      </span>
                      <v-icon v-if="edit" @click="deleteRecording(recording)">
                        {{ mdi.delete }}
                      </v-icon>
                    </v-list-item-action-text>
                  </v-list-item-action>
                </v-list-item>
                <v-divider inset></v-divider>
              </span>
            </v-list>
          </v-col>
        </v-row>
      </v-container>

      <v-dialog v-model="filterDialog" max-width="500">
        <v-card>
          <v-card-title class="text-h5">{{
            $t('Filter your recordings')
          }}</v-card-title>

          <v-card-text>
            <v-container fluid>
              <v-checkbox
                v-for="option in grip"
                :key="option.id"
                v-model="selected"
                :label="option.name"
                :value="option.id"
                hide-details="auto"
              ></v-checkbox>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text @click="filterDialog = false">
              {{ $t('Close') }}
            </v-btn>

            <v-btn color="primary" text @click="filterDialog = false">
              {{ $t('Save') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="selectTypeDialog" max-width="500">
        <v-card>
          <v-card-title class="text-h5">{{
            $t('What do you want to do?')
          }}</v-card-title>
          <v-card-text>
            <v-container fluid>
              <v-radio-group v-if="currentStats[index]" v-model="workoutType">
                <v-radio
                  v-for="option in grip"
                  :key="option.id"
                  :value="option.id"
                >
                  <template #label>
                    <div>
                      <span>{{ $t('Max.') }} </span>
                      <span
                        v-if="
                          (currentStats[index] &&
                            currentStats[index].left === null) ||
                            (currentStats[index] &&
                              currentStats[index].right === null)
                        "
                        >{{ $t('One Arm') }}
                      </span>
                      <span>{{ option.name }}</span>
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>
            </v-container>
            <div
              v-if="
                (currentStats[index] && currentStats[index].left === null) ||
                  (currentStats[index] && currentStats[index].right === null)
              "
              class="text-subtitle-2"
            >
              {{
                $t(
                  'Warning: Make sure you know what you are doing and be properly warmed up before doing one-arm hangs'
                )
              }}
            </div>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text @click="selectTypeDialog = false">
              {{ $t('Close') }}
            </v-btn>

            <v-btn color="primary" text @click="goToRecord">
              {{ $t('Start') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-if="deleteDialogItem" v-model="deleteDialog" max-width="500">
        <v-card>
          <v-card-title class="text-h5">{{
            $t('Delete recording')
          }}</v-card-title>

          <v-card-text>
            <v-container fluid>
              Are you sure you want to delete this
              <strong>
                {{ $t('Max.') }}
                {{ grio[returnType(deleteDialogItem.type)].name }}</strong
              >
              recording of
              <strong>{{ count(deleteDialogItem.value) }}</strong
              >? This can not be undone.
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text @click="deleteDialog = false">
              {{ $t('Close') }}
            </v-btn>

            <v-btn
              color="primary"
              text
              @click="deteleRecordingAction(deleteDialogItem)"
            >
              {{ $t('Delete') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-fab-transition>
        <v-btn
          slot="activator"
          color="secondary"
          dark
          fab
          bottom
          right
          fixed
          @click="selectTypeDialog = true"
        >
          <v-icon>{{ mdi.timer }}</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-main>
  </v-layout>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import Hangboard from '@/components/Hangboard'
import LineChart from '@/components/LineChart'
import { getImg, count, shortDate } from '@/misc/helpers'
import {
  mdiPencil,
  mdiPencilOff,
  mdiArrowLeft,
  mdiTimer,
  mdiTune,
  mdiDelete
} from '@mdi/js'

export default {
  components: { Hangboard, LineChart },
  props: {
    data: Object,
    index: Number
  },
  data: () => ({
    tab: null,
    filterDialog: false,
    selectTypeDialog: false,
    deleteDialog: false,
    deleteDialogItem: null,
    selected: [0, 1, 2, 3],
    workoutType: 0,
    edit: false,
    mdi: {
      pencil: mdiPencil,
      pencilOff: mdiPencilOff,
      arrowLeft: mdiArrowLeft,
      timer: mdiTimer,
      tune: mdiTune,
      delete: mdiDelete
    }
  }),
  head: {
    title: {
      inner: 'Record'
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
    ...mapState('app', ['networkOnLine', 'currentTab']),
    ...mapState('workouts', ['grip']),
    ...mapGetters('progress', ['statsById']),
    ...mapGetters('workouts', ['gripById']),
    binding() {
      const binding = {}

      if (this.$vuetify.breakpoint.xs) binding.column = true

      return binding
    },
    currentStats() {
      const data = this.statsById({
        // type: this.currentType.id,
        settings: this.user.settings
      })
      return data
    },
    filteredRecordings() {
      if (
        !this.currentStats[this.index] &&
        !this.currentStats[this.index].recordings.length
      )
        return
      // eslint-disable-next-line consistent-return
      return this.currentStats[this.index].recordings.filter(recording => {
        return this.selected.includes(this.returnType(recording.type))
      })
    },
    chartData() {
      if (!this.currentStatsValue && !this.currentStatsLabels) return {}
      // eslint-disable-next-line func-names
      const filtered = this.grip.filter(function(e) {
        return this.indexOf(e.id) >= 0
      }, this.selected)
      const datasets = []
      const self = this
      filtered.forEach(option => {
        const data = self.currentStatsValue(option.id)
        datasets.push({
          label: option.name,
          backgroundColor: option.color,
          borderColor: option.border,
          data
        })
      })
      // eslint-disable-next-line consistent-return
      return {
        datasets
      }
    }
  },
  methods: {
    getImg,
    count,
    shortDate,
    ...mapActions('progress', ['deleteUserProgress']),
    currentStatsValue(index) {
      if (
        !this.currentStats[this.index] &&
        !this.currentStats[this.index].recordings.length
      ) {
        return
      }
      // eslint-disable-next-line consistent-return
      return this.currentStats[this.index].recordings
        .filter(recording => this.returnType(recording.type) === index)
        .map(obj => {
          let date = obj.createTimestamp
          if (date && date.seconds) {
            date = new Date(date.seconds * 1000)
          }
          return { y: obj.value, t: date }
        })
    },
    currentStatsLabels() {
      if (
        !this.currentStats[this.index] ||
        !this.currentStats[this.index].recordings.length
      ) {
        return
      }
      // eslint-disable-next-line consistent-return
      return this.currentStats[this.index].recordings.map(a => a.label)
    },
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
    },
    /**
     * Fallback for older versions @TODO: remove in the future
     * @param type
     * @returns {number|*}
     */
    returnType(type) {
      if (type !== undefined) return type
      return 0
    },
    deleteRecording(recording) {
      this.deleteDialogItem = recording
      this.deleteDialog = true
    },
    deteleRecordingAction(recordingIndex) {
      if (
        !this.currentStats[this.index] &&
        !this.currentStats[this.index].recordings.length
      )
        return
      this.deleteUserProgress({
        recordingIndex,
        id: this.currentStats[this.index].id,
        item: this.deleteDialogItem,
        recording: this.currentStats[this.index]
      })
      this.deleteDialog = false
    },
    goToRecord() {
      this.selectTypeDialog = false
      this.$router.push({
        name: 'progress-record',
        params: {
          data: this.data,
          index: this.index,
          id: this.workoutType
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
