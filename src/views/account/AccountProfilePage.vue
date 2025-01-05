<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { getAuth, linkWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth'
import IRCRA from 'ircra'
import { Ref, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthenticationStore } from '@/stores/authentication.store'
import { weightConverter } from '@/helpers'
import countries from '@/helpers/countries'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'
import { useAppStore } from '@/stores/app.store'

const { t } = useI18n()

const { user } = storeToRefs(useAuthenticationStore())

const { online } = storeToRefs(useAppStore())

const { updateUser } = useAuthenticationStore()

const router = useRouter()

const ircra = new IRCRA()

const rules = {
  length: (length: number) => (v: string) =>
    (v || '').length <= length || `Max ${length} characters`,
  required: (v: unknown) => !!v || 'This field is required'
}

const grades = computed(() => ircra.get(user.value?.settings?.scale).filter((item) => item))

const error: Ref<null | string> = ref(null)

const login = async (method: string) => {
  let provider = null
  const auth = getAuth()

  if (method === 'google') {
    provider = new GoogleAuthProvider()
  }
  if (method === 'apple') {
    provider = new OAuthProvider('apple.com')
    provider.addScope('email')
    provider.addScope('name')
  }
  if (provider !== null && auth.currentUser !== null) {
    try {
      await linkWithPopup(auth.currentUser, provider).then(
        (result) => {
          const { user } = result

          console.log(user)
        },
        (err) => {
          console.log(err)
          error.value = err.code.toString()
        }
      )
    } catch (err) {
      if (err instanceof Error) {
        console.log(err)
        error.value = err.message
      }
    }
  }
}

const deleteAccount = async () => {
  const auth = getAuth()
  if (auth.currentUser !== null) {
    await auth.currentUser
      .delete()
      .then(() => {
        router.push('/')
      })
      .catch((err) => {
        console.log(err)
        error.value = err
      })
  }
}

useHead({
  title: 'Profile',
  meta: [{ name: 'description', content: '' }]
})
</script>

<template>
  <app-container prepend>
    <template #prepend>
      <v-icon @click="router.go(-1)">$arrowLeft</v-icon>
    </template>

    <template #title>
      {{ t('Profile') }}
    </template>

    <template #default>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-list>
              <v-list-item v-if="user && user.id">
                <template #prepend>
                  <v-icon>$identifier</v-icon>
                </template>

                <v-list-item-title>
                  {{ user.id }}
                </v-list-item-title>
              </v-list-item>

              <v-list-item v-if="user && user.displayName">
                <template #prepend>
                  <v-icon>$account</v-icon>
                </template>

                <v-list-item-title>{{ user.displayName }}</v-list-item-title>
              </v-list-item>

              <v-list-item v-if="user && user.email">
                <template #prepend>
                  <v-icon>$email</v-icon>
                </template>

                <v-list-item-title>
                  {{ user.email }}
                </v-list-item-title>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon>$genderMaleFemale</v-icon>
                </template>

                <v-radio-group
                  v-if="user"
                  v-model="user.gender"
                  :disabled="!online"
                  row
                  @update:modelValue="updateUser"
                >
                  <v-radio :label="t('Male')" value="male"></v-radio>
                  <v-radio :label="t('Female')" value="female"></v-radio>
                  <v-radio :label="t('Other')" value="other"></v-radio>
                </v-radio-group>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon>$mapMarker</v-icon>
                </template>

                <v-autocomplete
                  v-if="user"
                  v-model="user.country"
                  :disabled="!online"
                  :items="countries"
                  :label="t('Country')"
                  class="mt-1 pt-0"
                  item-title="name"
                  item-value="alpha2"
                  return-object
                  @update:modelValue="updateUser"
                ></v-autocomplete>
              </v-list-item>

              <v-list-item v-if="user && user.settings.scale">
                <template #prepend>
                  <v-icon>$scaleBathroom</v-icon>
                </template>

                <v-slider
                  v-model="user.weight"
                  :disabled="!online"
                  :hint="t('Set your weight to use with a kettle/dumb-bells or pulley system')"
                  :label="t('Weight')"
                  :max="150"
                  :min="50"
                  always-dirty
                  persistent-hint
                  color="text"
                  step="1"
                  thumb-size="24"
                  @update:modelValue="updateUser"
                >
                  <template #thumb-label="props">
                    {{ weightConverter(props.modelValue, user) }}kg
                  </template>
                  <template #append>
                    <v-label v-if="user && user.weight">
                      {{ weightConverter(user.weight, user) }}kg
                    </v-label>
                  </template>
                </v-slider>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon>$chartTimelineVariant</v-icon>
                </template>

                <v-select
                  v-if="user"
                  v-model="user.settings.grade"
                  :disabled="!online"
                  :hint="t('What grade are you currently climbing?')"
                  :item-title="user.settings.scale"
                  :items="grades"
                  :label="t('Grade')"
                  item-value="ircra"
                  persistent-hint
                  @update:modelValue="updateUser"
                ></v-select>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon>$information</v-icon>
                </template>

                <v-text-field
                  v-if="user && user.status"
                  v-model="user.status"
                  :disabled="!online"
                  :label="t('Status')"
                  :placeholder="t('In the climbing gym')"
                  :rules="[rules.required, rules.length(24)]"
                  counter="24"
                  required
                  @update:modelValue="updateUser"
                >
                </v-text-field>
              </v-list-item>
            </v-list>
            <v-list lines="two">
              <v-list-item>
                <v-list-item-title>
                  <strong>{{ t('Link Accounts') }} ({{ t('Beta') }})</strong>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Google</v-list-item-title>
                <template #append>
                  <v-btn
                    :disabled="!online"
                    size="small"
                    variant="outlined"
                    color="text"
                    icon="$account"
                    @click="login('google')"
                  ></v-btn>
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Apple</v-list-item-title>
                <template #append>
                  <v-btn
                    :disabled="!online"
                    size="small"
                    variant="outlined"
                    color="text"
                    icon="$account"
                    @click="login('apple')"
                  ></v-btn>
                </template>
              </v-list-item>
              <v-row align="center" justify="center">
                <v-col cols="12">
                  <v-card>
                    <v-card-title>{{ t('Delete account') }}</v-card-title>
                    <v-card-text>
                      {{
                        t(
                          'Once you delete your account, there is no going back. Please be certain.'
                        )
                      }}
                    </v-card-text>
                    <v-card-actions>
                      <v-btn color="error" :disabled="!online" @click="deleteAccount">
                        {{ t('Delete your account') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
      <v-alert
        class="position-fixed"
        closable
        v-if="error"
        :text="error"
        type="error"
        style="left: 8px; right: 8px; bottom: 8px; z-index: 1007"
        >{{ error }}</v-alert
      >
    </template>
  </app-container>
</template>

<style lang="scss" scoped></style>
