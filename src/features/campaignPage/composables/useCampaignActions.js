import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import * as campaignService from '../services/campaign.service';

export function useCampaignActions(campaignId, refetchCampaign) {
  const router = useRouter();

  const dialogs = reactive({
    edit: false,
    delete: false,
  });

  const openEditDialog = () => (dialogs.edit = true);
  const openDeleteDialog = () => (dialogs.delete = true);

  const handleUpdateCampaign = async (formData) => {
    try {
      await campaignService.updateCampaign(campaignId, formData);
      dialogs.edit = false;
      await refetchCampaign();
    } catch (error) {
      console.error('Failed to update campaign:', error);
    }
  };

  const handleDeleteCampaign = async () => {
    try {
      await campaignService.deleteCampaign(campaignId);
      dialogs.delete = false;
      router.push('/campaigns');
    } catch (error) {
      console.error('Failed to delete campaign:', error);
    }
  };

  return {
    dialogs,
    openEditDialog,
    openDeleteDialog,
    handleUpdateCampaign,
    handleDeleteCampaign,
  };
}
