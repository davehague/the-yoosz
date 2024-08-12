<!-- components/MemoryList.vue -->
<template>
  <div class="memory-list">
    <div class="controls">
      <input v-model="searchQuery" placeholder="Search memories..." />

      <select v-model="sortOption">
        <option value="dateAdded">Date Added</option>
        <option value="rating">Rating</option>
        <option value="alphabetical">Alphabetical</option>
      </select>

      <select v-model="filterCategory">
        <option value="">All Categories</option>
        <option v-for="category in uniqueCategories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <div v-if="sortedAndFilteredMemories.length === 0" class="no-memories">
      No memories found. Try adjusting your filters or adding new memories!
    </div>

    <TransitionGroup name="list" tag="div" class="memories-container">
      <MemoryCard v-for="memory in sortedAndFilteredMemories" :key="memory.id" :memory="memory" @edit="handleEdit"
        @delete="handleDelete" />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { type Memory } from '~/types/interfaces';
import MemoryCard from './MemoryCard.vue';

const props = defineProps<{
  memories: Memory[];
}>();

const emit = defineEmits<{
  (e: 'edit', id: string): void;
  (e: 'delete', id: string): void;
}>();

const sortOption = ref('dateAdded');
const filterCategory = ref('');
const searchQuery = ref('');

const sortedAndFilteredMemories = computed(() => {
  let result = [...props.memories];

  // Apply category filter
  if (filterCategory.value) {
    result = result.filter(memory => memory.category === filterCategory.value);
  }

  // Apply search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(memory =>
      memory.title.toLowerCase().includes(query) ||
      memory.notes.toLowerCase().includes(query) ||
      memory.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Apply sorting
  switch (sortOption.value) {
    case 'dateAdded':
      result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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

const uniqueCategories = computed(() => {
  return [...new Set(props.memories.map(memory => memory.category))];
});

const handleEdit = (id: string) => {
  emit('edit', id);
};

const handleDelete = (id: string) => {
  emit('delete', id);
};
</script>

<style scoped>
.memory-list {
  max-width: 800px;
  margin: 0 auto;
}

.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.controls input,
.controls select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.no-memories {
  text-align: center;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 4px;
}

.memories-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>