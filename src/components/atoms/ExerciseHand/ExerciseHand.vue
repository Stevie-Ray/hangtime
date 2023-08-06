<script setup>
import { computed, defineEmits, defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import InlineSvg from 'vue-inline-svg'

const { t } = useI18n()

const props = defineProps({
  exercise: {
    type: Object
  },
  edit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['left', 'right'])

function toggleLeft(e) {
  if (props.edit) {
    const finger = e.target.id
    const n = finger.startsWith('f')

    if (n && finger.length <= 2) {
      const number = parseInt(finger.substr(1), 10)
      let left = []
      if (props.exercise.leftHand) {
        if (props.exercise.leftHand.length > 3) return
        left = [...props.exercise.leftHand]
      }
      left.push(number)
      emit('left', left)
    }
  }
}

const leftClass = computed(() => {
  if (props.exercise.leftHand) {
    if (props.exercise.leftHand.length) {
      return props.exercise.leftHand.map((finger) => `f${finger}`).join(' ')
    }
    return `f${props.exercise.leftHand}`
  }
  return ''
})

function toggleRight(e) {
  if (props.edit) {
    const finger = e.target.id
    const n = finger.startsWith('f')

    if (n && finger.length <= 2) {
      const number = parseInt(finger.substr(1), 10)
      let right = []
      if (props.exercise.rightHand) {
        if (props.exercise.rightHand.length > 3) return
        right = [...props.exercise.rightHand]
      }
      right.push(number)
      emit('right', right)
    }
  }
}

const rightClass = computed(() => {
  if (props.exercise.rightHand) {
    if (props.exercise.rightHand.length) {
      return props.exercise.rightHand.map((finger) => `f${finger}`).join(' ')
    }
    return `f${props.exercise.rightHand}`
  }
  return ''
})

function resetHands() {
  emit('left', [])
  emit('right', [])
}
</script>

<template>
  <div class="hand__wrapper" :class="{ 'position-relative pb-12': !edit }">
    <v-list lines="one" class="hand__text w-100" v-show="edit">
      <v-list-item>
        <v-list-item-title>
          {{ t('Tap on fingers that are not allowed') }}
        </v-list-item-title>

        <template #append>
          <v-list-item-action end>
            <v-btn
              v-if="exercise.leftHand?.length || exercise.rightHand?.length"
              icon="mdi-undo"
              color="text"
              variant="text"
              @click="resetHands"
            ></v-btn>
            <v-btn
              v-else
              icon="mdi-hand-front-right"
              color="text"
              variant="text"
              disabled
            ></v-btn>
          </v-list-item-action>
        </template>
      </v-list-item>
    </v-list>
    <div
      class="hand d-flex flex-row justify-space-between w-100"
      :class="{ 'position-absolute': !edit }"
    >
      <div class="hand__left">
        <inline-svg
          @click="toggleLeft($event)"
          v-if="exercise.left !== null"
          :class="[leftClass, { large: edit }]"
          :src="require('@/assets/icons/hand.svg')"
          class="w-100"
        />
      </div>
      <div class="hand__right">
        <inline-svg
          @click="toggleRight($event)"
          v-if="exercise?.right !== null"
          :class="[rightClass, { large: edit }]"
          :src="require('@/assets/icons/hand.svg')"
          class="w-100"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hand {
  top: -30px;

  &__left {
    transform: rotateY(180deg);
  }

  svg {
    max-width: 50px;
    height: auto;

    &.large {
      max-width: 100px;
    }

    &.f1:deep(#f1),
    &.f2:deep(#f2),
    &.f3:deep(#f3),
    &.f4:deep(#f4),
    &.f5:deep(#f5) {
      visibility: hidden;
    }
  }
}
</style>
