<script setup lang="ts">
import { computed } from 'vue'
import InlineSvg from 'vue-inline-svg'
import { useUserStore } from '@/stores/user.store'
import { IExercise } from '@/interfaces/workout.interface'

const { getHangboardByIds } = useUserStore()

// not required
const exercise = defineModel<IExercise>()

const { hangboard, edit = false } = defineProps<{
  hangboard: { hangboard: number; company: number }
  edit?: boolean
}>()

const emit = defineEmits(['left', 'right', 'rotate'])

const getHangboard = computed(() => getHangboardByIds(hangboard.company, hangboard.hangboard))

const hangboardImage = computed(() => {
  const sides = getHangboard.value?.sides || []
  const rotateIndex = exercise.value?.rotate || 0

  if (sides.length) {
    return `/${sides[rotateIndex].image}`
  }

  return `/${getHangboard.value ? getHangboard.value.image : ''}`
})

const classHold = (hand: 'left' | 'right'): string | null => {
  return exercise.value && exercise.value[hand] !== null ? `h${exercise.value[hand]! + 1}` : null
}

const toggleHold = (hand: 'left' | 'right', e: Event) => {
  if (edit) {
    const hold = (e.target as HTMLElement).id
    const n = hold.startsWith('h')
    if (n && hold.length <= 3) {
      const number = parseInt(hold.slice(1), 10) - 1
      emit(hand, number)
    }
  }
}

const nextImage = () => {
  if (exercise.value?.rotate === undefined) {
    emit('rotate', 1)
  } else if (exercise.value.rotate + 1 !== getHangboard.value?.sides?.length) {
    emit('rotate', exercise.value.rotate + 1)
  } else {
    emit('rotate', 0)
  }
}
</script>

<template>
  <div class="position-relative">
    <v-btn
      v-if="edit && getHangboard?.sides?.length"
      style="position: absolute; right: -15px; top: -30px; z-index: 10"
      color="text"
      variant="text"
      size="x-small"
      @click="nextImage"
      icon="$formatRotate90"
    >
    </v-btn>
    <div class="hangboard d-flex">
      <div class="hangboard--left">
        <inline-svg
          @click="(e: Event) => toggleHold('left', e)"
          :src="hangboardImage"
          :class="classHold('left')"
          class="hangboard__img hangboard__img--left w-100 h-100"
        />
      </div>
      <div class="hangboard--right">
        <inline-svg
          @click="(e: Event) => toggleHold('right', e)"
          :src="hangboardImage"
          :class="classHold('right')"
          class="hangboard__img hangboard__img--left w-100 h-100"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hangboard {
  &--right {
    transform: rotateY(180deg);
  }
}

svg {
  &.h1:deep(#h1),
  &.h2:deep(#h2),
  &.h3:deep(#h3),
  &.h4:deep(#h4),
  &.h5:deep(#h5),
  &.h6:deep(#h6),
  &.h7:deep(#h7),
  &.h8:deep(#h8),
  &.h9:deep(#h9),
  &.h10:deep(#h10),
  &.h11:deep(#h11),
  &.h12:deep(#h12),
  &.h13:deep(#h13),
  &.h14:deep(#h14),
  &.h15:deep(#h15),
  &.h16:deep(#h16),
  &.h17:deep(#h17),
  &.h18:deep(#h18) {
    //fill: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
    fill: rgb(var(--v-theme-primary));
  }
}
</style>
