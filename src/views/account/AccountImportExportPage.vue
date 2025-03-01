<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { useWorkoutsStore } from '@/stores/workouts.store'
import { Workout } from '@/models/workout.model'
import AppContainer from '@/components/organisms/AppContainer/AppContainer.vue'

const { t } = useI18n()
const workoutsStore = useWorkoutsStore()
const fileInput = ref<File | File[] | null>(null)
const importError = ref<string>('')
const importSuccess = ref<string>('')

useHead({
  title: `${t('Import')} / ${t('Export')} ${t('Workouts')}`,
  meta: [{ name: 'description', content: '' }]
})

const importSystem = ref<string>('HangTime')
const importSystems = ref([
  {
    title: 'HangTime'
  },
  {
    title: 'Linebreaker App',
    subtitle: '🇩🇪 Target10A'
    // disabled: true
  }
])

const handleImport = async () => {
  if (!fileInput.value) {
    importError.value = t('Please select a file to import')
    return
  }

  try {
    if (!Array.isArray(fileInput.value)) {
      const fileContent = await fileInput.value.text()
      const data = JSON.parse(fileContent)

      if (importSystem.value === 'HangTime') {
        if (!Array.isArray(data)) return
        // Convert each workout object to Workout instance and save
        for (const workout of data) {
          const newWorkout = new Workout(workout)
          await workoutsStore.createUserWorkout(newWorkout)
        }
      } else if (importSystem.value === 'Linebreaker App') {
        Object.keys(data).forEach(async (key) => {
          // Skip "version" or anything that isn’t an array of workouts
          if (key === 'version') return
          if (!Array.isArray(data[key])) return

          interface IExercise10A {
            title: string
            description: string
            leftHand: number
            rightHand: number
            onTime: number
            offTime: number
            repetitions: number
            pause: number
          }

          interface IWorkout10A {
            title: string
            description: string
            mode?: 'hangboard'
            exercises: IExercise10A[]
          }

          const companies: Record<string, { hangboard: number; company: number }> = {
            LinebreakerBASE: { hangboard: 0, company: 14 },
            LinebreakerPRO: { hangboard: 1, company: 14 },
            LinebreakerAIR: { hangboard: 2, company: 14 },
            LinebreakerCRIMP: { hangboard: 3, company: 14 },
            LinebreakerRAIL: { hangboard: 4, company: 14 },
            LinebreakerCUBE: { hangboard: 5, company: 14 },
            beastmaker1000: { hangboard: 0, company: 1 },
            beastmaker2000: { hangboard: 1, company: 1 }
          }

          const workouts = data[key] as IWorkout10A[]

          for (const workout of workouts) {
            const mappedWorkout: Partial<Workout> = {
              name: workout.title,
              description: workout.description,
              hangboard: companies[key].hangboard,
              company: companies[key].company,
              exercises: workout.exercises?.map((exercise: IExercise10A) => ({
                exercise: 0, // We can't map the name
                grip: 0, // We can't map the grip
                level: 0, // We can't map the level
                pullups: 0, // We can't map the pullups
                weight: 0, // We can't map the weight
                hold: exercise.onTime,
                rest: exercise.offTime,
                left: exercise.leftHand,
                right: exercise.rightHand,
                repeat: exercise.repetitions,
                pause: exercise.pause,
                notes: exercise.description
              }))
            }
            const newWorkout = new Workout(mappedWorkout)
            await workoutsStore.createUserWorkout(newWorkout)
          }
        })
      }

      importSuccess.value = t('Workouts imported successfully')
      importError.value = ''
      fileInput.value = null
    }
  } catch (error) {
    console.error(error)
    importError.value = t('Error importing workouts: Invalid file format')
    importSuccess.value = ''
  }
}

const handleExport = async () => {
  // Get all user's workouts
  const workouts = await workoutsStore.fetchUserWorkouts()

  console.log(workouts)

  // Map workouts
  const workoutsToExport = workouts.map((workout) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, share, subscribers, subscribers_count, user, ...workoutWithoutUserSubscribersId } =
      workout
    return workoutWithoutUserSubscribersId
  })

  // Create a JSON file
  const workoutsJson = JSON.stringify(workoutsToExport, null, 2)
  const blob = new Blob([workoutsJson], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  // Create download link and trigger download
  const link = document.createElement('a')
  link.href = url
  link.download = `workouts-export-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
</script>

<template>
  <app-container toolbar-prepend toolbar-prepend-url="/account">
    <template #title> {{ t('Import') }} / {{ t('Export') }} {{ t('Workouts') }}</template>

    <template #default>
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-alert v-if="importError" type="error" :text="importError" class="mb-4" />
            <v-alert v-if="importSuccess" type="success" :text="importSuccess" class="mb-4" />
            <v-card>
              <v-card-title>{{ t('Import') }}</v-card-title>
              <v-card-text>
                <p class="mb-4">
                  {{
                    t(
                      'If you have workouts from a different system, Hangtime can import them into this account. To get started select the system to import from and click the button below.'
                    )
                  }}
                </p>
                <v-select
                  :item-props="true"
                  :label="t('System')"
                  v-model="importSystem"
                  :items="importSystems"
                ></v-select>
                <v-file-input
                  v-model="fileInput"
                  :label="`${t('Import')} ${t('Workouts')}`"
                  accept="application/json"
                />
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" :disabled="!fileInput" @click="handleImport">
                  {{ t('Import') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>{{ t('Export') }}</v-card-title>
              <v-card-text>
                {{
                  t(
                    'When you click the button below HangTime will create an JSON file for you to save to your device. This file will contain your workout name, description, exercises, and other workout data. Once you’ve saved the downloaded file, you can use the Import function in another HangTime account to import the workouts. '
                  )
                }}
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" @click="handleExport">
                  {{ t('Download Export File') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-container>
</template>

<style lang="scss" scoped></style>
