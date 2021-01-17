<template>
  <button :class="{ loading: isLoading }">
    <slot></slot>
    {{ isLoading ? '- loading' : '' }}
  </button>
</template>
<script>
export default {
  name: 'MyButton',
  props: {
    name: { type: String, required: true },
    isLoading: { type: Boolean, default: false }
  },
  methods: {
    clickButton() {
      this.$emit('buttonClicked', `${this.name}-button clicked`)
    }
  }
}
</script>
