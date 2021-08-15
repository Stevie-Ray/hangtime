<template>
  <app-container name="General" :back-link="{ path: '/settings' }">
    <v-list two-line>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="primary lighten-1">{{ mdi.chartGantt }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-select
            v-model="settingsScale"
            :items="scale"
            item-text="name"
            item-value="value"
            :label="$t('Grading system')"
            @change="triggerUpdateUser"
          ></v-select>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <v-icon color="primary lighten-1">{{ mdi.translate }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-select
            v-model="settingsLocale"
            :items="language"
            item-text="name"
            item-value="value"
            :label="$t('Language')"
            @change="triggerUpdateUser"
          ></v-select>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <v-icon color="primary lighten-1">{{ mdi.weight }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-select
            v-model="settingsWeight"
            :items="settings.weight"
            item-value="value"
            :label="$t('Weight system')"
            @change="triggerUpdateUser"
          >
            <template #selection="{ item }">
              {{ $t(item.name) }}
            </template>
            <template #item="{ item }">
              {{ $t(item.name) }}
            </template>
          </v-select>
        </v-list-item-content>
      </v-list-item>

      <v-list-item :disabled="settingsScheme">
        <v-list-item-icon>
          <v-icon color="primary lighten-1" :disabled="settingsScheme">{{
            mdi.themeLightDark
          }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t('Dark mode') }}</v-list-item-title>
          <v-list-item-subtitle>{{
            $t('Enable dark mode')
          }}</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-checkbox
            v-model="settingsTheme"
            :disabled="settingsScheme"
            @change="triggerUpdateUser"
          ></v-checkbox>
        </v-list-item-action>
      </v-list-item>

      <v-list-item three-line>
        <v-list-item-icon>
          <v-icon color="primary lighten-1">{{ mdi.cellphoneLink }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t('Use system mode') }}</v-list-item-title>
          <v-list-item-subtitle>
            {{
              $t('overwrites manual dark mode setting based on device settings')
            }}
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-checkbox
            v-model="settingsScheme"
            @change="triggerUpdateUser"
          ></v-checkbox>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </app-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import IRCRA from 'ircra'
import {
  mdiChartGantt,
  mdiThemeLightDark,
  mdiCellphoneLink,
  mdiWeight,
  mdiTranslate
} from '@mdi/js'
import AppContainer from '@/components/molecules/AppContainer/AppContainer'
import { getImg } from '@/misc/helpers'

export default {
  components: {
    AppContainer
  },
  data: () => ({
    scale: new IRCRA().scale(),
    mq: window.matchMedia('(prefers-color-scheme: dark)'),
    mdi: {
      chartGantt: mdiChartGantt,
      themeLightDark: mdiThemeLightDark,
      cellphoneLink: mdiCellphoneLink,
      weight: mdiWeight,
      translate: mdiTranslate
    }
  }),
  head: {
    title: {
      inner: 'General'
    },
    meta: [
      {
        name: 'description',
        content: 'General Settings',
        id: 'desc'
      }
    ]
  },
  computed: {
    ...mapState('app', ['networkOnLine', 'language']),
    ...mapState('authentication', ['user', 'settings']),
    settingsLocale: {
      get() {
        if (this.user.settings.locale) return this.user.settings.locale
        return this.$i18n.locale
      },
      set(value) {
        this.$i18n.locale = value
        this.setLocale(value)
      }
    },
    settingsScale: {
      get() {
        return this.user.settings.scale
      },
      set(value) {
        // this.scaleSelected = value
        this.setScale(value)
      }
    },
    settingsWeight: {
      get() {
        return this.user.settings.weight
      },
      set(value) {
        this.setWeight(value)
      }
    },
    settingsTheme: {
      get() {
        return this.user.settings.theme
      },
      set(value) {
        if (!this.settingsScheme) {
          this.$vuetify.theme.dark = value
        }
        this.setTheme(value)
      }
    },
    settingsScheme: {
      get() {
        return this.user.settings.scheme
      },
      set(value) {
        if (value === true && this.mq) {
          this.$vuetify.theme.dark = window.matchMedia(
            '(prefers-color-scheme: dark)'
          ).matches
        } else {
          this.$vuetify.theme.dark = false
        }
        if (value === false) {
          this.$vuetify.theme.dark = this.settingsTheme
        } else {
          this.setTheme(false)
        }
        this.setScheme(value)
      }
    }
  },
  methods: {
    getImg,
    ...mapActions('authentication', ['triggerUpdateUser']),
    ...mapMutations('authentication', [
      'setScale',
      'setTheme',
      'setScheme',
      'setLocale',
      'setWeight'
    ])
  }
}
</script>
