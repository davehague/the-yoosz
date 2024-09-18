<template>
  <form @submit.prevent="submitForm" class="bg-white rounded-lg shadow p-4 mb-6">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
        <input v-model="form.title" type="text" id="title" required class="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
      </div>
      <div>
        <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
        <select v-model="form.category" id="category" required class="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option value="Restaurants">Restaurants</option>
          <option value="Recipes">Recipes</option>
          <option value="Drinks">Drinks</option>
          <option value="Movies">Movies</option>
          <option value="Books">Books</option>
        </select>
      </div>
      <div>
        <label for="tags" class="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
        <input v-model="tagsInput" type="text" id="tags" class="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
      </div>
      <div>
        <label for="rating" class="block text-sm font-medium text-gray-700">Rating</label>
        <select v-model="form.rating" id="rating" required class="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option v-for="i in 5" :key="i" :value="i">{{ i }} Star{{ i > 1 ? 's' : '' }}</option>
        </select>
      </div>
      <div class="md:col-span-2">
        <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
        <textarea v-model="form.notes" id="notes" rows="3" class="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
      </div>
      <div>
        <label for="url" class="block text-sm font-medium text-gray-700">URL (optional)</label>
        <input v-model="form.url" type="url" id="url" class="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
      </div>
      <div>
        <label for="address" class="block text-sm font-medium text-gray-700">Address (optional)</label>
        <input v-model="form.location.address" type="text" id="address" class="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
      </div>
    </div>
    <div class="mt-4">
      <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Add Memory
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type Memory } from '~/types/interfaces'

const emit = defineEmits<{
  (e: 'add-memory', memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>): void
}>()

const form = ref({
  title: '',
  category: 'Restaurants',
  rating: 5,
  notes: '',
  url: '',
  location: {
    address: ''
  }
})

const tagsInput = ref('')

const submitForm = () => {
  const newMemory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'> = {
    ...form.value,
    tags: tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
  }
  emit('add-memory', newMemory)
  
  // Reset form
  form.value = {
    title: '',
    category: 'Restaurants',
    rating: 5,
    notes: '',
    url: '',
    location: {
      address: ''
    }
  }
  tagsInput.value = ''
}
</script>