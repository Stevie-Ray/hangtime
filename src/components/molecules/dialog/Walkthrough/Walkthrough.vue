<script setup>
import { computed, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { event } from 'vue-gtag'
import IRCRA from 'ircra'
import HangboardSelect from '@/components/molecules/HangboardSelect/HangboardSelect'
import { useApp } from '@/stores/app'
import { useUser } from '@/stores/user'
import { useAuthentication } from '@/stores/authentication'

const ircra = new IRCRA()

const { user } = storeToRefs(useAuthentication())

const { networkOnLine } = storeToRefs(useApp())

const { getHangboardNameByIds } = useUser()

const { updateUser } = useAuthentication()

const router = useRouter()

const { t } = useI18n()

const i18n = useI18n({ useScope: 'global' })

const dialog = ref(true)

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

const selected = reactive({
  company: 1,
  hangboard: 0
})

const updateSelected = () => {
  const exists = user.value.settings.hangboards.some(
    (item) =>
      item.company === selected.company && item.hangboard === selected.hangboard
  )
  if (!exists) {
    // measure selected hangboard data
    event('add_hangboard', {
      hangboard: getHangboardNameByIds(selected.company, selected.hangboard)
    })
    // add the newly selected board and set it
    user.value.settings.hangboards.push(selected)
    user.value.settings.selected = user.value.settings.hangboards.length - 1
  }
}

const finishWalkthrough = (addWorkout) => {
  if (user.value) {
    user.value.settings.walkthrough = true
    updateSelected()
    updateUser()
  }
  dialog.value = false
  if (addWorkout) {
    router.push('/workouts/new')
  } else {
    router.push('/workouts/community')
  }
}

const grades = computed(() =>
  ircra.get(user?.value.settings?.scale).filter((item) => item)
)

const settingsLocale = computed({
  get() {
    if (!user.value) return
    // eslint-disable-next-line consistent-return
    if (user?.value?.settings?.locale) return user.value.settings.locale
    // eslint-disable-next-line consistent-return
    return i18n.locale
  },
  set(value) {
    i18n.locale = value
    user.value.settings.locale = value
  }
})

const settingsGrade = computed({
  get() {
    if (!user.value) return
    const ircraGrade = ircra
      .convert('ircra', user?.value?.settings?.grade)
      .to(user?.value?.settings?.scale)[user?.value?.settings?.scale]
    // eslint-disable-next-line consistent-return
    return ircraGrade
  },
  set(value) {
    const ircraGrade = ircra
      .convert(user?.value?.settings?.scale, value)
      .to('ircra').ircra
    user.value.settings.grade = ircraGrade
  }
})
</script>

<template>
  <v-dialog
    v-model="dialog"
    :scrim="false"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar v-if="networkOnLine">
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
                  item-title="name"
                  item-value="value"
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
                  :selected-hangboard="selected"
                  @update-selected="(item) => (selected = item)"
                ></hangboard-select>
              </v-card-text>
            </v-card>

            <v-card class="mb-4" flat>
              <v-card-title>
                {{ t("What's your current grade?") }}
              </v-card-title>
              <v-list two-line>
                <v-list-item>
                  <v-select
                    v-if="user"
                    v-model="user.settings.scale"
                    :items="ircra.scale()"
                    :label="t('Grading scale')"
                    item-title="name"
                    item-value="value"
                  >
                    <template #prepend>
                      <v-icon color="primary lighten-1" icon="mdi-chart-gantt">
                      </v-icon>
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
                      <v-icon
                        color="primary lighten-1"
                        icon="mdi-chart-timeline-variant"
                      ></v-icon>
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
                <v-btn color="text" @click="finishWalkthrough(true)">
                  {{ $t('Add a workout') }}
                </v-btn>
                <v-btn text @click="finishWalkthrough(false)">
                  {{ $t('Close') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
