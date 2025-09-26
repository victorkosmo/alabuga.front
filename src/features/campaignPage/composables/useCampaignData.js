import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import * as campaignService from '../services/campaign.service.js';
import * as achievementsService from '../services/achievements.service.js';

export function useCampaignData() {
  const route = useRoute();
  const campaignId = route.params.id;

  const campaign = ref(null);
  const isLoading = ref(true);
  const error = ref(null);

  const achievements = ref([]);
  const achievementsPagination = ref(null);
  const isAchievementsLoading = ref(true);
  const achievementsError = ref(null);

  const fetchCampaign = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      campaign.value = await campaignService.getCampaign(campaignId);
    } catch (e) {
      error.value = e.message || 'Failed to load campaign';
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchAchievements = async (page = 1) => {
    isAchievementsLoading.value = true;
    achievementsError.value = null;
    try {
      const response = await achievementsService.getAchievements({ campaign_id: campaignId, page, limit: 10 });
      if (response.success) {
        achievements.value = response.data;
        achievementsPagination.value = response.meta.pagination;
      } else {
        throw new Error(response.error?.message || 'Failed to fetch achievements');
      }
    } catch (e) {
      achievements.value = [];
      achievementsPagination.value = null;
      achievementsError.value = e.message;
      console.error(e);
    } finally {
      isAchievementsLoading.value = false;
    }
  };

  onMounted(() => {
    fetchCampaign();
    fetchAchievements();
  });

  return {
    campaignId,
    campaign,
    isLoading,
    error,
    fetchCampaign,
    achievements,
    achievementsPagination,
    isAchievementsLoading,
    achievementsError,
    fetchAchievements,
  };
}
