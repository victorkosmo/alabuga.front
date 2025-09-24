import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import * as missionService from '@/features/missionPage/services/mission.service';

export function useMission() {
  const route = useRoute();
  const missionId = route.params.missionId;

  const mission = ref(null);
  const isLoading = ref(true);
  const error = ref(null);

  const fetchMission = async () => {
    isLoading.value = true;
    error.value = null;
    mission.value = null;
    try {
      // The service function will throw an error if the mission type is not MANUAL_URL,
      // which will be caught here and displayed on the page.
      const response = await missionService.getUrlMission(missionId);
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
