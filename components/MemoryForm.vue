<!-- components/MemoryForm.vue -->
<template>
  <form @submit.prevent="handleSave" class="memory-form">
    <div class="form-group">
      <label for="title">Title</label>
      <input id="title" v-model="title" required />
    </div>

    <div class="form-group">
      <label for="category">Category</label>
      <input id="category" v-model="category" required />
    </div>

    <div class="form-group">
      <label for="tags">Tags (comma-separated)</label>
      <input id="tags" v-model="tags" />
    </div>

    <div class="form-group">
      <label for="rating">Rating</label>
      <input id="rating" v-model="rating" type="number" min="0" max="5" />
    </div>

    <div class="form-group">
      <label for="notes">Notes</label>
      <textarea id="notes" v-model="notes"></textarea>
    </div>

    <div class="form-group">
      <label for="url">URL</label>
      <input id="url" v-model="url" type="url" />
    </div>

    <div class="form-group">
      <label for="address">Address</label>
      <input id="address" v-model="address" />
    </div>

    <div class="form-group">
      <label for="latitude">Latitude (optional)</label>
      <input id="latitude" v-model="latitude" type="number" step="any" />
    </div>

    <div class="form-group">
      <label for="longitude">Longitude (optional)</label>
      <input id="longitude" v-model="longitude" type="number" step="any" />
    </div>

    <div class="form-actions">
      <button type="submit">{{ isEditing ? 'Update' : 'Save' }} Memory</button>
      <button type="button" @click="handleCancel">Cancel</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { type Memory } from '~/types/interfaces';

const props = defineProps<{
  memory?: Memory;
}>();

const emit = defineEmits<{
  (e: 'save', memory: Partial<Memory>): void;
  (e: 'cancel'): void;
}>();

const title = ref(props.memory?.title ?? '');
const category = ref(props.memory?.category ?? '');
const tags = ref(props.memory?.tags.join(', ') ?? '');
const rating = ref(props.memory?.rating ?? 0);
const notes = ref(props.memory?.notes ?? '');
const url = ref(props.memory?.url ?? '');
const address = ref(props.memory?.location?.address ?? '');
const latitude = ref(props.memory?.location?.lat?.toString() ?? '');
const longitude = ref(props.memory?.location?.lng?.toString() ?? '');

const isEditing = computed(() => !!props.memory);

const handleSave = () => {
  const memoryData: Partial<Memory> = {
    title: title.value,
    category: category.value,
    tags: tags.value.split(',').map(tag => tag.trim()),
    rating: rating.value,
    notes: notes.value,
    url: url.value || undefined,
    location: address.value
      ? {
          address: address.value,
          lat: latitude.value ? parseFloat(latitude.value) : undefined,
          lng: longitude.value ? parseFloat(longitude.value) : undefined,
        }
      : undefined,
  };

  emit('save', memoryData);
};

const handleCancel = () => {
  emit('cancel');
};
</script>



<style scoped>
.memory-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 4px;
}

input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  height: 100px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"] {
  background-color: #4CAF50;
  color: white;
}

button[type="submit"]:hover {
  background-color: #45a049;
}

button[type="button"] {
  background-color: #f44336;
  color: white;
}

button[type="button"]:hover {
  background-color: #da190b;
}
</style>