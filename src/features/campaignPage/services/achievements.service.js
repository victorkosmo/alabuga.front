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
