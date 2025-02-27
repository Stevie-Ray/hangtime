<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useWorkoutsStore } from '@/stores/workouts.store'
import { IWorkout } from '@/interfaces/workout.interface'

const { createUserWorkout, updateUserWorkout } = useWorkoutsStore()

const router = useRouter()

const { t } = useI18n()

const workout = defineModel<IWorkout>({ required: true })

const { showDialog = false } = defineProps<{
  showDialog?: boolean
}>()

const emit = defineEmits(['toggle-dialog'])

const workoutSave = () => {
  if (workout.value) {
    if (!workout.value.id) {
      // Create new workout
      createUserWorkout(workout.value)
    } else {
      // Update existing workout
      updateUserWorkout(workout.value)
    }
  }

  emit('toggle-dialog')

  router.push('/workouts')
}

const rules = {
  number: (v: number | string) => !isNaN(Number(v)) || 'NaN',
  required: (v: unknown) => !!v || 'This field is required',
  length: (length: number) => (v: string) =>
    (v || '').length <= length || `Max ${length} characters`,
  min: (min: number) => (v: number) => v >= min || `A minimum of ${min} is allowed`,
  max: (max: number) => (v: number) => v <= max || `A maximum of ${max} is allowed`
}
</script>

<template>
  <v-dialog
    :model-value="showDialog"
    :scrim="false"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar>
        <v-btn color="text" icon="$close" @click="emit('toggle-dialog')"></v-btn>
        <v-toolbar-title> {{ t("You're almost there") }}!</v-toolbar-title>

        <v-toolbar-items>
          <v-btn
            v-if="workout"
            :disabled="
              workout.name === '' ||
              typeof workout.name === 'undefined' ||
              workout.description === '' ||
              typeof workout.description === 'undefined' ||
              typeof workout.level === 'undefined'
            "
            icon="$contentSaveOutline"
            @click="workoutSave"
          ></v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col cols="12" v-if="workout">
            <v-label>{{ t('Name your workout and get going') }}.</v-label>

            <v-divider class="mb-4" thickness="0"></v-divider>

            <v-text-field
              v-model="workout.name"
              :label="t('Name')"
              :placeholder="t('New workout')"
              :rules="[rules.required, rules.length(36)]"
              class="required"
              counter="36"
              required
            >
            </v-text-field>

            <v-textarea
              v-model="workout.description"
              :label="t('Description')"
              :placeholder="t('For example indicate when this workout is most beneficial')"
              :rules="[rules.required, rules.length(140)]"
              class="required"
              counter="140"
              required
              rows="3"
            ></v-textarea>

            <v-text-field
              v-model="workout.video"
              :label="t('Video')"
              placeholder="https://www.youtube.com/watch?v=xxxxxxxx"
            >
            </v-text-field>

            <v-label>{{ t('Difficulty') }}</v-label>
            <v-chip-group v-model="workout.level" class="required">
              <v-chip :value="1">{{ t('easy') }}</v-chip>
              <v-chip :value="2">{{ t('normal') }}</v-chip>
              <v-chip :value="3">{{ t('hard') }}</v-chip>
            </v-chip-group>

            <v-checkbox
              v-model="workout.share"
              :label="t('Share with the community')"
              hide-details="auto"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
.required :deep(label::after) {
  content: '*';
  margin-left: 4px;
  color: rgb(var(--v-theme-error));
}
</style>
