<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="mb-6">
      <button @click="toggleForm"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out">
        {{ isFormVisible ? 'Hide' : 'Add New Memory' }}
      </button>
    </div>

    <div class="transition-all duration-300 ease-in-out"
      :class="{ 'opacity-0 max-h-0 overflow-hidden': !isFormVisible, 'opacity-100 max-h-screen': isFormVisible }">
      <MemoryForm v-if="isFormVisible" @add-memory="addMemory" :category="currentCategory" />
    </div>

    <MemoryList />
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { useMemoriesStore } from '../stores/memories';
import { type Memory } from '~/types/interfaces';
import MemoryList from '~/components/MemoryList.vue';
import MemoryForm from '~/components/MemoryForm.vue';

const memoriesStore = useMemoriesStore();
const isFormVisible = ref(false);
const currentCategory = inject('currentCategory') as Ref<string>;

const toggleForm = () => {
  isFormVisible.value = !isFormVisible.value;
};

const addMemory = (newMemory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>) => {
  const memory: Memory = {
    ...newMemory,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    category: currentCategory.value
  };
  memoriesStore.addMemory(memory);
  isFormVisible.value = false; // Hide the form after adding a memory
};
</script>