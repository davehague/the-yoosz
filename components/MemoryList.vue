<template>
  <div class="space-y-4 mt-6">
    <MemoryCard 
      v-for="memory in sortedMemories" 
      :key="memory.id" 
      :memory="memory"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useMemoriesStore } from '~/stores/memories'
import MemoryCard from './MemoryCard.vue'
import { useRouter } from 'vue-router'

const memoriesStore = useMemoriesStore()
const router = useRouter()

onMounted(async () => {
  await memoriesStore.fetchMemories()
})

const handleEdit = (id: string) => {
  router.push(`/memories/${id}`)
}

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this memory?')) {
    try {
      await memoriesStore.deleteMemory(id)
    } catch (error) {
      console.error('Failed to delete memory:', error)
      alert('Failed to delete memory. Please try again.')
    }
  }
}

const { sortedMemories } = memoriesStore
</script>