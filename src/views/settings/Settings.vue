<template>
  <app-container name="Settings" :back-link="{ name: 'workouts' }">
    <v-list two-line>
      <v-list-item class="item-profile big py-2 pt-0" to="/settings/profile">
        <v-list-item-avatar v-if="user" size="56" class="grey lighten-2">
          <v-img
            v-if="user.photoURL"
            :src="userPhoto"
            :alt="user.displayName"
          />
        </v-list-item-avatar>

        <v-list-item-content v-if="user">
          <v-list-item-title v-if="user.displayName">
            {{ user.displayName }}
          </v-list-item-title>
          <v-list-item-title v-else>
            {{ $t('Guest User') }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ user.status }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item class="item-general" to="/settings/general">
        <v-list-item-icon>
          <v-icon color="primary lighten-1" v-text="mdi.cog"></v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t('General') }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ $t('Language, grading, weight, dark mode') }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset></v-divider>

      <v-list-item class="item-hangboards" to="/settings/hangboards">
        <v-list-item-icon>
          <span class="v-icon notranslate v-icon--svg">
            <svg-inline :src="getImg('icons/hangboard-menu.svg')" width="24" />
          </span>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t('Hangboards') }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ $t('Manage your hangboards') }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset></v-divider>

      <v-list-item class="item-workouts" to="/settings/workouts">
        <v-list-item-icon>
          <v-icon color="primary lighten-1">{{ mdi.timer }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t('Workouts') }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ $t('Sound, speech, vibrate') }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset></v-divider>
      <v-list-item
        v-if="canSubscribePlayBilling"
        class="item-subscription"
        to="/settings/subscription"
      >
        <v-list-item-icon>
          <v-icon color="primary lighten-1">{{ mdi.cashMultiple }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t('Subscription') }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ $t('Unlimited workouts') }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider v-if="canSubscribePlayBilling" inset></v-divider>

      <v-list-item class="item-notifications" to="/settings/notifications">
        <v-list-item-icon>
          <v-icon color="primary lighten-1">{{ mdi.bellRing }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t('Notifications') }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ $t('Workout reminders') }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset></v-divider>

      <v-list-item
        class="item-workouts"
        href="https://www.facebook.com/hangtime.hangboarding"
        target="_blank"
      >
        <v-list-item-icon>
          <v-icon color="primary lighten-1">{{ mdi.facebook }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            {{ $t('Follow {appTitle}', { appTitle: appTitle }) }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ $t('App and hangboard updates') }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset></v-divider>

      <v-list-item class="item-help" to="/settings/help">
        <v-list-item-icon>
          <v-icon color="primary lighten-1">{{ mdi.helpCircleOutline }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t('Help') }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ $t('FAQ, exercises, privacy, contact') }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </app-container>
</template>

<script>
import { mapState } from 'vuex'
import { SimpleSVG } from 'vue-simple-svg'
import {
  mdiCog,
  mdiTimer,
  mdiBellRing,
  mdiHelpCircleOutline,
  mdiCashMultiple,
  mdiFacebook
} from '@mdi/js'
import { getImg } from '@/misc/helpers'
import AppContainer from '@/components/molecules/AppContainer/AppContainer'

export default {
  components: {
    AppContainer,
    'svg-inline': SimpleSVG
  },
  data: () => ({
    PAYMENT_METHOD: 'https://play.google.com/billing',
    canSubscribe: window.getDigitalGoodsService,
    canSubscribePlayBilling: false,
    mdi: {
      cog: mdiCog,
      timer: mdiTimer,
      bellRing: mdiBellRing,
      helpCircleOutline: mdiHelpCircleOutline,
      cashMultiple: mdiCashMultiple,
      facebook: mdiFacebook
    }
  }),
  head: {
    title: {
      inner: 'Settings'
    },
    meta: [
      {
        name: 'description',
        content: 'App Settings',
        id: 'desc'
      }
    ]
  },
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('app', ['appTitle']),
    userPhoto() {
      if (this.user.pictureURL) {
        return this.user.pictureURL
      }
      return this.user.photoURL
    }
  },
  mounted() {
    this.canUsePlayBilling()
  },
  methods: {
    getImg,
    async canUsePlayBilling() {
      if (this.canSubscribe === undefined) {
        console.log("window doesn't have getDigitalGoodsService.")
      }
      try {
        const service = await window.getDigitalGoodsService(this.PAYMENT_METHOD)
        console.log(service)
        if (service === null) {
          console.log('Play Billing is not available.')
        } else {
          this.canSubscribePlayBilling = true
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
