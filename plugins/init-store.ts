// plugins/init-store.ts
import { useMemoriesStore } from '@/stores/memories'

export default defineNuxtPlugin(async (nuxtApp) => {
  const memoriesStore = useMemoriesStore()
  
  // Only fetch memories if they haven't been loaded yet
  if (memoriesStore.memories.length === 0) {
    await memoriesStore.fetchMemories()
  }
})