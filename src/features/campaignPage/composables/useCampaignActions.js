import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import * as campaignService from '../services/campaign.service';
import * as achievementsService from '../services/achievements.service';

export function useCampaignActions(campaignId, refetchCampaign, refetchAchievements, achievements, achievementsPagination) {
  const router = useRouter();
  const selectedAchievement = ref(null);

  const dialogs = reactive({
    edit: false,
    delete: false,
    createMission: false,
    createEditAchievement: false,
    deleteAchievement: false,
  });

  const openEditDialog = () => (dialogs.edit = true);
  const openDeleteDialog = () => (dialogs.delete = true);
  const openCreateMissionDialog = () => (dialogs.createMission = true);
  
  const openCreateAchievementDialog = () => {
    selectedAchievement.value = null;
    dialogs.createEditAchievement = true;
  };

  const openEditAchievementDialog = (achievement) => {
    selectedAchievement.value = achievement;
    dialogs.createEditAchievement = true;
  };

  const openDeleteAchievementDialog = () => {
    dialogs.createEditAchievement = false;
    dialogs.deleteAchievement = true;
  };

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
      if (selectedAchievement.value) {
        await achievementsService.updateAchievement(selectedAchievement.value.id, formData);
      } else {
        await achievementsService.createAchievement({ ...formData, campaign_id: campaignId });
      }
      dialogs.createEditAchievement = false;
      const pageToFetch = selectedAchievement.value ? (achievementsPagination.value?.page || 1) : 1;
      await refetchAchievements(pageToFetch);
    } catch (error) {
      console.error('Failed to save achievement:', error);
    }
  };

  const handleDeleteAchievement = async () => {
    if (!selectedAchievement.value) return;
    try {
      await achievementsService.deleteAchievement(selectedAchievement.value.id);
      dialogs.deleteAchievement = false;
      
      const currentPage = achievementsPagination.value?.page || 1;
      const isLastItemOnPage = achievements.value.length === 1 && currentPage > 1;
      await refetchAchievements(isLastItemOnPage ? currentPage - 1 : currentPage);
    } catch (error) {
      console.error('Failed to delete achievement:', error);
    }
  };

  return {
    dialogs,
    selectedAchievement,
    openEditDialog,
    openDeleteDialog,
    openCreateMissionDialog,
    openCreateAchievementDialog,
    openEditAchievementDialog,
    openDeleteAchievementDialog,
    handleUpdateCampaign,
    handleDeleteCampaign,
    handleSelectMissionType,
    handleSaveAchievement,
    handleDeleteAchievement,
  };
}
