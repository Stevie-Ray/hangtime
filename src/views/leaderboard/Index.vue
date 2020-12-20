<template>
  <v-layout class="grades">
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
            <v-btn-toggle v-model="sort">
              <v-btn value="completed.amount">
                {{ $t('Amount') }}
              </v-btn>

              <v-btn value="completed.hold">
                {{ $t('Hangboarding') }}
              </v-btn>

              <v-btn value="completed.time">
                {{ $t('Time') }}
              </v-btn>
            </v-btn-toggle>
          </div>

          <v-col cols="12">
            <!-- data table -->
            <v-data-table
              :headers="tableHeaders"
              :sort-by.sync="sort"
              sort-desc
              :items="leaderboard"
              :items-per-page="10"
              :total-visible="5"
              class="elevation-1"
              :page.sync="page"
              hide-default-header
              hide-default-footer
              mobile-breakpoint="0"
              calculate-widths
              dense
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
              <!-- eslint-disable-next-line vue/valid-v-slot -->
              <template #item.displayName="{ item }">
                <v-row align="center" justify="center">
                  <v-col cols="4">
                    <v-avatar
                      aspect-ratio="1"
                      class="grey lighten-2"
                      size="32"
                      @click.stop="dialogs.user = true"
                      @click="selectedItem = item"
                    >
                      <img :src="item.photoURL" :alt="item.displayName" />
                    </v-avatar>
                  </v-col>
                  <v-col cols="8">
                    {{ item.displayName }}
                  </v-col>
                </v-row>
              </template>
              <!-- eslint-disable-next-line vue/valid-v-slot -->
              <template #item.completed.hold="{ item }">
                {{ count(item.completed.hold) }}
              </template>
              <!-- eslint-disable-next-line vue/valid-v-slot -->
              <template #item.completed.time="{ item }">
                {{ count(item.completed.time) }}
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
import { mapActions, mapState } from 'vuex'
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
    selectedItem: null,
    sort: 'completed.amount',
    dialogs: {
      user: false
    },
    tableHeaders: [
      {
        text: '',
        align: 'start',
        sortable: false,
        value: 'displayName'
      },
      { text: 'Workouts done', value: 'completed.amount' },
      { text: 'Total time hangboarding', value: 'completed.hold' },
      { text: 'Total time worked out', value: 'completed.time' }
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
    getData() {
      return this.leaderboard
    }
  },
  mounted() {
    if (!this.leaderboard) {
      // eslint-disable-next-line no-unused-expressions
      this.getLeaderboard
    }
  },
  methods: {
    count
  }
}
</script>

<style lang="scss">
@import '~vuetify/src/styles/settings/_variables';

@media #{map-get($display-breakpoints, 'xs-only')} {
  .v-data-table-header {
    th strong,
    th span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 50px;
      display: block;
    }
  }
}
</style>
