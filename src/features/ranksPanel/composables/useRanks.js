// src/features/ranksPanel/composables/useRanks.js
import { ref, onMounted, reactive } from 'vue';
import * as ranksService from '../services/ranks.service';

export function useRanks() {
  const ranks = ref([]);
  const pagination = ref(null);
  const isLoading = ref(true);
  const isSaving = ref(false);
  const selectedRank = ref(null);

  const dialogs = reactive({
    createEdit: false,
  });

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

  const openCreateDialog = () => {
    selectedRank.value = null;
    dialogs.createEdit = true;
  };

  const openEditDialog = (rank) => {
    selectedRank.value = JSON.parse(JSON.stringify(rank));
    dialogs.createEdit = true;
  };

  const closeCreateEditDialog = () => {
    dialogs.createEdit = false;
    selectedRank.value = null;
  };

  const saveRank = async (rankData) => {
    isSaving.value = true;
    try {
      const formData = new FormData();
      for (const key in rankData) {
        if (rankData[key] !== null && rankData[key] !== undefined) {
          formData.append(key, rankData[key]);
        }
      }

      if (selectedRank.value?.id) {
        await ranksService.updateRank(selectedRank.value.id, formData);
      } else {
        await ranksService.createRank(formData);
      }
      await fetchRanks(pagination.value?.page || 1);
      closeCreateEditDialog();
    } catch (error) {
      console.error('Failed to save rank:', error);
    } finally {
      isSaving.value = false;
    }
  };

  onMounted(() => fetchRanks());

  return {
    ranks,
    pagination,
    isLoading,
    isSaving,
    selectedRank,
    dialogs,
    fetchRanks,
    openCreateDialog,
    openEditDialog,
    closeCreateEditDialog,
    saveRank,
  };
}
