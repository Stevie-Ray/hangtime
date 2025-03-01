<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
// import { useTheme } from 'vuetify'
import { useHead } from '@unhead/vue'
import IRCRA from 'ircra'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import { useAuthenticationStore } from '@/stores/authentication.store'
import { useAppStore } from '@/stores/app.store'
import { loadLanguageAsync } from '@/plugins/i18n'
import { Theme } from '@/enums/theme'
import { Unit } from '@/enums/unit'

const scale = new IRCRA().scale()

const { t } = useI18n()

const i18n = useI18n({ useScope: 'global' })

const { user } = storeToRefs(useAuthenticationStore())

const { online } = storeToRefs(useAppStore())

const { updateUser } = useAuthenticationStore()

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

    if (user?.value?.settings?.locale) return user.value.settings.locale

    return i18n.fallbackLocale.value
  },
  set(value: string) {
    if (user.value) {
      user.value.settings.locale = value
    }
    loadLanguageAsync(value)
  }
})

const units = [
  {
    title: t('Kilograms - Metric'),
    value: Unit.Metric
  },
  {
    title: t('Pounds - Imperial'),
    value: Unit.Imperial
  }
]

const themes = [
  {
    title: t('System'),
    value: Theme.System
  },
  {
    title: t('Light'),
    value: Theme.Light
  },
  {
    title: t('Dark'),
    value: Theme.Dark
  }
]

const setTheme = (value: Theme) => {
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
  <app-container toolbar-prepend toolbar-prepend-url="/account">
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
                  v-model="user!.settings.scale"
                  :disabled="!online"
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
                  :disabled="!online"
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
                  v-model="user!.settings.weight"
                  :disabled="!online"
                  :items="units"
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
                  v-model="user!.settings.theme"
                  :disabled="!online"
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
