<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
// import { useTheme } from 'vuetify'
import { useHead } from '@unhead/vue'
import IRCRA from 'ircra'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import AccountMenu from '@/components/molecules/AccountMenu/AccountMenu.vue'
import { useAuthenticationStore } from '@/stores/authentication.store'
import { useAppStore } from '@/stores/app.store'
import { loadLanguageAsync } from '@/plugins/i18n'
import { Theme } from '@/enums/theme'
import { Unit } from '@/enums/unit'
import countries from '@/helpers/countries'

const scale = new IRCRA().scale()

const { t } = useI18n()

const i18n = useI18n({ useScope: 'global' })

const { user } = storeToRefs(useAuthenticationStore())

const { online } = storeToRefs(useAppStore())

const { updateUser } = useAuthenticationStore()

const language = [
  {
    title: 'Čeština',
    value: 'cs-CZ',
    country: 'CZ'
  },
  {
    title: 'Deutsch',
    value: 'de-DE',
    country: 'DE'
  },
  {
    title: 'English',
    value: 'en-US',
    country: 'US'
  },
  {
    title: 'Español',
    value: 'es-ES',
    country: 'ES'
  },
  {
    title: 'Français',
    value: 'fr-FR',
    country: 'FR'
  },
  {
    title: 'Italiano',
    value: 'it-IT',
    country: 'IT'
  },
  {
    title: '日本語',
    value: 'ja-JP',
    country: 'JP'
  },
  {
    title: 'Nederlands',
    value: 'nl-NL',
    country: 'NL'
  },
  {
    title: 'Polski',
    value: 'pl-PL',
    country: 'PL'
  },
  {
    title: 'Português',
    value: 'pt-PT',
    country: 'PT'
  },
  {
    title: '简体中文',
    value: 'zh-CN',
    country: 'CN'
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
                class="pt-2"
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
                class="pt-2"
              >
                <template #item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template #title>
                      <span>
                        {{
                          item.raw.country
                            ? countries.find((country) => country.alpha2 === item.raw.country)
                                ?.emoji
                            : ''
                        }}&nbsp;{{ item.title }}</span
                      >
                    </template>
                  </v-list-item>
                </template>
              </v-select>
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
                class="pt-2"
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
                class="pt-2"
              >
              </v-select>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </template>

    <template #sidebar>
      <v-row>
        <v-col cols="12">
          <account-menu />
        </v-col>
      </v-row>
    </template>
  </app-container>
</template>

<style lang="scss" scoped></style>
