<template>
  <div class="bg-white rounded-lg shadow p-4">
    <div class="flex justify-between items-start">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">{{ memory.title }}</h2>
        <p class="text-sm text-gray-600">{{ memory.category }}</p>
      </div>
      <div class="flex items-center">
        <StarIcon v-for="i in memory.rating" :key="i" class="w-5 h-5 text-yellow-400" />
        <StarIcon v-for="i in 5 - memory.rating" :key="i + memory.rating" class="w-5 h-5 text-gray-300" />
      </div>
    </div>
    <p class="text-gray-700 mt-2">{{ memory.notes }}</p>
    <div class="flex flex-wrap gap-2 mt-2">
      <span v-for="tag in memory.tags" :key="tag" class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
        {{ tag }}
      </span>
    </div>
    <div v-if="memory.location" class="flex items-center mt-2 text-sm text-gray-600">
      <MapPinIcon class="w-4 h-4 mr-1" />
      {{ memory.location.address }}
    </div>
    <div v-if="memory.url" class="mt-2">
      <a :href="memory.url" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline text-sm flex items-center">
        <LinkIcon class="w-4 h-4 mr-1" />
        View Recipe
      </a>
    </div>
    <div class="mt-2 text-xs text-gray-500">
      Created: {{ formatDate(memory.createdAt) }}
    </div>
    <div class="mt-4 flex justify-end space-x-2">
      <button @click="handleEdit" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
        Edit
      </button>
      <button @click="handleDelete" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
        Delete
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { StarIcon, MapPinIcon, LinkIcon } from 'lucide-vue-next'
import { type Memory } from '~/types/interfaces'

const props = defineProps<{
  memory: Memory
}>()

const emit = defineEmits<{
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}>()

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const handleEdit = () => {
  emit('edit', props.memory.id)
}

const handleDelete = () => {
  emit('delete', props.memory.id)
}
</script>