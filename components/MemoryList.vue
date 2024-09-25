<template>
  <div>
    <MemoryFilters 
      :memories="memories" 
      :categories="uniqueCategories"
      :tags="uniqueTags"
      @filter="applyFilters" 
    />
    <div v-if="filteredMemories.length > 0" class="space-y-4 mt-6">
      <MemoryCard 
        v-for="memory in filteredMemories" 
        :key="memory.id" 
        :memory="memory"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
    <div v-else class="text-center mt-6 text-gray-500">
      No memories found matching the current filters.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useMemoriesStore } from '~/stores/memories'
import MemoryCard from './MemoryCard.vue'
import MemoryFilters from './MemoryFilters.vue'
import { useRouter } from 'vue-router'
import type { Memory } from '~/types/interfaces'

const memoriesStore = useMemoriesStore()
const router = useRouter()

const memories = computed(() => memoriesStore.memories)

const uniqueCategories = computed(() => {
  const categories = new Set<string>()
  for (const memory of memories.value) {
    if (memory.category) {
      categories.add(memory.category)
    }
  }
  return Array.from(categories).sort()
})

const uniqueTags = computed(() => {
  const tags = new Set<string>()
  for (const memory of memories.value) {
    for (const tag of memory.tags) {
      if (tag) {
        tags.add(tag)
      }
    }
  }
  return Array.from(tags).sort()
})

const filters = ref({
  category: '',
  tag: '',
  search: '',
})

const filteredMemories = ref<Memory[]>([])

const applyFilters = (newFilters: { category: string; tag: string; search: string }) => {
  filters.value = newFilters
}

const debouncedFilter = useDebounce(filterMemories, 300)

watch(
  [() => filters.value, memories],
  () => {
    debouncedFilter()
  },
  { deep: true }
)

function filterMemories() {
  filteredMemories.value = memories.value.filter(memory => {
    const categoryMatch = !filters.value.category || memory.category === filters.value.category
    const tagMatch = !filters.value.tag || memory.tags.includes(filters.value.tag)
    
    if (!filters.value.search) {
      return categoryMatch && tagMatch
    }
    
    const searchLower = filters.value.search.toLowerCase()
    const searchMatch = 
      (memory.title?.toLowerCase().includes(searchLower) ?? false) ||
      (memory.notes?.toLowerCase().includes(searchLower) ?? false)
    
    return categoryMatch && tagMatch && searchMatch
  })
}

onMounted(async () => {
  await memoriesStore.fetchMemories()
  filterMemories()
})

const handleEdit = (id: string) => {
  router.push({ path: `/memories/${id}`, query: { edit: 'true' } })
}

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this memory?')) {
    try {
      await memoriesStore.deleteMemory(id)
      filterMemories()
    } catch (error) {
      console.error('Failed to delete memory:', error)
      alert('Failed to delete memory. Please try again.')
    }
  }
}

function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return ((...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }) as T
}
</script>