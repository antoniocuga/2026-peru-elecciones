<template>
  <div ref="root" class="dropdown" :class="[wrapperClass, { show: open }]">
    <button
      class="btn dropdown-toggle"
      type="button"
      :class="buttonClass"
      :aria-expanded="open ? 'true' : 'false'"
      @click.stop="toggle"
    >
      {{ text }}
    </button>
    <div class="dropdown-menu" :class="[{ show: open }, menuClass]">
      <slot :close="close" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DropdownBs4',
  props: {
    text: { type: String, required: true },
    variant: { type: String, default: 'secondary' }, // maps to btn-*
    wrapperClass: { type: [String, Array, Object], default: '' },
    menuClass: { type: [String, Array, Object], default: '' },
  },
  data() {
    return { open: false }
  },
  computed: {
    buttonClass() {
      return `btn-${this.variant}`
    },
  },
  mounted() {
    this._onDocClick = (e) => {
      const root = this.$refs.root
      if (!root) return
      if (!root.contains(e.target)) this.open = false
    }
    document.addEventListener('click', this._onDocClick)
  },
  beforeUnmount() {
    document.removeEventListener('click', this._onDocClick)
  },
  methods: {
    toggle() {
      this.open = !this.open
    },
    close() {
      this.open = false
    },
  },
}
</script>
