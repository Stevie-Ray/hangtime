<script setup lang="ts">
import draggable from 'vuedraggable'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ExerciseCard from '@/components/molecules/ExerciseCard/ExerciseCard.vue'
import { useApp } from '@/stores/app'
import ExerciseEdit from '@/components/molecules/dialog/ExerciseEdit/ExerciseEdit.vue'

const { t } = useI18n()

const { networkOnLine } = storeToRefs(useApp())

const emit = defineEmits(['add'])

const props = defineProps({
  workout: {
    type: Object
  },
  edit: {
    type: Boolean,
    default: false
  }
})

const workout = ref(props.workout)
const edit = ref(props.edit)

watch(
  () => props.workout,
  (newValue) => {
    workout.value = newValue
  }
)

watch(
  () => props.edit,
  (newValue) => {
    edit.value = newValue
  },
  { immediate: true }
)

const exerciseEditDialog = ref(false)
const exerciseIndex = ref(0)

const openExerciseEditDialog = (index: number) => {
  if (edit.value === true) {
    exerciseIndex.value = index
    exerciseEditDialog.value = true
  }
}
</script>

<template>
  <draggable
    v-model="workout.exercises"
    item-key="id"
    class="draggable"
    ghost-class="ghost"
    :animation="0"
    :scroll="true"
    :scrollSensitivity="120"
    :disabled="!networkOnLine"
    handle=".handle"
  >
    <template #item="{ element, index }">
      <exercise-card
        :exercise="element"
        :hangboard="{
          hangboard: workout.hangboard,
          company: workout.company
        }"
        :index="index"
        :key="index"
        :hide-rest="index === 0"
        :sort="edit"
        @click="openExerciseEditDialog(index)"
      >
      </exercise-card>
    </template>
  </draggable>

  <v-card v-if="edit" variant="tonal" @click="emit('add')" :class="{ 'cursor-pointer': edit }">
    <v-card-title class="text-center">
      <v-icon icon="$plus" size="x-small" class="mr-2"></v-icon>
      <span>{{ t('Add exercise') }}</span>
    </v-card-title>
  </v-card>

  <!-- edit dialog -->
  <exercise-edit
    v-model="exerciseEditDialog"
    :workout="workout"
    :index="exerciseIndex"
    @time="(time) => (workout.time = time)"
    @index="(index) => (exerciseIndex = index)"
    @show="exerciseEditDialog = !exerciseEditDialog"
  />
</template>

<style lang="scss" scoped>
.exercise-card:last-child:deep(.v-card):last-child:after {
  border: none;
}
</style>
