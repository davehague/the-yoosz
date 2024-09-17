<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8">Browse Memories</h1>

    <div class="space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4 mb-8">
      <input 
        v-model="searchQuery" 
        placeholder="Search memories..." 
        class="w-full md:w-1/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select 
        v-model="selectedCategory" 
        class="w-full md:w-1/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>

      <select 
        v-model="sortOption" 
        class="w-full md:w-1/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="dateAdded">Date Added</option>
        <option value="dateUpdated">Date Updated</option>
        <option value="rating">Rating</option>
        <option value="alphabetical">Alphabetical</option>
      </select>
    </div>

    <div class="mb-8">
      <span class="font-semibold mr-2">Tags:</span>
      <div class="flex flex-wrap gap-2">
        <label v-for="tag in allTags" :key="tag" class="inline-flex items-center">
          <input type="checkbox" :value="tag" v-model="selectedTags" class="form-checkbox h-5 w-5 text-blue-600" />
          <span class="ml-2 text-gray-700">{{ tag }}</span>
        </label>
      </div>
    </div>

    <MemoryList :memories="filteredMemories" @edit="handleEditMemory" @delete="handleDeleteMemory" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMemoriesStore } from '../../stores/memories';
import MemoryList from '~/components/MemoryList.vue';
import { useRouter } from 'vue-router';

const memoriesStore = useMemoriesStore();
const router = useRouter();

const searchQuery = ref('');
const selectedCategory = ref('');
const selectedTags = ref<string[]>([]);
const sortOption = ref('dateAdded');

const filteredMemories = computed(() => {
  let result = memoriesStore.memories;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(memory =>
      memory.title.toLowerCase().includes(query) ||
      memory.notes.toLowerCase().includes(query) ||
      memory.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  if (selectedCategory.value) {
    result = result.filter(memory => memory.category === selectedCategory.value);
  }

  if (selectedTags.value.length > 0) {
    result = result.filter(memory =>
      selectedTags.value.every(tag => memory.tags.includes(tag))
    );
  }

  switch (sortOption.value) {
    case 'dateAdded':
      result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      break;
    case 'dateUpdated':
      result.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'alphabetical':
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  return result;
});

const categories = computed(() =>
  [...new Set(memoriesStore.memories.map(m => m.category))]
);

const allTags = computed(() =>
  [...new Set(memoriesStore.memories.flatMap(m => m.tags))]
);

const handleEditMemory = (id: string) => {
  router.push(`/memories/${id}`);
};

const handleDeleteMemory = (id: string) => {
  if (confirm('Are you sure you want to delete this memory?')) {
    memoriesStore.deleteMemory(id);
  }
};
</script>