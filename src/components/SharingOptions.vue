<template>
  <div class="share-buttons">
    <a
      v-for="item in shareLinks"
      :key="item.name"
      :href="item.href"
      target="_blank"
      rel="noopener noreferrer"
      class="share-button share-button--circle"
      :aria-label="'Compartir en ' + item.name"
    >
      <span class="share-button__text">{{ item.name }}</span>
    </a>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const shareUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''
const shareTitle = typeof document !== 'undefined' ? encodeURIComponent(document.title || '') : ''

const shareLinks = computed(() => [
  {
    name: 'Twitter',
    href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
  },
  {
    name: 'Facebook',
    href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
  },
  {
    name: 'WhatsApp',
    href: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
  },
  {
    name: 'Telegram',
    href: `https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`,
  },
])
</script>

<style lang="scss" scoped>
.share-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.share-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  min-height: 36px;
  padding: 6px 10px;
  border-radius: 42px;
  font-size: 11px;
  text-decoration: none;
  color: inherit;
  background: #f0f0f0;
  transition: background 0.2s;

  &:hover {
    background: #e0e0e0;
  }

  &--circle {
    border-radius: 50%;
  }

  &__text {
    font-size: 12px;
  }
}
</style>
