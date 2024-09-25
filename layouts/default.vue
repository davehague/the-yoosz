<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <SiteHeader :current-category="currentCategory" @change-category="changeCategory" />

    <main class="flex-grow container mx-auto px-4 py-8">
      <slot />
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentCategory = ref('Restaurants')

const changeCategory = (category: string) => {
  currentCategory.value = category
}

// Provide the current category to all child components
provide('currentCategory', currentCategory)
</script>