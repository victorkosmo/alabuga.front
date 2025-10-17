// src/features/ranksPanel/composables/useRanks.js
import { ref, onMounted } from 'vue';
import * as ranksService from '../services/ranks.service';

export function useRanks() {
  const ranks = ref([]);
  const pagination = ref(null);
  const isLoading = ref(true);

  const fetchRanks = async (page = 1) => {
    isLoading.value = true;
    try {
      const response = await ranksService.getRanks({ page, limit: 10 });
      if (response.success) {
        ranks.value = response.data;
        pagination.value = response.meta.pagination;
      } else {
        ranks.value = [];
        pagination.value = null;
      }
    } catch (error) {
      console.error('Failed to fetch ranks:', error);
      ranks.value = [];
      pagination.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => fetchRanks());

  return {
    ranks,
    pagination,
    isLoading,
    fetchRanks,
  };
}
