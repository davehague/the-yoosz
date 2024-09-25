<template>
  <header class="bg-orange-300 text-gray-600 shadow-md">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <div class="flex space-x-4">
        <img src="/yoosz.png" alt="The Yoosz" class="h-8" />
        <h1 class="text-2xl font-bold">The Yoosz</h1>
      </div>
      <nav class="hidden md:flex space-x-4">
        <button v-for="category in categories" :key="category.value" @click="$emit('change-category', category.value)"
          class="px-3 py-1 rounded-full transition-all duration-300 ease-in-out" :class="{
            'bg-orange-500 text-white font-semibold shadow-md transform scale-105': currentCategory === category.value,
            'hover:bg-orange-200': currentCategory !== category.value
          }">
          {{ category.label }}
        </button>
      </nav>
      <button @click="toggleMobileMenu" class="md:hidden">
        <MenuIcon v-if="!isMobileMenuOpen" class="h-6 w-6" />
        <XIcon v-else class="h-6 w-6" />
      </button>
    </div>
  </header>

  <transition enter-active-class="transition-all ease-in-out duration-300" enter-from-class="opacity-0 -translate-y-4"
    enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all ease-in-out duration-300"
    leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-4">
    <nav v-if="isMobileMenuOpen" class="md:hidden bg-orange-200 text-gray-600">
      <div class="container mx-auto px-4 py-2 flex flex-col space-y-2">
        <button v-for="category in categories" :key="category.value" @click="changeCategoryMobile(category.value)"
          class="px-3 py-2 rounded-md transition-all duration-300 ease-in-out text-left" :class="{
            'bg-orange-500 text-white font-semibold': currentCategory === category.value,
            'hover:bg-orange-300': currentCategory !== category.value
          }">
          {{ category.label }}
        </button>
      </div>
    </nav>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MenuIcon, XIcon } from 'lucide-vue-next'

const props = defineProps<{
  currentCategory: string
}>()

const emit = defineEmits<{
  (e: 'change-category', category: string): void
}>()

const categories = [
  { value: 'Restaurants', label: 'Restaurants' },
  { value: 'Recipes', label: 'Recipes' },
  { value: 'Meal Plan', label: 'Meal Plan' },
]

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const changeCategoryMobile = (category: string) => {
  emit('change-category', category)
  isMobileMenuOpen.value = false
}
</script>