<!-- components/MemoryCard.vue -->
<script setup lang="ts">
import { type Memory } from '~/types/interfaces';

const props = defineProps<{
  memory: Memory;
}>();

const emit = defineEmits<{
  (e: 'edit', id: string): void;
  (e: 'delete', id: string): void;
}>();

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString();
};

const handleEdit = () => {
  emit('edit', props.memory.id);
};

const handleDelete = () => {
  emit('delete', props.memory.id);
};
</script>

<template>
  <div class="memory-card">
    <h3>{{ memory.title }}</h3>
    <p>Category: {{ memory.category }}</p>
    <p>Rating: {{ '⭐'.repeat(memory.rating) }}</p>
    <p>Tags: {{ memory.tags.join(', ') }}</p>
    <p>Notes: {{ memory.notes }}</p>
    <p v-if="memory.location">Location: {{ memory.location.address }}</p>
    <a v-if="memory.url" :href="memory.url" alt="Memory URL" />
    <p>Created: {{ formatDate(memory.createdAt) }}</p>
    <div class="actions">
      <button @click="handleEdit">Edit</button>
      <button @click="handleDelete">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.memory-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  opacity: 0.8;
}
</style>