import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import * as missionService from '@/features/missionPage/services/mission.service';
import { missionTypeDetails } from '@/features/missionPage/missionTypes';

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
      // 1. Get mission type from URL query (e.g., /missions/...?type=MANUAL_URL)
      const missionType = route.query.type;
      if (!missionType) {
        throw new Error('Mission type is missing from the URL query parameters.');
      }

      // 2. Look up the configuration for this type in our map.
      const details = missionTypeDetails[missionType];
      const serviceFnName = details?.service;
      if (!serviceFnName) {
        throw new Error(`No service configuration found for mission type: "${missionType}".`);
      }

      // 3. Get the actual function from the imported mission service.
      const serviceFn = missionService[serviceFnName];
      if (typeof serviceFn !== 'function') {
        throw new Error(`Service function "${serviceFnName}" does not exist in mission.service.js.`);
      }

      // 4. Dynamically call the correct function with the missionId.
      const response = await serviceFn(missionId);
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
