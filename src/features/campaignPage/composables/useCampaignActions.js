import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import * as campaignService from '../services/campaign.service';
import * as achievementsService from '../services/achievements.service';

export function useCampaignActions(campaignId, refetchCampaign, refetchAchievements) {
  const router = useRouter();

  const dialogs = reactive({
    edit: false,
    delete: false,
    createMission: false,
    createAchievement: false,
  });

  const openEditDialog = () => (dialogs.edit = true);
  const openDeleteDialog = () => (dialogs.delete = true);
  const openCreateMissionDialog = () => (dialogs.createMission = true);
  const openCreateAchievementDialog = () => (dialogs.createAchievement = true);

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

  const handleSaveAchievement = async (formData) => {
    try {
      await achievementsService.createAchievement({ ...formData, campaign_id: campaignId });
      dialogs.createAchievement = false;
      await refetchAchievements(1); // Fetch first page to see the new achievement
    } catch (error) {
      console.error('Failed to save achievement:', error);
    }
  };

  return {
    dialogs,
    openEditDialog,
    openDeleteDialog,
    openCreateMissionDialog,
    openCreateAchievementDialog,
    handleUpdateCampaign,
    handleDeleteCampaign,
    handleSelectMissionType,
    handleSaveAchievement,
  };
}
