<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
// import { useTheme } from 'vuetify'
import { useHead } from '@unhead/vue'
import { useRouter } from 'vue-router'
import IRCRA from 'ircra'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import { useAuthenticationStore } from '@/stores/authentication'
import { useAppStore } from '@/stores/app'
import { loadLanguageAsync } from '@/plugins/i18n'

const scale = new IRCRA().scale()

const { t } = useI18n()

const i18n = useI18n({ useScope: 'global' })

const { user } = storeToRefs(useAuthenticationStore())

const { networkOnLine } = storeToRefs(useAppStore())

const { updateUser } = useAuthenticationStore()

// const theme = useTheme()

const router = useRouter()

const language = [
  {
    title: '简体中文',
    value: 'zh-CN',
    disabled: true
  },
  {
    title: 'Deutsch',
    value: 'de-DE'
  },
  {
    title: 'Français',
    value: 'fr-FR'
  },
  {
    title: 'English',
    value: 'en-US'
  },
  {
    title: 'Español',
    value: 'es-ES'
  },
  {
    title: 'Italiano',
    value: 'it-IT'
  },
  {
    title: '日本語',
    value: 'ja-JP',
    disabled: true
  },
  {
    title: 'Nederlands',
    value: 'nl-NL'
  },
  {
    title: 'Polski',
    value: 'pl-PL'
  }
]

const settingsLocale = computed({
  get() {
    if (!user.value) return ''
    // eslint-disable-next-line consistent-return
    if (user?.value?.settings?.locale) return user.value.settings.locale
    // eslint-disable-next-line consistent-return
    return i18n.locale.toString()
  },
  set(value: string) {
    if (user.value) {
      user.value.settings.locale = value
      loadLanguageAsync(value)
    }
  }
})

const weight = [
  {
    title: t('Kilograms - Metric'),
    short: 'kg',
    value: 0
  },
  {
    title: t('Pounds - Imperial'),
    short: 'lb',
    value: 1
  }
]

const themes = [
  {
    title: t('System'),
    value: 0
  },
  {
    title: t('Light'),
    value: 1
  },
  {
    title: t('Dark'),
    value: 2
  }
]

const setTheme = (value: number) => {
  if (user.value) {
    user.value.settings.theme = value
    updateUser()
  }
}

useHead({
  title: 'General',
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container prepend>
    <template #prepend>
      <v-icon @click="router.go(-1)">$arrowLeft</v-icon>
    </template>

    <template #title>
      {{ t('General') }}
    </template>

    <template #default>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-list lines="two">
              <v-list-item>
                <template #prepend>
                  <v-icon>$chartGantt</v-icon>
                </template>
                <v-select
                  v-if="user"
                  v-model="user.settings.scale"
                  :disabled="!networkOnLine"
                  :items="scale"
                  :label="t('Grading system')"
                  item-title="name"
                  item-value="value"
                  @update:modelValue="updateUser"
                ></v-select>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon>$translate</v-icon>
                </template>

                <v-select
                  v-if="user"
                  v-model="settingsLocale"
                  :disabled="!networkOnLine"
                  :items="language"
                  :item-props="true"
                  :label="t('Language')"
                  @update:modelValue="updateUser"
                ></v-select>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon>$weight</v-icon>
                </template>

                <v-select
                  v-if="user"
                  v-model="user.weight"
                  :disabled="!networkOnLine"
                  :items="weight"
                  :label="t('Weight system')"
                  @update:modelValue="updateUser"
                >
                </v-select>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon>$themeLightDark</v-icon>
                </template>

                <v-select
                  v-if="user"
                  v-model="user.settings.theme"
                  :disabled="!networkOnLine"
                  :items="themes"
                  :label="t('Theme')"
                  @update:modelValue="setTheme"
                >
                </v-select>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-container>
</template>

<style lang="scss" scoped></style>
