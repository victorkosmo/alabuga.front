<template>
  <div class="flex justify-center items-center min-h-screen bg-background">
    <div v-if="loading" class="text-center">
      <p>Loading...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <p>Error loading mission:</p>
      <p>{{ error }}</p>
    </div>
    <div v-else-if="mission" class="w-full max-w-md overflow-hidden rounded-lg border bg-card text-card-foreground shadow-md p-8 text-center">
      <h1 class="text-2xl font-bold mb-4">{{ mission.title }}</h1>
      <img :src="mission.qr_url" alt="QR Code" class="mx-auto" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { unauthorizedGet } from '@/utils/fetch';

const route = useRoute();
const missionId = route.params.missionId;

const mission = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await unauthorizedGet(`/public/qr/${missionId}`);
    if (response.success) {
      mission.value = response.data;
    } else {
      throw new Error(response.error?.message || 'Failed to fetch QR mission data.');
    }
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script>
