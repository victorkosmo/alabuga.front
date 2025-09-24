import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import * as campaignService from '../services/campaign.service.js';

export function useCampaignData() {
  const route = useRoute();
  const campaignId = route.params.id;

  const campaign = ref(null);
  const isLoading = ref(true);
  const error = ref(null);

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

  onMounted(fetchCampaign);

  return {
    campaignId,
    campaign,
    isLoading,
    error,
    fetchCampaign,
  };
}
