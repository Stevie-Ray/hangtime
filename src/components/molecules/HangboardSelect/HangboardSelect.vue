<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ExerciseHangboard from '@/components/atoms/ExerciseHangboard/ExerciseHangboard'
import { useUser } from '@/stores/user'
import countries from '@/helpers/countries'

const { t } = useI18n()

const { getHangboardByIds, getCompanyById, getHangboardNameByIds, getCompanies } = useUser()

const props = defineProps({
  selectedHangboard: {
    type: Object,
    default: () => ({
      company: 1,
      hangboard: 0
    })
  }
})

const emit = defineEmits(['update-selected'])

// eslint-disable-next-line vue/no-setup-props-destructure
const selected = ref(props.selectedHangboard)

watch(selected, (item) => {
  emit('update-selected', item)
})

const getHangboards = computed(() => getCompanyById(selected.value.company).hangboards)

const email = 'mail@stevie-ray.nl'
const body = computed(() =>
  encodeURIComponent(
    `Hello HangTime,\n\nPlease add the following Hangboard: ${getHangboardNameByIds(
      selected.value.company,
      selected.value.hangboard
    )}\n\n${getHangboardByIds(selected.value.company, selected.value.hangboard).url}`
  )
)
const subject = computed(() =>
  encodeURIComponent(
    `Hangboard Request: ${getHangboardNameByIds(selected.value.company, selected.value.hangboard)}`
  )
)
</script>

<template>
  <v-select
    v-model="selected.company"
    :items="getCompanies"
    :label="t('Hangboard manufacturer')"
    item-title="name"
    item-value="id"
    required
    @update:modelValue="selected.hangboard = 0"
  >
    <template #item="{ item, props: { onClick } }">
      <v-list-item @click="onClick">
        <span>
          {{
            item.raw.country
              ? countries.find((country) => country.alpha2 === item.raw.country)?.emoji
              : ''
          }}&nbsp;{{ item.title }}</span
        >
        <v-chip class="mx-2" size="x-small" v-if="item.value >= getCompanies.length - 5">
          {{ $t('new') }}
        </v-chip>
      </v-list-item>
    </template>
    <template #prepend>
      <v-icon color="text">$numeric1Box</v-icon>
    </template>
  </v-select>
  <v-select
    v-model="selected.hangboard"
    :items="getHangboards"
    :label="t('Select your model')"
    item-title="name"
    item-value="id"
    required
  >
    <template #prepend>
      <v-icon color="text">$numeric2Box</v-icon>
    </template>
  </v-select>
  <v-card>
    <v-card-text>
      <exercise-hangboard
        v-if="
          getHangboardByIds(selected.company, selected.hangboard).image !==
          'hangboards/NOTFOUND.svg'
        "
        :hangboard="{
          company: selected.company,
          hangboard: selected.hangboard
        }"
      >
      </exercise-hangboard>
      <div v-else>
        <v-btn size="large" :href="`mailto:${email}?subject=${subject}&body=${body}`">
          {{ t('Request Hangboard') }}
        </v-btn>
      </div>
    </v-card-text>
    <v-card-title class="d-flex justify-space-between">
      <div v-if="getHangboardByIds(selected.company, selected.hangboard).name">
        {{ getHangboardByIds(selected.company, selected.hangboard).name }}
      </div>
      <v-chip v-if="getHangboardByIds(selected.company, selected.hangboard).type">
        {{ getHangboardByIds(selected.company, selected.hangboard).type }}
      </v-chip>
    </v-card-title>
    <v-card-subtitle>
      <span>
        {{
          getCompanyById(selected.company).country
            ? countries.find(
                (country) => country.alpha2 === getCompanyById(selected.company).country
              )?.emoji
            : ''
        }}&nbsp;{{ getCompanyById(selected.company).name }}</span
      >
    </v-card-subtitle>
    <v-card-actions>
      <v-btn
        color="text"
        disabled
        v-if="getHangboardByIds(selected.company, selected.hangboard).size"
      >
        <div class="text-caption">
          <span v-if="getHangboardByIds(selected.company, selected.hangboard).size.x">
            {{ getHangboardByIds(selected.company, selected.hangboard).size.x }}mm
          </span>
          <span v-if="getHangboardByIds(selected.company, selected.hangboard).size.y">
            &nbsp;x
            {{ getHangboardByIds(selected.company, selected.hangboard).size.y }}mm
          </span>
          <span v-if="getHangboardByIds(selected.company, selected.hangboard).size.z">
            &nbsp;x
            {{ getHangboardByIds(selected.company, selected.hangboard).size.z }}mm
          </span>
        </div>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        size="small"
        v-if="getHangboardByIds(selected.company, selected.hangboard).url"
        color="text"
        icon="$shareVariant"
        :href="getHangboardByIds(selected.company, selected.hangboard).url"
        target="_blank"
      >
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
