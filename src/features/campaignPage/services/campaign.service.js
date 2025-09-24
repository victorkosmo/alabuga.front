import { get, put, remove } from '@/utils/fetch';
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
