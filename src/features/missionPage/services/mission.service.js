import { get, put, remove } from '@/utils/fetch';
import { successMessage } from '@/utils/toast';

/**
 * Get a single mission by ID.
 * @param {string} campaignId - The ID of the campaign the mission belongs to.
 * @param {string} missionId - The ID of the mission.
 * @returns {Promise<Object>} The mission data.
 */
export const getMission = async (campaignId, missionId) => {
  const response = await get(`/web/campaigns/${campaignId}/missions/${missionId}`);
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to fetch mission');
};

/**
 * Get a list of supported mission types.
 * @returns {Promise<Array>} A list of mission type objects.
 */
export const getMissionTypes = async () => {
  const response = await get('/web/missions/types');
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to fetch mission types');
};

/**
 * Get a URL-based mission by ID.
 * @param {string} missionId - The ID of the mission.
 * @returns {Promise<Object>} The mission data.
 */
export const getUrlMission = async (missionId) => {
  const response = await get(`/web/missions/type-url/${missionId}`);
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to fetch URL mission');
};
