import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import * as missionService from '@/features/completionsPage/services/mission.service';

export function useCompletions() {
  const route = useRoute();
  const missionId = route.params.missionId;

  const completions = ref([]);
  const pagination = ref(null);
  const isLoading = ref(true);
  const error = ref(null);

  const fetchCompletions = async (page = 1) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await missionService.getUrlMissionCompletions(missionId, { page, limit: 10 });
      if (response.success) {
        completions.value = response.data;
        pagination.value = response.meta?.pagination || null;
      } else {
        throw new Error(response.error?.message || 'Failed to fetch completions');
      }
    } catch (e) {
      error.value = e.message;
      completions.value = [];
      pagination.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  const updateCompletionStatus = async (completionId, status, moderator_comment = null) => {
    try {
      const payload = { status };
      if (moderator_comment) {
        payload.moderator_comment = moderator_comment;
      }
      await missionService.updateUrlMissionCompletionStatus(missionId, completionId, payload);
      // Refetch current page
      await fetchCompletions(pagination.value?.page || 1);
    } catch (e) {
      console.error('Failed to update completion status:', e);
      // Error message is already shown by toast in fetch.js
    }
  };

  onMounted(() => fetchCompletions(1));

  return {
    completions,
    pagination,
    isLoading,
    error,
    fetchCompletions,
    updateCompletionStatus,
  };
}
