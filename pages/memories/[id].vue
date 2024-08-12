<!-- pages/memories/[id].vue -->
<template>
  <div v-if="memory" class="memory-detail">
    <h1>{{ isEditing ? 'Edit Memory' : memory.title }}</h1>
    
    <template v-if="!isEditing">
      <div class="memory-info">
        <p><strong>Category:</strong> {{ memory.category }}</p>
        <p><strong>Tags:</strong> {{ memory.tags.join(', ') }}</p>
        <p><strong>Rating:</strong> {{ '⭐'.repeat(memory.rating) }}</p>
        <p><strong>Notes:</strong> {{ memory.notes }}</p>
        <p v-if="memory.location"><strong>Location:</strong> {{ memory.location.address }}</p>
        <a v-if="memory.url" :href="memory.url" alt="Memory URL">{{ memory.url }}</a>
      </div>
      
      <div class="actions">
        <button @click="isEditing = true">Edit</button>
        <button @click="handleDelete" class="delete">Delete</button>
        <button @click="router.push('/memories')" class="back">Back to List</button>
      </div>
    </template>
    
    <MemoryForm
      v-else
      :memory="memory"
      @save="handleSave"
      @cancel="isEditing = false"
    />
  </div>
  <div v-else-if="loading" class="loading">
    Loading memory...
  </div>
  <div v-else class="error">
    Memory not found
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

<style scoped>
.memory-detail {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.memory-info p {
  margin-bottom: 10px;
}

img {
  max-width: 100%;
  height: auto;
  margin-top: 20px;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  opacity: 0.8;
}

button.delete {
  background-color: #f44336;
  color: white;
}

button.back {
  background-color: #2196F3;
  color: white;
}

.loading, .error {
  text-align: center;
  padding: 20px;
}
</style>