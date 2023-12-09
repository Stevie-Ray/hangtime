<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref, watch } from 'vue'
import { useWorkouts } from '@/stores/workouts'

const { createUserWorkout, updateUserWorkout } = useWorkouts()

const router = useRouter()

const { t } = useI18n()

const emit = defineEmits(['show'])

const { workout: initialWorkout } = defineProps({
  workout: {
    type: Object
  }
})

const workout = ref(initialWorkout)

watch(
  () => initialWorkout,
  (newVal) => {
    workout.value = newVal
  }
)

const dialog = ref(true)

const workoutSave = () => {
  if (!workout.value.id) {
    // new workout
    createUserWorkout(workout.value)
  } else {
    // existing workout
    updateUserWorkout(workout.value)
  }

  emit('show', false)

  router.push('/workouts')
}

const rules = {
  number: (v) => !v.isNaN || 'NaN',
  required: (v) => !!v || 'This field is required',
  length: (length) => (v) => (v || '').length <= length || `Max ${length} characters`,
  min: (min) => (v) => v >= min || `A minimun of  ${min} is allowed`,
  max: (max) => (v) => v <= max || `A maximum of  ${max} is allowed`
}
</script>

<template>
  <v-dialog v-model="dialog" :scrim="false" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar>
        <v-btn color="text" icon="$close" @click="emit('show', false)"></v-btn>
        <v-toolbar-title> {{ t("You're almost there") }}!</v-toolbar-title>

        <v-toolbar-items>
          <v-btn
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
          <v-col cols="12">
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
