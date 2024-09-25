<template>
  <div>
    <MemoryFilters :memories="allMemories" :tags="uniqueTags" @filter="applyFilters" />
    <div v-if="paginatedMemories.length > 0" class="space-y-4 mt-6">
      <MemoryCard 
        v-for="memory in paginatedMemories" 
        :key="memory.id" 
        :memory="memory" 
        @edit="handleEdit"
        @delete="handleDelete" 
      />
    </div>
    <div v-else class="text-center mt-6 text-gray-500">
      No memories found matching the current filters.
    </div>
    
    <!-- Pagination controls -->
    <div class="mt-6 flex justify-center">
      <button 
        @click="prevPage" 
        :disabled="currentPage === 1"
        class="px-4 py-2 mr-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span class="px-4 py-2">Page {{ currentPage }} of {{ totalPages }}</span>
      <button 
        @click="nextPage" 
        :disabled="currentPage === totalPages"
        class="px-4 py-2 ml-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, inject } from 'vue'
import { useMemoriesStore } from '~/stores/memories'
import MemoryCard from './MemoryCard.vue'
import MemoryFilters from './MemoryFilters.vue'
import { useRouter } from 'vue-router'

const memoriesStore = useMemoriesStore()
const router = useRouter()
const currentCategory = inject('currentCategory', ref('')) as Ref<string>

const allMemories = computed(() => memoriesStore.memories)

const uniqueTags = computed(() => {
  const tags = new Set<string>()
  for (const memory of allMemories.value) {
    for (const tag of memory.tags) {
      if (tag) {
        tags.add(tag)
      }
    }
  }
  return Array.from(tags).sort()
})

const filters = ref({
  tag: '',
  search: '',
})

const filteredMemories = computed(() => {
  return allMemories.value.filter((memory) => {
    const categoryMatch = memory.category.toLowerCase() === currentCategory.value.toLowerCase();
    const tagMatch = !filters.value.tag || memory.tags.includes(filters.value.tag);
    const searchMatch = !filters.value.search ||
      memory.title.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      (memory.notes && memory.notes.toLowerCase().includes(filters.value.search.toLowerCase()));

    return categoryMatch && tagMatch && searchMatch;
  });
});

// Pagination
const itemsPerPage = 10
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(filteredMemories.value.length / itemsPerPage))

const paginatedMemories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredMemories.value.slice(start, end)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const applyFilters = (newFilters: { tag: string; search: string }) => {
  filters.value = newFilters
  currentPage.value = 1 // Reset to first page when filters change
}

onMounted(async () => {
  await memoriesStore.fetchMemories()
})

watch(currentCategory, () => {
  // Reset filters and pagination when category changes
  filters.value = { tag: '', search: '' }
  currentPage.value = 1
})

const handleEdit = (id: string) => {
  router.push({ path: `/memories/${id}`, query: { edit: 'true' } })
}

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this memory?')) {
    try {
      await memoriesStore.deleteMemory(id)
      if (paginatedMemories.value.length === 1 && currentPage.value > 1) {
        currentPage.value--
      }
    } catch (error) {
      console.error('Failed to delete memory:', error)
      alert('Failed to delete memory. Please try again.')
    }
  }
}
</script>