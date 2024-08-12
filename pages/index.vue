<!-- pages/index.vue -->
<template>
  <div class="container">
    <h1>Your Memories</h1>
    
    <button @click="showAddForm = true" v-if="!showAddForm">Add New Memory</button>
    
    <TransitionGroup name="fade">
      <MemoryForm
        v-if="showAddForm"
        @save="handleAddMemory"
        @cancel="showAddForm = false"
      />
    </TransitionGroup>
    
    <MemoryList
      :memories="memoriesStore.memories"
      @edit="handleEditMemory"
      @delete="handleDeleteMemory"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMemoriesStore } from '../stores/memories';
import MemoryList from '~/components/MemoryList.vue';
import MemoryForm from '~/components/MemoryForm.vue';
import  { type Memory } from '~/types/interfaces';

const memoriesStore = useMemoriesStore();
const showAddForm = ref(false);

const handleAddMemory = (memoryData: Partial<Memory>) => {
  memoriesStore.addMemory(memoryData as Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>);
  showAddForm.value = false;
};

const handleEditMemory = (id: string) => {
  navigateTo(`/memories/${id}`);
};

const handleDeleteMemory = (id: string) => {
  if (confirm('Are you sure you want to delete this memory?')) {
    memoriesStore.deleteMemory(id);
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

button {
  display: block;
  margin: 0 auto 20px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>