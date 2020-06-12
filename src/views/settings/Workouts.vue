<template>
  <v-layout class="workouts">
    <v-app-bar color="primary" app fixed dark>
      <v-icon @click="$router.push({ name: 'settings' })">{{
        mdi.arrowLeft
      }}</v-icon>
      <v-toolbar-title>
        Workouts
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row justify="center" align="start">
          <v-col cols="12">
            <v-form>
              <v-list two-line>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary lighten-1">{{
                      mdi.volumeHigh
                    }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Play sound</v-list-item-title>
                    <v-list-item-subtitle
                      >Just two simple tones
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-checkbox
                      v-model="settingsSound"
                      @change="triggerUpdateUser"
                    ></v-checkbox>
                  </v-list-item-action>
                </v-list-item>

                <v-list-item v-if="synth && voiceList.length">
                  <v-list-item-icon>
                    <v-icon color="primary lighten-1">{{
                      mdi.accountVoice
                    }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Speak instructions</v-list-item-title>
                    <v-list-item-subtitle
                      >Spoken exercises
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-checkbox
                      v-model="settingsSpeak"
                      @change="triggerUpdateUser"
                    ></v-checkbox>
                  </v-list-item-action>
                </v-list-item>

                <v-list-item v-if="user.settings.speak">
                  <v-list-item-icon>
                    <v-icon color="primary lighten-1">{{
                      mdi.accountMultiple
                    }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-select
                      v-if="voiceList.length"
                      id="voices"
                      v-model="selectedVoice"
                      :items="voiceList"
                      :item-text="item => `${item.name} (${item.lang})`"
                      placeholder="Tap to change"
                      label="Select voice"
                      return-object
                    >
                    </v-select>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary lighten-1">{{ mdi.vibrate }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Vibration</v-list-item-title>
                    <v-list-item-subtitle
                      >Vibrate when finishing a workout
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-checkbox
                      v-model="settingsVibrate"
                      @change="triggerUpdateUser"
                    ></v-checkbox>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import {
  mdiArrowLeft,
  mdiVolumeHigh,
  mdiVibrate,
  mdiAccountVoice,
  mdiAccountMultiple
} from '@mdi/js'

export default {
  data: () => ({
    synth: window.speechSynthesis,
    greetingSpeech: new window.SpeechSynthesisUtterance(),
    voiceList: [],
    mdi: {
      arrowLeft: mdiArrowLeft,
      volumeHigh: mdiVolumeHigh,
      vibrate: mdiVibrate,
      accountVoice: mdiAccountVoice,
      accountMultiple: mdiAccountMultiple
    }
  }),
  computed: {
    ...mapState('authentication', ['user']),
    selectedVoice: {
      get() {
        return this.voiceList[this.user.settings.voice]
      },
      set(value) {
        this.setVoice(this.voiceList.indexOf(value))
        this.greet(value)
        this.triggerUpdateUser()
      }
    },
    settingsSound: {
      get() {
        return this.user.settings.sound
      },
      set(value) {
        this.setSound(value)
      }
    },
    settingsSpeak: {
      get() {
        return this.user.settings.speak
      },
      set(value) {
        this.setSpeak(value)
      }
    },
    settingsVibrate: {
      get() {
        return this.user.settings.vibrate
      },
      set(value) {
        this.setVibrate(value)
      }
    }
  },
  mounted() {
    this.voiceList = this.synth
      .getVoices()
      .filter(voice => /^(en|EN|US)/.test(voice.lang))

    this.synth.onvoiceschanged = () => {
      this.voiceList = this.synth
        .getVoices()
        .filter(voice => /^(en|EN|US)/.test(voice.lang))
    }

    // this.listenForSpeechEvents();
  },
  methods: {
    ...mapActions('authentication', ['triggerUpdateUser']),
    ...mapMutations('authentication', [
      'setSound',
      'setSpeak',
      'setVibrate',
      'setVoice'
    ]),
    greet(event) {
      this.greetingSpeech.text = `You choose ${event.name}, this is my new voice`
      this.greetingSpeech.voice = event
      try {
        this.synth.speak(this.greetingSpeech)
      } catch (ex) {
        // eslint-disable-next-line no-console
        console.log('speechSynthesis not available', ex)
      }
    }
  },
  head: {
    title: {
      inner: 'Workout Settings'
    },
    meta: [
      {
        name: 'description',
        content: 'Workout Settings',
        id: 'desc'
      }
    ]
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"></style>
