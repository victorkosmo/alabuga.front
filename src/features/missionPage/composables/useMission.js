import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import * as missionService from '@/features/missionPage/services/mission.service';
import { missionTypeDetails } from '@/features/missionPage/missionTypes';
import * as achievementsService from '@/features/campaignPage/services/achievements.service.js';

export function useMission() {
  const route = useRoute();
  const missionId = route.params.missionId;
  const campaignId = route.params.campaignId;

  const mission = ref(null);
  const isLoading = ref(true);
  const error = ref(null);

  const achievements = ref([]);
  const isUpdatingAchievement = ref(false);

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

  const fetchAchievements = async () => {
    try {
      const response = await achievementsService.getMinimalAchievements(campaignId);
      if (response.success) {
        achievements.value = response.data;
      }
    } catch (e) {
      console.error('Failed to load achievements list', e);
    }
  };

  const updateRequiredAchievement = async (newAchievementId) => {
    isUpdatingAchievement.value = true;
    try {
      const oldAchievementId = mission.value.required_achievement?.id;

      if (oldAchievementId) {
        await achievementsService.detachAchievementFromMission(oldAchievementId, missionId);
      }

      if (newAchievementId) {
        await achievementsService.attachAchievementToMission(newAchievementId, missionId);
      }

      await fetchMission(); // Refresh mission data
    } catch (e) {
      console.error('Failed to update required achievement', e);
      // Re-fetch to ensure UI is in sync with the backend state after an error
      await fetchMission();
    } finally {
      isUpdatingAchievement.value = false;
    }
  };

  onMounted(() => {
    fetchMission();
    fetchAchievements();
  });

  return {
    mission,
    isLoading,
    error,
    fetchMission,
    achievements,
    isUpdatingAchievement,
    updateRequiredAchievement
  };
}
