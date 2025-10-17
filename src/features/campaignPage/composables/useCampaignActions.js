import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import * as campaignService from '../services/campaign.service';
import * as achievementsService from '../services/achievements.service';
import * as storeService from '../services/store.service';

export function useCampaignActions(
  campaignId,
  refetchCampaign,
  refetchAchievements,
  achievements,
  achievementsPagination,
  refetchStoreItems,
  storeItems,
  storeItemsPagination
) {
  const router = useRouter();
  const selectedAchievement = ref(null);
  const selectedStoreItem = ref(null);
  const isUploadingCover = ref(false);
  const isUploadingIcon = ref(false);
  const isUploadingStoreItemImage = ref(false);
  const isUploadingAchievementImage = ref(false);

  const dialogs = reactive({
    edit: false,
    delete: false,
    createMission: false,
    createEditAchievement: false,
    deleteAchievement: false,
    createEditStoreItem: false,
    deleteStoreItem: false,
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

  const openCreateStoreItemDialog = () => {
    selectedStoreItem.value = null;
    dialogs.createEditStoreItem = true;
  };

  const openEditStoreItemDialog = (item) => {
    selectedStoreItem.value = item;
    dialogs.createEditStoreItem = true;
  };

  const openDeleteStoreItemDialog = () => {
    dialogs.createEditStoreItem = false;
    dialogs.deleteStoreItem = true;
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

  const handleUploadCover = async (file) => {
    const formData = new FormData();
    formData.append('cover', file);

    isUploadingCover.value = true;
    try {
      await campaignService.uploadCampaignCover(campaignId, formData);
      await refetchCampaign();
    } catch (error) {
      console.error('Failed to upload cover:', error);
    } finally {
      isUploadingCover.value = false;
    }
  };

  const handleUploadIcon = async (file) => {
    const formData = new FormData();
    formData.append('icon', file);

    isUploadingIcon.value = true;
    try {
      await campaignService.uploadCampaignIcon(campaignId, formData);
      await refetchCampaign();
    } catch (error) {
      console.error('Failed to upload icon:', error);
    } finally {
      isUploadingIcon.value = false;
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

  const handleUploadAchievementImage = async (file) => {
    if (!selectedAchievement.value) return;
    isUploadingAchievementImage.value = true;
    try {
      const updatedAchievement = await achievementsService.uploadAchievementImage(selectedAchievement.value.id, file);
      const index = achievements.value.findIndex(item => item.id === updatedAchievement.id);
      if (index !== -1) {
        achievements.value[index] = updatedAchievement;
      }
      selectedAchievement.value = updatedAchievement;
    } catch (error) {
      console.error('Failed to upload achievement image:', error);
    } finally {
      isUploadingAchievementImage.value = false;
    }
  };

  const handleSaveStoreItem = async (formData) => {
    try {
      if (selectedStoreItem.value) {
        await storeService.updateCampaignStoreItem(campaignId, selectedStoreItem.value.id, formData);
      } else {
        await storeService.createCampaignStoreItem(campaignId, formData);
      }
      dialogs.createEditStoreItem = false;
      const pageToFetch = selectedStoreItem.value ? (storeItemsPagination.value?.page || 1) : 1;
      await refetchStoreItems(pageToFetch);
    } catch (error) {
      console.error('Failed to save store item:', error);
    }
  };

  const handleDeleteStoreItem = async () => {
    if (!selectedStoreItem.value) return;
    try {
      await storeService.deleteCampaignStoreItem(campaignId, selectedStoreItem.value.id);
      dialogs.deleteStoreItem = false;
      
      const currentPage = storeItemsPagination.value?.page || 1;
      const isLastItemOnPage = storeItems.value.length === 1 && currentPage > 1;
      await refetchStoreItems(isLastItemOnPage ? currentPage - 1 : currentPage);
    } catch (error) {
      console.error('Failed to delete store item:', error);
    }
  };

  const handleUploadStoreItemImage = async (file) => {
    if (!selectedStoreItem.value) return;
    isUploadingStoreItemImage.value = true;
    try {
      const updatedItem = await storeService.uploadCampaignStoreItemImage(campaignId, selectedStoreItem.value.id, file);
      const index = storeItems.value.findIndex(item => item.id === updatedItem.id);
      if (index !== -1) {
        storeItems.value[index] = updatedItem;
      }
      selectedStoreItem.value = updatedItem;
    } catch (error) {
      console.error('Failed to upload store item image:', error);
    } finally {
      isUploadingStoreItemImage.value = false;
    }
  };

  return {
    dialogs,
    selectedAchievement,
    isUploadingCover,
    isUploadingIcon,
    openEditDialog,
    openDeleteDialog,
    openCreateMissionDialog,
    openCreateAchievementDialog,
    openEditAchievementDialog,
    openDeleteAchievementDialog,
    handleUpdateCampaign,
    handleDeleteCampaign,
    handleUploadCover,
    handleUploadIcon,
    handleSelectMissionType,
    handleSaveAchievement,
    handleDeleteAchievement,
    isUploadingAchievementImage,
    handleUploadAchievementImage,
    selectedStoreItem,
    openCreateStoreItemDialog,
    openEditStoreItemDialog,
    openDeleteStoreItemDialog,
    handleSaveStoreItem,
    handleDeleteStoreItem,
    isUploadingStoreItemImage,
    handleUploadStoreItemImage,
  };
}
