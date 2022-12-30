<script setup>
import { useHead } from '@vueuse/head'
import { useRouter } from 'vue-router'
import { onMounted, reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useAuthentication } from '@/stores/authentication'
import AppContainer from '@/components/organisms/AppContainer/AppContainer'
import { useApp } from '@/stores/app'

const { t } = useI18n()

const { user } = storeToRefs(useAuthentication())

const { networkOnLine } = storeToRefs(useApp())

const { updateUser } = useAuthentication()

const synth = window.speechSynthesis
const greetingSpeech = new window.SpeechSynthesisUtterance()
const voices = reactive([])

const filterVoices = computed(() => {
  if (!voices) return []

  if (user.value?.settings?.locale) {
    return voices.filter((voice) =>
      voice.lang.includes(user.value?.settings?.locale.substring(0, 2))
    )
  }
  return voices.filter((voice) => /^(en|EN|US)/.test(voice.lang))
})

const selectedVoice = computed({
  get() {
    return voices[user.value.settings.voice]
  },
  set(value) {
    user.value.settings.voice = filterVoices.value.findIndex(
      (v) => v.name === value.name
    )
  }
})

onMounted(() => {
  Object.assign(voices, synth.getVoices())
  synth.onvoiceschanged = () => {
    Object.assign(voices, synth.getVoices())
  }
})

function greet(item) {
  greetingSpeech.text = `${t('You chose {voice}, this is my new voice', {
    voice: item.name
  })}
      `
  greetingSpeech.voice = voices.find((v) => v.name === item.name)
  try {
    synth.speak(greetingSpeech)
    updateUser()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('speechSynthesis not available', e)
  }
}

const router = useRouter()

useHead({
  title: 'Workouts',
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container prepend>
    <template #prepend>
      <v-icon @click="router.go(-1)">mdi-arrow-left</v-icon>
    </template>

    <template #title>
      {{ t('Workouts') }}
    </template>

    <template #default>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-list two-line>
              <v-list-item>
                <template #prepend>
                  <v-icon>mdi-volume-high</v-icon>
                </template>

                <v-list-item-title>{{ t('Play sound') }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ t('Just two simple tones') }}
                </v-list-item-subtitle>

                <template #append>
                  <v-checkbox
                    v-model="user.settings.sound"
                    color="text"
                    :disabled="!networkOnLine"
                    @change="updateUser"
                  ></v-checkbox>
                </template>
              </v-list-item>

              <v-list-item v-if="synth && voices.length">
                <template #prepend>
                  <v-icon>mdi-account-voice</v-icon>
                </template>

                <v-list-item-title>
                  {{ t('Speak instructions') }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ t('Spoken exercises') }}
                </v-list-item-subtitle>

                <template #append>
                  <v-checkbox
                    v-model="user.settings.speak"
                    color="text"
                    :disabled="!networkOnLine"
                    @change="updateUser"
                  ></v-checkbox>
                </template>
              </v-list-item>

              <v-list-item v-if="user.settings.speak && voices.length">
                <template #prepend>
                  <v-icon>mdi-account-multiple</v-icon>
                </template>

                <v-select
                  id="voices"
                  v-model="selectedVoice"
                  :disabled="!networkOnLine"
                  :items="filterVoices"
                  :item-title="(item) => `${item.name} (${item.lang})`"
                  :item-value="(item) => item.name"
                  :placeholder="t('Tap to change')"
                  :label="t('Select voice')"
                  return-object
                  @update:modelValue="(item) => greet(item)"
                >
                </v-select>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon>mdi-vibrate</v-icon>
                </template>

                <v-list-item-title>{{ t('Vibration') }}</v-list-item-title>
                <v-list-item-subtitle
                  >{{ t('Vibrate when finishing a workout') }}
                </v-list-item-subtitle>

                <template #append>
                  <v-checkbox
                    v-model="user.settings.vibrate"
                    color="text"
                    :disabled="!networkOnLine"
                    @change="updateUser"
                  ></v-checkbox>
                </template>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-container>
</template>

<style lang="scss" scoped></style>
