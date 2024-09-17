<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div v-if="memory" class="bg-white rounded-lg shadow p-6">
      <h1 class="text-3xl font-bold text-center mb-6">{{ isEditing ? 'Edit Memory' : memory.title }}</h1>
      
      <template v-if="!isEditing">
        <div class="space-y-4">
          <p><span class="font-semibold">Category:</span> {{ memory.category }}</p>
          <p><span class="font-semibold">Tags:</span> {{ memory.tags.join(', ') }}</p>
          <p><span class="font-semibold">Rating:</span> {{ '⭐'.repeat(memory.rating) }}</p>
          <p><span class="font-semibold">Notes:</span> {{ memory.notes }}</p>
          <p v-if="memory.location"><span class="font-semibold">Location:</span> {{ memory.location.address }}</p>
          <a v-if="memory.url" :href="memory.url" class="text-blue-600 hover:underline">{{ memory.url }}</a>
        </div>
        
        <div class="flex justify-between mt-8">
          <button @click="isEditing = true" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Edit</button>
          <button @click="handleDelete" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Delete</button>
          <button @click="router.push('/memories')" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition">Back to List</button>
        </div>
      </template>
      
      <MemoryForm
        v-else
        :memory="memory"
        @save="handleSave"
        @cancel="isEditing = false"
      />
    </div>
    <div v-else-if="loading" class="text-center py-8">
      Loading memory...
    </div>
    <div v-else class="text-center py-8 text-red-500">
      Memory not found
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMemoriesStore } from '../../stores/memories';
import { type Memory } from '@/types/interfaces';
import MemoryForm from '@/components/MemoryForm.vue';

const route = useRoute();
const router = useRouter();
const memoriesStore = useMemoriesStore();

const memory = ref<Memory | null>(null);
const isEditing = ref(false);
const loading = ref(true);

onMounted(async () => {
  const id = route.params.id as string;
  try {
    memory.value = await memoriesStore.getMemoryById(id);
    if (!memory.value) {
      console.error('Memory not found');
      router.push('/memories');
    }
  } catch (error) {
    console.error('Error fetching memory:', error);
  } finally {
    loading.value = false;
  }
});

const handleSave = async (updatedMemory: Partial<Memory>) => {
  if (memory.value) {
    try {
      await memoriesStore.updateMemory(memory.value.id, updatedMemory);
      memory.value = { ...memory.value, ...updatedMemory };
      isEditing.value = false;
    } catch (error) {
      console.error('Error updating memory:', error);
      // Handle error (e.g., show error message to user)
    }
  }
};

const handleDelete = async () => {
  if (memory.value && confirm('Are you sure you want to delete this memory?')) {
    try {
      await memoriesStore.deleteMemory(memory.value.id);
      router.push('/memories');
    } catch (error) {
      console.error('Error deleting memory:', error);
      // Handle error (e.g., show error message to user)
    }
  }
};
</script>