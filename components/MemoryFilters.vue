<template>
  <div class="mb-6 space-y-4">
    <div class="flex space-x-4">
      <div class="w-1/2">
        <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
        <div class="relative">
          <select
            id="category"
            v-model="selectedCategory"
            @change="emitFilters"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pr-8"
          >
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <button
            v-if="selectedCategory"
            @click="clearCategory"
            class="absolute inset-y-0 right-0 flex items-center pr-7"
          >
            <XCircle class="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>
      <div class="w-1/2">
        <label for="tag" class="block text-sm font-medium text-gray-700">Tag</label>
        <div class="relative">
          <select
            id="tag"
            v-model="selectedTag"
            @change="emitFilters"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pr-8"
          >
            <option value="">All Tags</option>
            <option v-for="tag in tags" :key="tag" :value="tag">
              {{ tag }}
            </option>
          </select>
          <button
            v-if="selectedTag"
            @click="clearTag"
            class="absolute inset-y-0 right-0 flex items-center pr-7"
          >
            <XCircle class="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
    <div>
      <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
      <div class="relative">
        <input
          id="search"
          v-model="searchQuery"
          @input="emitFilters"
          type="text"
          placeholder="Search title or notes"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pr-10"
        >
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <XCircle class="h-5 w-5 text-gray-400" />
        </button>
      </div>
    </div>
    <div class="flex justify-end">
      <button
        @click="clearAll"
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center"
      >
        <RefreshCw class="h-4 w-4 mr-2" />
        Clear All Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { XCircle, RefreshCw } from 'lucide-vue-next';
import type { Memory } from '~/types/interfaces';

const props = defineProps<{
  memories: Memory[];
  categories: string[];
  tags: string[];
}>();

const emit = defineEmits<{
  (e: 'filter', filters: { category: string; tag: string; search: string }): void;
}>();

const selectedCategory = ref('');
const selectedTag = ref('');
const searchQuery = ref('');

const emitFilters = () => {
  emit('filter', {
    category: selectedCategory.value,
    tag: selectedTag.value,
    search: searchQuery.value,
  });
};

const clearCategory = () => {
  selectedCategory.value = '';
  emitFilters();
};

const clearTag = () => {
  selectedTag.value = '';
  emitFilters();
};

const clearSearch = () => {
  searchQuery.value = '';
  emitFilters();
};

const clearAll = () => {
  selectedCategory.value = '';
  selectedTag.value = '';
  searchQuery.value = '';
  emitFilters();
};

watch([selectedCategory, selectedTag, searchQuery], () => {
  emitFilters();
}, { immediate: true });
</script>