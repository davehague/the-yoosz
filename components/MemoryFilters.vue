<template>
  <div class="mb-6 space-y-4">
    <div>
      <label for="tag" class="block text-sm font-medium text-gray-700">Tag</label>
      <div class="relative">
        <select id="tag" v-model="selectedTag" @change="emitFilters"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pr-8">
          <option value="">All Tags</option>
          <option v-for="tag in currentTags" :key="tag" :value="tag">
            {{ tag }}
          </option>
        </select>
        <button v-if="selectedTag" @click="clearTag" class="absolute inset-y-0 right-0 flex items-center pr-7">
          <XCircle class="h-5 w-5 text-gray-400" />
        </button>
      </div>
    </div>
    <div>
      <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
      <div class="relative">
        <input id="search" v-model="searchQuery" @input="emitFilters" type="text" placeholder="Search title or notes"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pr-10">
        <button v-if="searchQuery" @click="clearSearch" class="absolute inset-y-0 right-0 flex items-center pr-3">
          <XCircle class="h-5 w-5 text-gray-400" />
        </button>
      </div>
    </div>
    <div class="flex justify-end">
      <button @click="clearAll"
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center">
        <RefreshCw class="h-4 w-4 mr-2" />
        Clear All Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { XCircle, RefreshCw } from 'lucide-vue-next';
import { useTagsStore } from '@/stores/tags';

const tagsStore = useTagsStore();
const currentCategory = inject('currentCategory') as Ref<string>
const currentTags = ref<string[]>([]);

const emit = defineEmits<{
  (e: 'filter', filters: { tag: string; search: string }): void;
}>();

const selectedTag = ref('');
const searchQuery = ref('');

const emitFilters = () => {
  emit('filter', {
    tag: selectedTag.value,
    search: searchQuery.value,
  });
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
  selectedTag.value = '';
  searchQuery.value = '';
  emitFilters();
};

const fetchTagsForCurrentCategory = async () => {
  const tags = await tagsStore.fetchTagsForCategory(currentCategory.value);
  currentTags.value = tags.sort((a, b) => a.localeCompare(b));
};

watch([selectedTag, searchQuery], () => {
  emitFilters();
}, { immediate: true });

watch(currentCategory, async (newCategory, oldCategory) => {
  if (newCategory !== oldCategory) {
    await fetchTagsForCurrentCategory();
    // Clear the selected tag when changing categories
    selectedTag.value = '';
    emitFilters();
  }
});

onMounted(async () => {
  await fetchTagsForCurrentCategory();
});
</script>