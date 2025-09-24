import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import * as campaignService from '../services/campaign.service';

export function useCampaignActions(campaignId, refetchCampaign) {
  const router = useRouter();

  const dialogs = reactive({
    edit: false,
    delete: false,
    createMission: false,
  });

  const openEditDialog = () => (dialogs.edit = true);
  const openDeleteDialog = () => (dialogs.delete = true);
  const openCreateMissionDialog = () => (dialogs.createMission = true);

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

  const handleSelectMissionType = (missionType) => {
    router.push({
      name: 'Новая миссия',
      params: { id: campaignId },
      query: { type: missionType },
    });
  };

  return {
    dialogs,
    openEditDialog,
    openDeleteDialog,
    openCreateMissionDialog,
    handleUpdateCampaign,
    handleDeleteCampaign,
    handleSelectMissionType,
  };
}
