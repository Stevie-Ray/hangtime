<script setup>
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ExerciseHangboard from '@/components/atoms/ExerciseHangboard/ExerciseHangboard'
import { useUser } from '@/stores/user'

const { t } = useI18n()

const { getHangboardNameByIds, getCompanies, getHangboardsByCompanyId } =
  useUser()

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

const selected = ref(props.selectedHangboard)

watch(selected, (item) => {
  emit('update-selected', item)
})

const getHangboards = computed(() =>
  getHangboardsByCompanyId(selected.value.company)
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
    <template #prepend>
      <v-icon color="text">mdi-numeric-1-box</v-icon>
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
      <v-icon color="text">mdi-numeric-2-box</v-icon>
    </template>
  </v-select>
  <v-card>
    <v-card-text>
      <exercise-hangboard
        :hangboard="{
          company: selected.company,
          hangboard: selected.hangboard
        }"
      >
      </exercise-hangboard>
    </v-card-text>
    <v-card-title>
      {{ getHangboardNameByIds(selected.company, selected.hangboard) }}
    </v-card-title>
  </v-card>
</template>
