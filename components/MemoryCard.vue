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
      <span v-for="tag in memory.tags" :key="tag"
        class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
        {{ tag }}
      </span>
    </div>

    <div v-if="memory.location && hasPhysicalAddress(memory.location.address)" class="flex flex-col items-start mt-2 text-sm text-gray-600">
      <div class="flex items-center">
        <MapPinIcon class="w-4 h-4 mr-1" />
        {{ memory.location.address }}
      </div>
      <div class="my-2 flex space-x-2">
        <a :href="googleMapsLink" target="_blank" class="text-blue-500 hover:underline">Google Maps</a>
        <a :href="appleMapsLink" target="_blank" class="text-blue-500 hover:underline">Apple Maps</a>
      </div>
    </div>

    <div v-if="memory.url" class="mt-2">
      <a :href="memory.url" target="_blank" rel="noopener noreferrer"
        class="text-blue-600 hover:underline text-sm flex items-center">
        <LinkIcon class="w-4 h-4 mr-1" />
        View Website
      </a>
    </div>
    <div class="mt-2 text-xs text-gray-500">
      Created: {{ formatDate(memory.createdAt) }}
    </div>
    <div class="mt-4 flex justify-end space-x-2">
      <button @click="handleEdit" class="hover:text-blue-700 mr-2 flex items-center">
        <Edit class="w-4 h-4 mr-1" />
        Edit
      </button>
      <button @click="handleDelete" class="hover:text-red-700 flex items-center">
        <Trash2 class="w-4 h-4 mr-1" />
        Delete
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { StarIcon, MapPinIcon, LinkIcon, Trash2, Edit } from 'lucide-vue-next'
import { type Memory } from '~/types/interfaces'

const hasPhysicalAddress = (address: string) => {
  return !address.includes('http')
}

const appleMapsLink = computed(() => {
  if (!props.memory.location?.address) return ''
  if (props.memory.location.address.includes('http')) return ''
  return `https://maps.apple.com/?q=${encodeURIComponent(props.memory.location.address)}`
})

const googleMapsLink = computed(() => {
  if (!props.memory.location?.address) return ''
  if (props.memory.location.address.includes('http')) return ''
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(props.memory.location.address)}`
})

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