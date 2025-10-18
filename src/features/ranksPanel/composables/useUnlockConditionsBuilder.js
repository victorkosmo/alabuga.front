import { ref, onMounted, computed, watch } from 'vue';
import * as uiService from '../services/ui.service';

export function useUnlockConditionsBuilder(initialConditions) {
  // Data for selectors
  const availableCampaigns = ref([]);
  const availableAchievements = ref([]);
  const isLoading = ref(true);

  // Selected condition values
  const selectedCampaignIds = ref([]);
  const selectedAchievementIds = ref([]);

  // Fetch data for selectors
  const fetchData = async () => {
    isLoading.value = true;
    try {
      const [campaignsRes, achievementsRes] = await Promise.all([
        uiService.getMinimalCampaigns(),
        uiService.getMinimalGlobalAchievements(),
      ]);

      if (campaignsRes.success) {
        availableCampaigns.value = campaignsRes.data;
      }
      if (achievementsRes.success) {
        availableAchievements.value = achievementsRes.data;
      }
    } catch (error) {
      console.error('Failed to load data for unlock conditions builder:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // Parse initial conditions when the prop changes
  const parseConditions = (conditions) => {
    selectedCampaignIds.value = conditions?.required_campaigns?.ids || [];
    selectedAchievementIds.value = conditions?.required_achievements?.ids || [];
  };

  watch(initialConditions, (newConditions) => {
    parseConditions(newConditions || {});
  }, { immediate: true, deep: true });

  // Computed property to build the final unlock_conditions object
  const unlockConditions = computed(() => {
    const conditions = {};
    if (selectedCampaignIds.value.length > 0) {
      conditions.required_campaigns = {
        operator: 'OR',
        ids: selectedCampaignIds.value,
      };
    }
    if (selectedAchievementIds.value.length > 0) {
      conditions.required_achievements = {
        operator: 'AND',
        ids: selectedAchievementIds.value,
      };
    }
    return conditions;
  });

  onMounted(fetchData);

  return {
    isLoading,
    availableCampaigns,
    availableAchievements,
    selectedCampaignIds,
    selectedAchievementIds,
    unlockConditions,
  };
}
