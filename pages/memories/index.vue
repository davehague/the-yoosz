<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">My Memories</h1>
    <MemoryList :memories="memoriesStore.memories" />
  </div>
</template>

<script setup lang="ts">
import { useMemoriesStore } from '@/stores/memories';

const memoriesStore = useMemoriesStore();
</script>