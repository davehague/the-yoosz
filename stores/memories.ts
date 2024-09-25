// stores/memories.ts
import { defineStore } from "pinia";
import { type Memory } from "@/types/interfaces";
import PersistentDataService from "@/services/PersistentDataService";

export const useMemoriesStore = defineStore("memories", () => {
  const memories = ref<Memory[]>([]);

  const fetchMemories = async () => {
    try {
      memories.value = await PersistentDataService.getAllMemories();
    } catch (error) {
      console.error("Error fetching memories:", error);
    }
  };

  const addMemory = async (
    memory: Omit<Memory, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newMemory = await PersistentDataService.addMemory(memory);
      memories.value.push(newMemory);
    } catch (error) {
      console.error("Error adding memory:", error);
      throw error;
    }
  };

  const updateMemory = async (id: string, updates: Partial<Memory>) => {
    try {
      const updatedMemory = await PersistentDataService.updateMemory(
        id,
        updates
      );
      const index = memories.value.findIndex((m) => m.id === id);
      if (index !== -1) {
        memories.value[index] = updatedMemory;
      }
    } catch (error) {
      console.error("Error updating memory:", error);
      throw error;
    }
  };

  const deleteMemory = async (id: string) => {
    try {
      await PersistentDataService.deleteMemory(id);
      memories.value = memories.value.filter((m) => m.id !== id);
    } catch (error) {
      console.error("Error deleting memory:", error);
      throw error;
    }
  };

  const getMemoryById = async (id: string): Promise<Memory | null> => {
    try {
      return (await PersistentDataService.singleRecordFetch(
        "memories",
        id
      )) as Memory | null;
    } catch (error) {
      console.error("Error fetching memory by id:", error);
      return null;
    }
  };

  const sortedMemories = computed(() => {
    return [...memories.value].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  });

  const getMemoriesByCategory = (category: string) => {
    return memories.value.filter((m) => m.category === category);
  };

  const getMemoriesByTag = (tag: string) => {
    return memories.value.filter((m) => m.tags.includes(tag));
  };

  const getAllCategories = computed(() => {
    return [...new Set(memories.value.map((m) => m.category))];
  });

  const getAllTags = computed(() => {
    return [...new Set(memories.value.flatMap((m) => m.tags))];
  });

  return {
    memories,
    fetchMemories,
    sortedMemories,
    addMemory,
    updateMemory,
    deleteMemory,
    getMemoryById,
    getMemoriesByCategory,
    getMemoriesByTag,
    getAllCategories,
    getAllTags,
  };
}, {
  persist: true
} as any);