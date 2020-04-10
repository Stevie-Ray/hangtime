<template>
  <v-layout class="workouts">
    <v-app-bar color="primary" app fixed dark>
      <v-icon @click="$router.push({ name: 'settings' })"
        >mdi-arrow-left</v-icon
      >
      <v-toolbar-title>
        Workouts
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <v-container>
        <v-row justify="center" align="start">
          <v-col cols="12">
            <v-form>
              <v-list two-line>
                <v-list-item>
                  <v-list-item-avatar>
                    <v-icon color="primary lighten-1">mdi-volume-high</v-icon>
                  </v-list-item-avatar>

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
                  <v-list-item-avatar>
                    <v-icon color="primary lighten-1">mdi-voice</v-icon>
                  </v-list-item-avatar>

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
                  <v-list-item-avatar>
                    <v-icon color="primary lighten-1"
                      >mdi-account-multiple</v-icon
                    >
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-select
                      id="voices"
                      v-model="selectedVoice"
                      return-object
                      :items="voiceList"
                      placeholder="Tap to change"
                      label="Select voice"
                    >
                      <!--  eslint-disable-next-line vue/no-unused-vars-->
                      <template v-slot:selection="data">
                        <span
                          >{{ voiceList[user.settings.voice].name }} ({{
                            voiceList[user.settings.voice].lang
                          }})</span
                        >
                      </template>
                      <template v-slot:item="data">
                        <span>{{ data.item.name }} ({{ data.item.lang }})</span>
                      </template>
                    </v-select>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-avatar>
                    <v-icon color="primary lighten-1">mdi-vibrate</v-icon>
                  </v-list-item-avatar>

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
    </v-content>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  data: () => ({
    synth: window.speechSynthesis,
    greetingSpeech: new window.SpeechSynthesisUtterance(),
    voiceList: []
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
