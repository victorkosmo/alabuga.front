import { get, put, remove, post } from '@/utils/fetch';
import { successMessage } from '@/utils/toast';

/**
 * Get a single campaign by ID.
 * @param {string} id - The ID of the campaign.
 * @returns {Promise<Object>} The campaign data.
 */
export const getCampaign = async (id) => {
  const response = await get(`/web/campaigns/${id}`);
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to fetch campaign');
};

/**
 * Update a campaign by ID.
 * @param {string} id - The ID of the campaign.
 * @param {Object} data - The data to update.
 * @returns {Promise<Object>} The updated campaign data.
 */
export const updateCampaign = async (id, data) => {
  const response = await put(`/web/campaigns/${id}`, data);
  if (response.success) {
    successMessage('Кампания успешно обновлена');
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to update campaign');
};

/**
 * Delete a campaign by ID.
 * @param {string} id - The ID of the campaign.
 * @returns {Promise<Object>} The API response.
 */
export const deleteCampaign = async (id) => {
  const response = await remove(`/web/campaigns/${id}`);
  if (response.success) {
    successMessage('Кампания успешно удалена');
    return response;
  }
  throw new Error(response.error?.message || 'Failed to delete campaign');
};

/**
 * Upload a cover image for a campaign.
 * @param {string} id - The ID of the campaign.
 * @param {FormData} formData - The form data containing the cover image.
 * @returns {Promise<Object>} The updated campaign data.
 */
export const uploadCampaignCover = async (id, formData) => {
  const response = await post(`/web/campaigns/${id}/cover`, formData);
  if (response.success) {
    successMessage('Обложка кампании успешно загружена');
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to upload cover');
};

/**
 * Upload an icon image for a campaign.
 * @param {string} id - The ID of the campaign.
 * @param {FormData} formData - The form data containing the icon image.
 * @returns {Promise<Object>} The updated campaign data.
 */
export const uploadCampaignIcon = async (id, formData) => {
  const response = await post(`/web/campaigns/${id}/icon`, formData);
  if (response.success) {
    successMessage('Иконка кампании успешно загружена');
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to upload icon');
};
