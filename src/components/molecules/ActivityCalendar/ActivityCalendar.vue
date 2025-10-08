<script setup lang="ts">
import { computed } from 'vue'
import { useActivitiesStore } from '@/stores/activities.store'

const { activities } = useActivitiesStore()

/**
 * Convert a date to YYYY-MM-DD format using local timezone
 * @param date The date to convert
 * @return {string} The formatted date string
 */
function formatDateToLocal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Computed property that processes activities into date strings
 * Automatically updates when activities change
 */
const activityDates = computed((): string[] => {
  if (!activities || activities.length === 0) return []

  return activities
    .map((activity) => {
      if (!activity.start_date_local) return null

      try {
        const date =
          activity.start_date_local instanceof Date
            ? activity.start_date_local
            : new Date(activity.start_date_local)

        return !isNaN(date.getTime()) ? formatDateToLocal(date) : null
      } catch {
        return null
      }
    })
    .filter((date): date is string => date !== null)
})

/**
 * Check if a date has an activity (for allowed-dates prop)
 * This will make only activity days "allowed" (selectable), effectively highlighting them
 * @param val The date value from the date picker
 * @return {boolean} True if the date has an activity
 */
function allowedDates(val: unknown): boolean {
  if (!val) return false

  try {
    if (typeof val !== 'string' && typeof val !== 'number' && !(val instanceof Date)) {
      return false
    }

    const date = new Date(val)
    if (isNaN(date.getTime())) return false

    const dateStr = formatDateToLocal(date)
    return activityDates.value.includes(dateStr)
  } catch {
    return false
  }
}
</script>

<template>
  <div @click.stop @mousedown.stop @mouseup.stop>
    <v-date-picker
      hide-header
      show-adjacent-months
      elevation="0"
      border
      :allowed-dates="allowedDates"
      @click.stop
      @mousedown.stop
      @mouseup.stop
    />
  </div>
</template>

<style scoped lang="scss"></style>
