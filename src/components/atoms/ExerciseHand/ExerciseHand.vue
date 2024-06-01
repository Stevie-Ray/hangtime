<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import InlineSvg from 'vue-inline-svg'
import imgIconHang from '@/assets/icons/hand.svg'

const { t } = useI18n()

const props = defineProps({
  exercise: { type: Object },
  edit: { type: Boolean, default: false }
})

const emit = defineEmits(['left', 'right'])

const toggleFinger = (hand: string, action: 'left' | 'right', finger: string) => {
  if (props.edit && props.exercise) {
    const handArray = props.exercise[hand]
    console.log(props)
    console.log(handArray)
    if (finger.startsWith('f') && finger.length <= 2) {
      const fingerNumber = parseInt(finger.substr(1), 10)
      let updatedHand: number[] = []
      if (handArray) {
        if (handArray.length > 3) return
        updatedHand = [...handArray]
      }
      updatedHand.push(fingerNumber)
      console.log(action, updatedHand)
      emit(action, updatedHand)
    }
  }
}

const getHandClass = (hand: string) => {
  if (props.exercise) {
    const handArray = props.exercise[hand]
    if (handArray) {
      if (handArray.length) {
        return handArray.map((finger: string) => `f${finger}`).join(' ')
      }
      return `f${handArray}`
    }
  }

  return ''
}

const resetHands = () => {
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
              v-if="exercise?.leftHand?.length || exercise?.rightHand?.length"
              icon="$undo"
              color="text"
              variant="text"
              @click="resetHands"
            ></v-btn>
            <v-btn v-else icon="$handFrontRight" color="text" variant="text" disabled></v-btn>
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
          @click="(e: Event) => toggleFinger('leftHand', 'left', e.target.id)"
          v-if="exercise?.left !== null"
          :class="[getHandClass('leftHand'), { large: edit }]"
          :src="imgIconHang"
          class="w-100"
        />
      </div>
      <div class="hand__right">
        <inline-svg
          @click="(e: Event) => toggleFinger('rightHand', 'right', e.target.id)"
          v-if="exercise?.right !== null"
          :class="[getHandClass('rightHand'), { large: edit }]"
          :src="imgIconHang"
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
