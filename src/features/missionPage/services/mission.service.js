import { get } from '@/utils/fetch';

/**
 * Get a URL-based mission by ID.
 * @param {string} id - The ID of the mission.
 * @returns {Promise<Object>} The mission data.
 */
export const getUrlMission = async (id) => {
  const response = await get(`/web/missions/type-url/${id}`);
  if (response.success) {
    return response.data;
  }
  // This will throw for non-MANUAL_URL types or other errors, fulfilling the requirement.
  throw new Error(response.error?.message || 'Failed to fetch mission');
};
