<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
// import { useTheme } from 'vuetify'
import { useHead } from '@unhead/vue'
import { useRouter } from 'vue-router'
import IRCRA from 'ircra'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import { useAuthentication } from '@/stores/authentication'
import { useApp } from '@/stores/app'

const scale = new IRCRA().scale()

const { t } = useI18n()

const i18n = useI18n({ useScope: 'global' })

const { user } = storeToRefs(useAuthentication())

const { networkOnLine } = storeToRefs(useApp())

const { updateUser } = useAuthentication()

// const theme = useTheme()

const router = useRouter()

const language = [
  {
    name: '简体中文',
    value: 'zh-CN',
    disabled: true
  },
  {
    name: 'Deutsch',
    value: 'de-DE'
  },
  {
    name: 'Français',
    value: 'fr-FR'
  },
  {
    name: 'English',
    value: 'en-US'
  },
  {
    name: 'Español',
    value: 'es-ES'
  },
  {
    name: 'Italiano',
    value: 'it-IT'
  },
  {
    name: '日本語',
    value: 'ja-JP',
    disabled: true
  },
  {
    name: 'Nederlands',
    value: 'nl-NL'
  },
  {
    name: 'Polski',
    value: 'pl-PL'
  }
]

const settingsLocale = computed({
  get() {
    if (!user) return
    // eslint-disable-next-line consistent-return
    if (user?.value.settings?.locale) return user.value.settings.locale
    // eslint-disable-next-line consistent-return
    return i18n.locale
  },
  set(value) {
    i18n.locale = value
    user.value.settings.locale = value
  }
})

const weight = [
  {
    name: t('Kilograms - Metric'),
    short: 'kg',
    value: 0
  },
  {
    name: t('Pounds - Imperial'),
    short: 'lb',
    value: 1
  }
]

const themes = [
  {
    name: t('System'),
    value: 0
  },
  {
    name: t('Light'),
    value: 1
  },
  {
    name: t('Dark'),
    value: 2
  }
]

const setTheme = (value) => {
  user.value.settings.theme = value
  updateUser()
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
                  v-model="settingsLocale"
                  :disabled="!networkOnLine"
                  :items="language"
                  :label="t('Language')"
                  item-title="name"
                  item-value="value"
                  @update:modelValue="updateUser"
                ></v-select>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon>$weight</v-icon>
                </template>

                <v-select
                  v-model="user.settings.weight"
                  :disabled="!networkOnLine"
                  :items="weight"
                  :label="t('Weight system')"
                  item-title="name"
                  item-value="value"
                  @update:modelValue="updateUser"
                >
                </v-select>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon>$themeLightDark</v-icon>
                </template>

                <v-select
                  v-model="user.settings.theme"
                  :disabled="!networkOnLine"
                  :items="themes"
                  :label="t('Theme')"
                  item-title="name"
                  item-value="value"
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
