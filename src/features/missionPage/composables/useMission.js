import { ref, onMounted, computed } from 'vue';
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
  const competencies = ref([]);
  const isUpdatingAchievement = ref(false);
  const isUploadingCover = ref(false);

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

  const fetchCompetencies = async () => {
    try {
      const response = await missionService.getMinimalCompetencies(campaignId);
      if (response.success) {
        competencies.value = response.data;
      }
    } catch (e) {
      console.error('Failed to load competencies list', e);
    }
  };

  const uploadCover = async (file) => {
    if (!mission.value) return;

    isUploadingCover.value = true;
    try {
      const missionId = mission.value.id;
      const missionType = mission.value.type;
      let updatedMission;

      if (missionType === 'MANUAL_URL') {
        updatedMission = await missionService.uploadUrlMissionCover(missionId, file);
      } else if (missionType === 'QR_CODE') {
        updatedMission = await missionService.uploadQrMissionCover(missionId, file);
      } else if (missionType === 'QUIZ') {
        updatedMission = await missionService.uploadQuizMissionCover(missionId, file);
      }

      if (updatedMission) {
        mission.value.cover_url = updatedMission.cover_url;
      }
    } catch (e) {
      console.error('Failed to upload cover', e);
      // toast is handled by service
    } finally {
      isUploadingCover.value = false;
    }
  };

  const updateRequiredAchievement = async (newAchievementId) => {
    isUpdatingAchievement.value = true;
    try {
      const oldAchievementId = mission.value.required_achievement_id;

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
    fetchCompetencies();
  });

  const competencyRewardsWithNames = computed(() => {
    if (!mission.value?.competency_rewards || !competencies.value.length) {
      return [];
    }
    const competencyMap = new Map(competencies.value.map(c => [c.id, c.name]));
    return mission.value.competency_rewards.map(reward => ({
      ...reward,
      name: competencyMap.get(reward.competency_id) || 'Неизвестная компетенция'
    }));
  });

  return {
    mission,
    isLoading,
    error,
    fetchMission,
    achievements,
    isUpdatingAchievement,
    updateRequiredAchievement,
    isUploadingCover,
    uploadCover,
    competencyRewardsWithNames,
  };
}
