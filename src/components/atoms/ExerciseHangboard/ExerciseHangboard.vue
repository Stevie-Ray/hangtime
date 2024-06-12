<script setup lang="ts">
import { computed } from 'vue'
import InlineSvg from 'vue-inline-svg'
import { useUserStore } from '@/stores/user'
import { Exercise } from '@/interfaces/workouts.interface'

const { getHangboardByIds } = useUserStore()

const props = defineProps({
  exercise: {
    type: Object as () => Exercise
  },
  hangboard: {
    type: Object as () => { hangboard: number; company: number },
    required: true
  },
  edit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['left', 'right', 'rotate'])

const getHangboard = computed(() =>
  getHangboardByIds(props.hangboard.company, props.hangboard.hangboard)
)

const hangboardImage = computed(() => {
  const sides = getHangboard.value?.sides || []
  const rotateIndex = props.exercise?.rotate || 0

  if (sides.length) {
    return new URL(`/src/assets/${sides[rotateIndex].image}`, import.meta.url).href
  }

  return getHangboard.value
    ? new URL(`/src/assets/${getHangboard.value.image}`, import.meta.url).href
    : ''
})

const classHold = (hand: 'left' | 'right'): string | null => {
  return props.exercise && props.exercise[hand] !== null ? `h${props.exercise[hand]! + 1}` : null
}

const toggleHold = (hand: 'left' | 'right', e: Event) => {
  if (props.edit) {
    const hold = (e.target as HTMLElement).id
    const n = hold.startsWith('h')
    if (n && hold.length <= 3) {
      const number = parseInt(hold.slice(1), 10) - 1;
      emit(hand, number)
    }
  }
}

const nextImage = () => {
  if (props.exercise?.rotate === undefined) {
    emit('rotate', 1)
  } else if (props.exercise.rotate + 1 !== getHangboard.value?.sides?.length) {
    emit('rotate', props.exercise.rotate + 1)
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
          @click="(e) => toggleHold('left', e)"
          :src="hangboardImage"
          :class="classHold('left')"
          class="hangboard__img hangboard__img--left w-100 h-100"
        />
      </div>
      <div class="hangboard--right">
        <inline-svg
          @click="(e) => toggleHold('right', e)"
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
