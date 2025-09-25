import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import * as missionService from '@/features/missionPage/services/mission.service';

export function useMission() {
  const route = useRoute();
  const missionId = route.params.missionId;
  const campaignId = route.params.id; // Get campaignId from route params

  const mission = ref(null);
  const isLoading = ref(true);
  const error = ref(null);

  const fetchMission = async () => {
    isLoading.value = true;
    error.value = null;
    mission.value = null;
    try {
      // Use the generic getMission function with campaignId and missionId
      const response = await missionService.getMission(campaignId, missionId);
      mission.value = response;
    } catch (e) {
      error.value = e.message || 'Failed to load mission details.';
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchMission);

  return {
    mission,
    isLoading,
    error,
    fetchMission,
  };
}
