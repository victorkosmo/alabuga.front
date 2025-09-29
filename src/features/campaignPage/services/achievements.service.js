import { get, post, put, remove } from '@/utils/fetch';
import { successMessage } from '@/utils/toast';

export const getAchievements = (params = {}) => {
  return get('/web/achievements', { params });
};

export const createAchievement = async (data) => {
  const response = await post('/web/achievements', data);
  if (response.success) {
    successMessage('Ачивка успешно создана');
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to create achievement');
};

export const updateAchievement = async (id, data) => {
  const response = await put(`/web/achievements/${id}`, data);
  if (response.success) {
    successMessage('Ачивка успешно обновлена');
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to update achievement');
};

export const deleteAchievement = async (id) => {
  const response = await remove(`/web/achievements/${id}`);
  if (response.success) {
    successMessage('Ачивка успешно удалена');
    return response;
  }
  throw new Error(response.error?.message || 'Failed to delete achievement');
};

export const uploadAchievementImage = async (id, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await post(`/web/achievements/${id}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (response.success) {
    successMessage('Изображение ачивки успешно загружено');
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to upload achievement image');
};

export const getMinimalAchievements = (campaignId) => {
  return get('/web/ui/achievements/list-minimal', { params: { campaign_id: campaignId } });
};

export const getMinimalMissions = (campaignId) => {
  return get('/web/ui/missions/list-minimal', { params: { campaign_id: campaignId } });
};

export const attachAchievementToMission = async (achievementId, missionId) => {
  const response = await post(`/web/achievements/${achievementId}/mission/attach`, {
    mission_id: missionId
  });
  if (response.success) {
    successMessage('Ачивка успешно привязана к миссии');
    return response;
  }
  throw new Error(response.error?.message || 'Failed to attach achievement');
};

export const detachAchievementFromMission = async (achievementId, missionId) => {
  const response = await post(`/web/achievements/${achievementId}/mission/detach`, {
    mission_id: missionId
  });
  if (response.success) {
    successMessage('Ачивка успешно отвязана от миссии');
    return response;
  }
  throw new Error(response.error?.message || 'Failed to detach achievement');
};
