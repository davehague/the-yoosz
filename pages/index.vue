<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">My Memories</h1>
    <MemoryForm @add-memory="addMemory" />
    <MemoryList :memories="memoriesStore.memories" />
  </div>
</template>

<script setup lang="ts">
import { useMemoriesStore } from '../stores/memories';
import { type Memory } from '~/types/interfaces';

const memoriesStore = useMemoriesStore();

const addMemory = (newMemory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>) => {
  const memory: Memory = {
    ...newMemory,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
  memoriesStore.addMemory(memory);
}

</script>