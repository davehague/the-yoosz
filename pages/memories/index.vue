<!-- pages/memories/index.vue -->
<template>
  <div class="memories-page">
    <h1>Browse Memories</h1>

    <div class="filters">
      <input v-model="searchQuery" placeholder="Search memories..." class="search-input" />

      <select v-model="selectedCategory" class="category-select">
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>

      <div class="tags-filter">
        <span>Tags:</span>
        <label v-for="tag in allTags" :key="tag" class="tag-checkbox">
          <input type="checkbox" :value="tag" v-model="selectedTags" />
          {{ tag }}
        </label>
      </div>

      <select v-model="sortOption" class="sort-select">
        <option value="dateAdded">Date Added</option>
        <option value="dateUpdated">Date Updated</option>
        <option value="rating">Rating</option>
        <option value="alphabetical">Alphabetical</option>
      </select>
    </div>

    <MemoryList :memories="filteredMemories" @edit="handleEditMemory" @delete="handleDeleteMemory" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMemoriesStore } from '../../stores/memories';
import MemoryList from '~/components/MemoryList.vue';

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

<style scoped>
.memories-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input,
.category-select,
.sort-select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.tags-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.tag-checkbox {
  display: flex;
  align-items: center;
  gap: 5px;
}

@media (min-width: 768px) {
  .filters {
    flex-direction: row;
    justify-content: space-between;
  }

  .search-input,
  .category-select,
  .sort-select {
    flex: 1;
  }

  .tags-filter {
    flex-basis: 100%;
  }
}
</style>