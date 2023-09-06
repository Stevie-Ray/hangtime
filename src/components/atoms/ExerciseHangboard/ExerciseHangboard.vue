<script setup>
import { computed, defineEmits, defineProps } from 'vue'
import InlineSvg from 'vue-inline-svg'
import { useUser } from '@/stores/user'

const { getHangboardByIds } = useUser()

const props = defineProps({
  exercise: {
    type: Object
  },
  hangboard: {
    type: Object,
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

const hangboardImage = () => {
  if (getHangboard.value?.sides?.length) {
    if (props.exercise?.rotate) {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      return require(
        `@/assets/${getHangboard.value?.sides[props.exercise.rotate].image}`
      )
    }
    // eslint-disable-next-line global-require,import/no-dynamic-require
    return require(`@/assets/${getHangboard.value?.sides[0].image}`)
  }
  if (getHangboard.value) {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    return require(`@/assets/${getHangboard.value?.image}`)
  }
  return ''
}

const classHold = (hand) => {
  return props.exercise && props.exercise[hand] !== null
    ? `h${props.exercise[hand] + 1}`
    : null
}

const toggleHold = (hand, e) => {
  if (props.edit) {
    const hold = e.target.id
    const n = hold.startsWith('h')
    if (n && hold.length <= 3) {
      const number = parseInt(hold.substr(1), 10) - 1
      emit(hand, number)
    }
  }
}

const nextImage = () => {
  if (props.exercise.rotate === undefined) {
    emit('rotate', 1)
  } else if (props.exercise.rotate + 1 !== getHangboard.value.sides.length) {
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
      icon="mdi-format-rotate-90"
    >
    </v-btn>
    <div class="hangboard d-flex">
      <div class="hangboard--left">
        <inline-svg
          @click="toggleHold('left', $event)"
          :src="hangboardImage()"
          :class="classHold('left')"
          class="hangboard__img hangboard__img--left w-100 h-100"
        >
        </inline-svg>
      </div>
      <div class="hangboard--right">
        <inline-svg
          @click="toggleHold('right', $event)"
          :src="hangboardImage()"
          :class="classHold('right')"
          class="hangboard__img hangboard__img--left w-100 h-100"
        >
        </inline-svg>
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
