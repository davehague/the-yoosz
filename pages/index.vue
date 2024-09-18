<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">My Memories</h1>
    
    <div class="mb-6">
      <button
        @click="toggleForm"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
      >
        {{ isFormVisible ? 'Hide' : 'Add New Memory' }}
      </button>
    </div>

    <div
      class="transition-all duration-300 ease-in-out"
      :class="{ 'opacity-0 max-h-0 overflow-hidden': !isFormVisible, 'opacity-100 max-h-screen': isFormVisible }"
    >
      <MemoryForm v-if="isFormVisible" @add-memory="addMemory" />
    </div>

    <MemoryList :memories="memoriesStore.memories" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMemoriesStore } from '../stores/memories';
import { type Memory } from '~/types/interfaces';

const memoriesStore = useMemoriesStore();
const isFormVisible = ref(false);

const toggleForm = () => {
  isFormVisible.value = !isFormVisible.value;
};

const addMemory = (newMemory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>) => {
  const memory: Memory = {
    ...newMemory,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  memoriesStore.addMemory(memory);
  isFormVisible.value = false; // Hide the form after adding a memory
};
</script>