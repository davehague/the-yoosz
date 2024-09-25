// stores/tags.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import PersistentDataService from "@/services/PersistentDataService";

interface TagsCache {
  [category: string]: string[];
}

export const useTagsStore = defineStore(
  "tags",
  () => {
    const tagsCache = ref<TagsCache>({});

    const fetchTagsForCategory = async (
      category: string
    ): Promise<string[]> => {
      if (tagsCache.value[category]) {
        return tagsCache.value[category];
      }

      try {
        const tags = await PersistentDataService.getTagsForCategory(category);
        tagsCache.value[category] = tags;
        return tags;
      } catch (error) {
        console.error("Error fetching tags for category:", error);
        return [];
      }
    };

    return {
      tagsCache,
      fetchTagsForCategory,
    };
  },
  {
    persist: true,
  }
);
