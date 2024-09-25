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

        <div class="flex justify-end mt-8 space-x-4">
          <button @click="isEditing = true" class="text-blue-600 hover:text-blue-700 flex items-center">
            <Edit class="w-4 h-4 mr-1" />
            Edit
          </button>
          <button @click="handleDelete" class="text-red-600 hover:text-red-700 flex items-center">
            <Trash2 class="w-4 h-4 mr-1" />
            Delete
          </button>
          <button @click="router.push('/')" class="text-gray-600 hover:text-gray-700 flex items-center">
            <ArrowLeft class="w-4 h-4 mr-1" />
            Back to List
          </button>
        </div>
      </template>

      <MemoryForm v-if="isEditing && memory" :initial-memory="memory" @save="handleSave" @cancel="cancelEdit" />
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
import { Edit, Trash2, ArrowLeft } from 'lucide-vue-next';


const route = useRoute();
const router = useRouter();
const memoriesStore = useMemoriesStore();

const memory = ref<Memory | null>(null);
const isEditing = ref(false);
const loading = ref(true);

const fetchMemory = async (id: string) => {
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
};

onMounted(async () => {
  const id = route.params.id as string;
  await fetchMemory(id);
  isEditing.value = route.query.edit === 'true';
});

watch(() => route.query.edit, (newValue) => {
  isEditing.value = newValue === 'true';
});

watch(() => route.params.id, async (newId) => {
  if (newId) {
    loading.value = true;
    await fetchMemory(newId as string);
    isEditing.value = route.query.edit === 'true';
  }
});

const handleSave = async (updatedMemory: Partial<Memory>) => {
  if (memory.value) {
    try {
      await memoriesStore.updateMemory(memory.value.id, updatedMemory);
      memory.value = { ...memory.value, ...updatedMemory };
      isEditing.value = false;
      // Remove the edit query parameter
      router.replace({ query: {} });
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

const cancelEdit = () => {
  isEditing.value = false;
  // Remove the edit query parameter
  router.replace({ query: {} });
};
</script>