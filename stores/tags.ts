// stores/tags.ts

import { defineStore } from 'pinia';
import PersistentDataService from '@/services/PersistentDataService';

export const useTagsStore = defineStore('tags', {
  actions: {
    async fetchTagsForCategory(category: string) {
      try {
        return await PersistentDataService.getTagsForCategory(category);
        
      } catch (error) {
        console.error("Error fetching tags for category:", error);
        return [];
      }
    },
  },
});