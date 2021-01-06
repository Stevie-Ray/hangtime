<template>
  <v-layout v-resize="onResize" class="leaderboard">
    <v-app-bar color="primary" app fixed dark>
      <v-icon @click="$router.push({ name: 'workouts' })">{{
        mdi.arrowLeft
      }}</v-icon>
      <v-toolbar-title>
        {{ $t('Leaderboard') }}
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row v-if="leaderboard" justify="center" align="start">
          <div class="text-center pa-4">
            <v-btn-toggle v-model="sort" mandatory @change="jumpToSelection">
              <v-btn value="amount">
                {{ $t('Amount') }}
              </v-btn>

              <v-btn value="hold">
                {{ $t('Hangboarding') }}
              </v-btn>

              <v-btn value="time">
                {{ $t('Time') }}
              </v-btn>
            </v-btn-toggle>
          </div>

          <v-col cols="12">
            <!-- data table -->
            <v-data-table
              :height="windowSize.y - 220"
              :headers="computedHeaders"
              :sort-by.sync="sort"
              sort-desc
              :items="leaderboard"
              :items-per-page="itemsPerPage"
              :total-visible="5"
              class="elevation-1"
              :page.sync="page"
              :options.sync="options"
              hide-default-header
              hide-default-footer
              @page-count="pageCount = $event"
            >
              <!-- eslint-disable-next-line vue/valid-v-slot -->
              <template #header="{ props: { headers } }">
                <thead class="v-data-table-header">
                  <tr>
                    <th
                      v-for="header in headers"
                      :key="header.value"
                      scope="col"
                    >
                      <strong v-if="header.value === sort">
                        {{ $t(header.text) }}
                      </strong>
                      <span v-else>
                        {{ $t(header.text) }}
                      </span>
                    </th>
                  </tr>
                </thead>
              </template>
              <template #item="{ item, index }">
                <tr
                  class="table-row"
                  :class="{
                    'grey lighten-3': selected && selected.id === item.id
                  }"
                >
                  <td>
                    <v-row align="center" justify="center">
                      <v-col cols="2" class="text-right">
                        {{
                          (options.page - 1) * options.itemsPerPage + index + 1
                        }}
                      </v-col>
                      <v-col cols="2">
                        <v-avatar
                          aspect-ratio="1"
                          class="grey lighten-2"
                          size="32"
                          @click.stop="dialogs.user = true"
                          @click="selectedItem = item"
                        >
                          <img
                            v-if="item.photoURL"
                            :src="item.photoURL"
                            :alt="item.displayName"
                          />
                        </v-avatar>
                      </v-col>
                      <v-col cols="8">
                        {{ item.displayName }}
                      </v-col>
                    </v-row>
                  </td>
                  <td v-if="showData('amount')">
                    {{ item.completed.amount }}
                  </td>
                  <td v-if="showData('hold')">
                    {{ count(item.completed.hold) }}
                  </td>
                  <td v-if="showData('time')">
                    {{ count(item.completed.time) }}
                  </td>
                </tr>
              </template>
            </v-data-table>

            <div class="text-center pt-4">
              <v-pagination
                v-model="page"
                :length="pageCount"
                :total-visible="5"
              ></v-pagination>
            </div>
          </v-col>
        </v-row>
        <v-row v-else class="text-center pt-4" justify="center" align="center">
          <v-col cols="12" sm="8" md="6">
            {{ $t('Loading...') }}
          </v-col>
        </v-row>
      </v-container>

      <dialog-user-image
        v-if="selectedItem"
        v-model="dialogs.user"
        :data="selectedItem"
      ></dialog-user-image>
    </v-main>
  </v-layout>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import { mdiArrowLeft } from '@mdi/js'
import { count } from '@/misc/helpers'
import DialogUserImage from '@/components/DialogUserImage'

export default {
  components: {
    DialogUserImage
  },
  data: () => ({
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    selectedItem: null,
    options: {},
    sort: 'amount',
    dialogs: {
      user: false
    },
    windowSize: {
      x: 0,
      y: 0
    },
    tableHeaders: [
      {
        text: '',
        align: 'start',
        sortable: false,
        value: 'displayName'
      },
      { text: 'Workouts done', value: 'amount' },
      { text: 'Total time hangboarding', value: 'hold' },
      { text: 'Total time worked out', value: 'time' }
    ],
    mdi: {
      arrowLeft: mdiArrowLeft
    }
  }),
  head: {
    title: {
      inner: 'Leaderboard'
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
    ...mapActions('workouts', ['getLeaderboard']),
    ...mapState('app', ['networkOnLine']),
    ...mapState('workouts', ['leaderboard']),
    ...mapState('authentication', ['user']),
    computedHeaders() {
      if (this.$vuetify.breakpoint.name === 'xs') {
        return this.tableHeaders.filter(
          item => item.value === this.sort || item.value === 'displayName'
        )
      }
      return this.tableHeaders
    },
    selected() {
      if (!this.leaderboard) return
      // eslint-disable-next-line consistent-return
      return this.leaderboard.find(user => user.id === this.user.id)
    }
  },
  watch: {
    selected(newObj, oldObj) {
      if (newObj !== oldObj) {
        this.jumpToSelection()
      }
    }
  },
  mounted() {
    if (!this.leaderboard) {
      // eslint-disable-next-line no-unused-expressions
      this.getLeaderboard
    }
    this.jumpToSelection()
  },
  methods: {
    ...mapMutations('workouts', ['customSort']),
    count,
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight }
    },
    jumpToSelection() {
      if (this.leaderboard) {
        this.customSort(this.sort)
        this.page = Math.ceil(
          (this.leaderboard.indexOf(this.selected) + 1) / this.itemsPerPage
        )
      }
    },
    showData(element) {
      return this.computedHeaders.some(e => e.value === element)
    }
  }
}
</script>

<style lang="scss">
@import '~vuetify/src/styles/settings/_variables';

.table-row:hover {
  background: inherit !important;
}
@media #{map-get($display-breakpoints, 'xs-only')} {
  .v-data-table__wrapper {
    .v-data-table-header {
      th {
        position: relative;
        strong {
          position: absolute;
          white-space: nowrap;
          right: 15px;
          top: 5px;
        }
      }
    }
    tbody > tr > td:last-child {
      text-align: right !important;
      width: 100px;
    }
  }
}
</style>
