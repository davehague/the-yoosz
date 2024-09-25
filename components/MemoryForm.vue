<template>
  <form @submit.prevent="submitForm" class="bg-white rounded-lg shadow p-4 mb-6">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
        <input v-model="form.title" type="text" id="title" required
          class="p-2 mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
      </div>
      <div>
        <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
        <select v-model="form.category" id="category" required
          class="p-2 mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option value="Restaurants">Restaurants</option>
          <option value="Recipes">Recipes</option>
          <option value="Meal Plan">Meal Plan</option>
        </select>
      </div>
      <div>
        <label for="tags" class="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
        <input v-model="tagsInput" type="text" id="tags"
          class="p-2 mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
      </div>
      <div>
        <label for="rating" class="block text-sm font-medium text-gray-700">Rating</label>
        <select v-model="form.rating" id="rating" required
          class="p-2 mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option v-for="i in 5" :key="i" :value="i">{{ i }} Star{{ i > 1 ? 's' : '' }}</option>
        </select>
      </div>
      <div class="md:col-span-2">
        <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
        <textarea v-model="form.notes" id="notes" rows="3"
          class="p-2 mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
      </div>
      <div>
        <label for="url" class="block text-sm font-medium text-gray-700">URL (optional)</label>
        <input v-model="form.url" type="url" id="url"
          class="p-2 mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
      </div>
      <div>
        <label for="address" class="block text-sm font-medium text-gray-700">Address (optional)</label>
        <input v-model="form.location.address" type="text" id="address"
          class="p-2 mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
      </div>
    </div>
    <div class="mt-4 flex justify-end space-x-4">
      <button type="submit" class="text-blue-600 hover:text-blue-700 flex items-center">
        <Save class="w-4 h-4 mr-1" />
        {{ isEditing ? 'Update' : 'Save' }}
      </button>
      <button v-if="isEditing" type="button" @click="$emit('cancel')"
        class="text-gray-600 hover:text-gray-700 flex items-center">
        <XCircle class="w-4 h-4 mr-1" />
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { type Memory } from '~/types/interfaces'
import { Save, XCircle } from 'lucide-vue-next'

const props = defineProps<{
  initialMemory?: Memory
  category?: string
}>()

const emit = defineEmits<{
  (e: 'save', memory: Partial<Memory>): void
  (e: 'cancel'): void
}>()

const form = ref({
  title: '',
  category: '',
  rating: 5,
  notes: '',
  url: '',
  location: {
    address: ''
  }
})

const tagsInput = ref('')
const isEditing = ref(false)

onMounted(() => {
  initializeForm()
})

watch(() => props.initialMemory, initializeForm, { deep: true })
watch(() => props.category, (newCategory) => {
  if (newCategory && !isEditing.value) {
    form.value.category = newCategory
  }
})

function initializeForm() {
  if (props.initialMemory) {
    isEditing.value = true
    form.value = {
      title: props.initialMemory.title,
      category: props.initialMemory.category,
      rating: props.initialMemory.rating,
      notes: props.initialMemory.notes,
      url: props.initialMemory.url || '',
      location: {
        address: props.initialMemory.location?.address || ''
      },
    }
    tagsInput.value = props.initialMemory.tags.join(', ')
  } else {
    resetForm()
  }
}

const submitForm = () => {
  const memoryData: Partial<Memory> = {
    ...form.value,
    tags: tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
  }

  emit('save', memoryData)

  if (!isEditing.value) {
    resetForm()
  }
}

const resetForm = () => {
  form.value = {
    title: '',
    category: props.category || '',
    rating: 5,
    notes: '',
    url: '',
    location: {
      address: ''
    }
  }
  tagsInput.value = ''
  isEditing.value = false
}
</script>