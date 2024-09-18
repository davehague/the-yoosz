<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <header class="bg-orange-300 text-gray-700 shadow-md">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <img src="public/yoosz.png" alt="The Yoosz" class="h-8" />
        <h1 class="text-2xl font-bold">The Yoosz</h1>
        <nav class="hidden md:flex space-x-4">
          <NuxtLink to="/" class="hover:text-green-200 transition-colors">Home</NuxtLink>
        </nav>
        <button @click="toggleMobileMenu" class="md:hidden">
          <MenuIcon v-if="!isMobileMenuOpen" class="h-6 w-6" />
          <XIcon v-else class="h-6 w-6" />
        </button>
      </div>
    </header>

    <transition
      enter-active-class="transition-all ease-in-out duration-300"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all ease-in-out duration-300"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <nav v-if="isMobileMenuOpen" class="md:hidden bg-green-500 text-white">
        <div class="container mx-auto px-4 py-2 flex flex-col space-y-2">
          <NuxtLink to="/" class="hover:text-green-200 transition-colors" @click="closeMobileMenu">Home</NuxtLink>
          <NuxtLink to="/memories" class="hover:text-green-200 transition-colors" @click="closeMobileMenu">Browse Memories</NuxtLink>
        </div>
      </nav>
    </transition>

    <main class="flex-grow container mx-auto px-4 py-8">
      <slot />
    </main>

    <footer class="bg-gray-200 text-gray-600">
      <div class="container mx-auto px-4 py-6 text-center">
        <p>&copy; {{ currentYear }} The Yoosz App. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MenuIcon, XIcon } from 'lucide-vue-next'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const currentYear = computed(() => new Date().getFullYear())
</script>