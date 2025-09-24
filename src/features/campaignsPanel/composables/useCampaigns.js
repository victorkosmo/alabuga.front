import { ref, reactive, onMounted } from 'vue';
import * as campaignsService from '../services/campaigns.service';

export function useCampaigns() {
  const campaigns = ref([]);
  const pagination = ref(null);
  const isLoading = ref(true);

  const dialogs = reactive({
    create: false,
  });

  const fetchCampaigns = async (page = 1) => {
    isLoading.value = true;
    try {
      const response = await campaignsService.getCampaigns({ page, limit: 10 });
      if (response.success) {
        campaigns.value = response.data;
        pagination.value = response.meta.pagination;
      } else {
        campaigns.value = [];
        pagination.value = null;
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
      campaigns.value = [];
      pagination.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  const openCreateDialog = () => {
    dialogs.create = true;
  };

  const handleSaveCampaign = async (formData) => {
    try {
      await campaignsService.createCampaign(formData);
      dialogs.create = false;
      await fetchCampaigns(1); // Fetch first page to see the new campaign
    } catch (error) {
      console.error('Failed to save campaign:', error);
    }
  };

  onMounted(() => fetchCampaigns());

  return {
    campaigns,
    pagination,
    isLoading,
    dialogs,
    fetchCampaigns,
    openCreateDialog,
    handleSaveCampaign,
  };
}
