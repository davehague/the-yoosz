<template>
  <footer class="bg-gray-200 text-gray-600">
    <div class="container mx-auto px-4 py-6 text-center">
      <p>&copy; {{ currentYear }} The Yoosz App. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>