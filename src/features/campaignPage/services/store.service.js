import { get, post, put, remove } from '@/utils/fetch';
import { successMessage } from '@/utils/toast';

export const getCampaignStoreItems = (campaignId, params = {}) => {
  return get(`/web/store/campaigns/${campaignId}/items`, { params });
};

export const createCampaignStoreItem = async (campaignId, data) => {
  const response = await post(`/web/store/campaigns/${campaignId}/items`, data);
  if (response.success) {
    successMessage('Товар успешно создан');
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to create store item');
};

export const updateCampaignStoreItem = async (campaignId, itemId, data) => {
  const response = await put(`/web/store/campaigns/${campaignId}/items/${itemId}`, data);
  if (response.success) {
    successMessage('Товар успешно обновлен');
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to update store item');
};

export const deleteCampaignStoreItem = async (campaignId, itemId) => {
  const response = await remove(`/web/store/campaigns/${campaignId}/items/${itemId}`);
  if (response.success) {
    successMessage('Товар успешно удален');
    return response;
  }
  throw new Error(response.error?.message || 'Failed to delete store item');
};

export const uploadCampaignStoreItemImage = async (campaignId, itemId, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await post(`/web/store/campaigns/${campaignId}/items/${itemId}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (response.success) {
    successMessage('Изображение товара успешно загружено');
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to upload store item image');
};
