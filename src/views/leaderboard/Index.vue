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
        <v-row justify="center" align="start">
          <v-col cols="12">
            <div class="text-h4 mb-4">{{ $t('Leaderboard') }}</div>
            <v-data-table
              :headers="headers"
              :sort-by="['amount', 'hold', 'total']"
              :items="users"
              :items-per-page="5"
              :total-visible="5"
              class="elevation-1"
              :page.sync="page"
              hide-default-footer
              hide-default-header
              mobile-breakpoint="0"
              @page-count="pageCount = $event"
            >
              <!-- eslint-disable-next-line vue/valid-v-slot -->
              <template #item.hold="{ item }">
                {{ count(item.hold) }}
              </template>
              <!-- eslint-disable-next-line vue/valid-v-slot -->
              <template #item.total="{ item }">
                {{ count(item.total) }}
              </template>
            </v-data-table>
            <div class="text-center pt-2">
              <v-pagination v-model="page" :length="pageCount"></v-pagination>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { mdiArrowLeft } from '@mdi/js'
import { count } from '@/misc/helpers'

export default {
  data: () => ({
    page: 1,
    pageCount: 0,
    headers: [
      {
        text: '',
        align: 'start',
        sortable: false,
        value: 'name'
      },
      { text: 'Workouts done', value: 'amount' },
      { text: 'Total time hangboarding', value: 'hold' },
      { text: 'Total time worked out', value: 'total' }
    ],
    users: [
      {
        name: 'John Doe',
        amount: 11,
        hold: 133,
        total: 123
      },
      {
        name: 'Jane Doe',
        amount: 14,
        hold: 234,
        total: 423
      },
      {
        name: 'John Doe 2',
        amount: 2,
        hold: 60,
        total: 90
      },
      {
        name: 'Jane Doe 2',
        amount: 5,
        hold: 84,
        total: 104
      },
      {
        name: 'John Doe 3',
        amount: 99,
        hold: 675,
        total: 900
      },
      {
        name: 'Jane Doe 3',
        amount: 1,
        hold: 10,
        total: 20
      }
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
    ...mapState('authentication', ['user']),
    ...mapState('app', ['networkOnLine'])
  },
  methods: {
    count
  }
}
</script>
<style lang="scss"></style>
