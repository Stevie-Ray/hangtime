<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { event } from 'vue-gtag'
import IRCRA from 'ircra'
import HangboardSelect from '@/components/molecules/HangboardSelect/HangboardSelect.vue'
import { useAppStore } from '@/stores/app.store'
import { useUserStore } from '@/stores/user.store'
import { useWorkoutsStore } from '@/stores/workouts.store'
import { useAuthenticationStore } from '@/stores/authentication.store'
import { loadLanguageAsync } from '@/plugins/i18n'

const ircra = new IRCRA()

const { user } = storeToRefs(useAuthenticationStore())

const { online } = storeToRefs(useAppStore())

const { workoutsCommunity } = storeToRefs(useWorkoutsStore())

const { getHangboardNameByIds, getHangboardByIds } = useUserStore()

const { resetCommunityWorkouts } = useWorkoutsStore()

const { updateUser } = useAuthenticationStore()

const router = useRouter()

const { t } = useI18n()

const i18n = useI18n({ useScope: 'global' })

const dialog = ref(true)

const language = [
  {
    title: 'Čeština',
    value: 'cs-CZ'
  },
  {
    title: 'Deutsch',
    value: 'de-DE'
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
    title: 'Français',
    value: 'fr-FR'
  },
  {
    title: 'Italiano',
    value: 'it-IT'
  },
  {
    title: '日本語',
    value: 'ja-JP'
  },
  {
    title: 'Nederlands',
    value: 'nl-NL'
  },
  {
    title: 'Polski',
    value: 'pl-PL'
  },
  {
    title: '简体中文',
    value: 'zh-CN'
  }
]

const selected = reactive({
  company: 1,
  hangboard: 0
})

const getHangboard = computed(() => getHangboardByIds(selected.company, selected.hangboard))

const updateSelected = () => {
  const exists = user.value?.settings.hangboards.some(
    (item) => item.company === selected.company && item.hangboard === selected.hangboard
  )
  if (!exists) {
    // measure selected hangboard data
    event('add_hangboard', {
      hangboard: getHangboardNameByIds(selected.company, selected.hangboard)
    })
    // add the newly selected board and set it
    if (user.value) {
      user.value.settings.hangboards.push(selected)
      if (user.value.settings.hangboards.length > 0) {
        user.value.settings.selected = user.value.settings.hangboards.length - 1
      }
    }
  }
}

const finishWalkthrough = (addWorkout: boolean) => {
  if (online && user.value) {
    user.value.settings.walkthrough = true
    if (getHangboard.value?.holds !== 0) {
      updateSelected()
      workoutsCommunity.value = []
      resetCommunityWorkouts()
    }
    updateUser()
  }
  dialog.value = false
  if (addWorkout && online) {
    router.push('/workouts/new')
  } else {
    router.push('/workouts/community')
  }
}

const grades = computed(() => ircra.get(user?.value?.settings?.scale).filter((item) => item))

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

const settingsGrade = computed({
  get() {
    if (!user.value) return
    const ircraGrade = ircra
      .convert('ircra', user?.value?.settings?.grade)
      .to(user?.value?.settings?.scale)[user?.value?.settings?.scale]

    return ircraGrade
  },
  set(value) {
    const ircraGrade = ircra.convert(user?.value?.settings?.scale, value).to('ircra').ircra
    if (user.value) {
      user.value.settings.grade = ircraGrade
    }
  }
})
</script>

<template>
  <v-dialog
    v-model="dialog"
    persistent
    :scrim="false"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar>
        <v-toolbar-title
          >{{ t('Welcome to {appTitle}', { appTitle: 'HangTime' }) }} 👋
        </v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card class="mb-4" flat>
              <v-card-text>
                <p class="text--primary mb-8">
                  <span>
                    {{
                      t(
                        '{appTitle} lets you create your own training sequences, do community workouts and track your hangboarding progress',
                        { appTitle: 'HangTime' }
                      )
                    }}
                  </span>
                </p>
                <v-select
                  v-model="settingsLocale"
                  :items="language"
                  :label="t('Language')"
                  :item-props="true"
                ></v-select>
              </v-card-text>
            </v-card>
            <v-card class="mb-4" flat>
              <v-card-title>
                {{ t('Select your hangboard') }}
              </v-card-title>
              <v-card-subtitle>
                {{ t('Is your hangboard missing?') }}
                <a href="mailto:mail@stevie-ray.nl?subject=Hangboard%20Request">
                  {{ t('Get in touch') }}
                </a>
              </v-card-subtitle>
              <v-card-text>
                <hangboard-select
                  :model-value="selected"
                  @update:model-value="
                    (val) => {
                      selected.company = val.company
                      selected.hangboard = val.hangboard
                    }
                  "
                />
              </v-card-text>
            </v-card>

            <v-card class="mb-4" flat>
              <v-card-title>
                {{ t("What's your current grade?") }}
              </v-card-title>
              <v-list two-line>
                <v-list-item v-if="user">
                  <v-select
                    v-model="user!.settings.scale"
                    :items="ircra.scale()"
                    :label="t('Grading scale')"
                    item-title="name"
                    item-value="value"
                  >
                    <template #prepend>
                      <v-icon color="primary lighten-1" icon="$chartGantt"> </v-icon>
                    </template>
                  </v-select>
                </v-list-item>
                <v-list-item v-if="user">
                  <v-select
                    v-model="settingsGrade"
                    :item-title="user.settings.scale"
                    :items="grades"
                    :label="t('Grade')"
                    item-value="ircra"
                  >
                    <template #prepend>
                      <v-icon color="primary lighten-1" icon="$chartTimelineVariant"></v-icon>
                    </template>
                  </v-select>
                </v-list-item>
              </v-list>
            </v-card>

            <v-card class="mb-4" flat>
              <v-card-subtitle>{{ t('Get ready') }}... </v-card-subtitle>
              <v-card-title> {{ t(`And start hangboarding`) }}! </v-card-title>
              <v-card-text>
                <span class="text--primary">
                  <span>
                    {{
                      t(
                        `Add your first workout, do a community workout or start recording your progress. It's up to you.`
                      )
                    }}
                    <strong>{{
                      t(
                        `Always make sure that you are warmed up and that you're training at your own level.`
                      )
                    }}</strong></span
                  >
                </span>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="text"
                  :disabled="getHangboard && getHangboard.holds === 0"
                  @click="finishWalkthrough(true)"
                >
                  {{ t('Add a workout') }}
                </v-btn>
                <v-btn variant="text" @click="finishWalkthrough(false)">
                  {{ t('Close') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
