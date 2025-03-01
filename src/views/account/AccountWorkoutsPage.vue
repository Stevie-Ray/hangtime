<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { onMounted, reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useAuthenticationStore } from '@/stores/authentication.store'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import { useAppStore } from '@/stores/app.store'

const { t } = useI18n()

const { user } = storeToRefs(useAuthenticationStore())

const { online } = storeToRefs(useAppStore())

const { updateUser } = useAuthenticationStore()

const synth = window.speechSynthesis
const greetingSpeech = new window.SpeechSynthesisUtterance()
const voices = reactive<SpeechSynthesisVoice[]>([])

const filterVoices = computed(() => {
  if (!voices || !user.value || !user.value.settings || !user.value.settings.locale) return []

  const locale = user.value.settings.locale
  if (locale) {
    return voices.filter((voice) => voice.lang.includes(locale.substring(0, 2)))
  }
  return voices.filter((voice) => /^(en|EN|US)/.test(voice.lang))
})

const selectedVoice = computed({
  get() {
    return user.value && voices[user.value.settings.voice]
  },
  set(value) {
    if (user.value) {
      const index = value ? filterVoices.value.findIndex((v) => v.name === value.name) : -1
      if (index !== -1) {
        user.value.settings.voice = index
      }
    }
  }
})

onMounted(() => {
  Object.assign(voices, synth.getVoices())
  synth.onvoiceschanged = () => {
    Object.assign(voices, synth.getVoices())
  }
})

function greet(item: SpeechSynthesisVoice | undefined) {
  if (!item) return

  greetingSpeech.text = `${t('You chose {voice}, this is my new voice', {
    voice: item.name
  })}
      `
  const selectedVoice = voices.find((v) => v.name === item.name)
  if (!selectedVoice) return

  greetingSpeech.voice = selectedVoice
  try {
    synth.speak(greetingSpeech)
    updateUser()
  } catch (e) {
    console.log('speechSynthesis not available', e)
  }
}

// TODO: We have to wrap the user settings sound to avoid TS errors
const userSettingsSound = computed<boolean | null>({
  get(): boolean {
    if (!user.value) return false
    return user.value.settings.sound
  },
  set(value: boolean | null) {
    if (!user.value) return
    if (typeof value === 'boolean') {
      user.value.settings.sound = value
    }
  }
})

// TODO: We have to wrap the user settings speak to avoid TS errors
const userSettingsSpeak = computed<boolean | null>({
  get(): boolean {
    if (!user.value) return false
    return user.value.settings.speak
  },
  set(value: boolean | null) {
    if (!user.value) return
    if (typeof value === 'boolean') {
      user.value.settings.speak = value
    }
  }
})

const userSettingsVibrate = computed<boolean | null>({
  get(): boolean {
    if (!user.value) return false
    return user.value.settings.vibrate
  },
  set(value: boolean | null) {
    if (!user.value) return
    if (typeof value === 'boolean') {
      user.value.settings.vibrate = value
    }
  }
})

useHead({
  title: 'Workouts',
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container toolbar-prepend toolbar-prepend-url="/account">
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
                  <v-icon>$volumeHigh</v-icon>
                </template>

                <v-list-item-title>{{ t('Play sound') }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ t('Just two simple tones') }}
                </v-list-item-subtitle>

                <template #append>
                  <v-checkbox
                    v-if="user"
                    v-model="userSettingsSound"
                    color="text"
                    :disabled="!online"
                    @change="updateUser"
                  ></v-checkbox>
                </template>
              </v-list-item>

              <v-list-item v-if="synth && voices.length">
                <template #prepend>
                  <v-icon>$accountVoice</v-icon>
                </template>

                <v-list-item-title>
                  {{ t('Speak instructions') }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ t('Spoken exercises') }}
                </v-list-item-subtitle>

                <template #append>
                  <v-checkbox
                    v-if="user"
                    v-model="userSettingsSpeak"
                    color="text"
                    :disabled="!online"
                    @change="updateUser"
                  ></v-checkbox>
                </template>
              </v-list-item>

              <v-list-item v-if="user?.settings.speak && voices.length">
                <template #prepend>
                  <v-icon>$accountMultiple</v-icon>
                </template>

                <v-select
                  id="voices"
                  v-model="selectedVoice"
                  :disabled="!online"
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
                  <v-icon>$vibrate</v-icon>
                </template>

                <v-list-item-title>{{ t('Vibration') }}</v-list-item-title>
                <v-list-item-subtitle
                  >{{ t('Vibrate when finishing a workout') }}
                </v-list-item-subtitle>

                <template #append>
                  <v-checkbox
                    v-if="user"
                    v-model="userSettingsVibrate"
                    color="text"
                    :disabled="!online"
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
