import { get, post, put, remove } from '@/utils/fetch';
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
 * Create a new URL-based mission.
 * @param {Object} data - The mission data.
 * @returns {Promise<Object>} The created mission data.
 */
export const createUrlMission = async (data) => {
  const response = await post('/web/missions/type-url', data);
  if (response.success) {
    successMessage('Миссия успешно создана');
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to create URL mission');
};

/**
 * Create a new QR-based mission.
 * @param {Object} data - The mission data.
 * @returns {Promise<Object>} The created mission data.
 */
export const createQrMission = async (data) => {
  const response = await post('/web/missions/type-qr', data);
  if (response.success) {
    successMessage('Миссия успешно создана');
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to create QR mission');
};

/**
 * Create a new quiz-based mission.
 * @param {Object} data - The mission data.
 * @returns {Promise<Object>} The created mission data.
 */
export const createQuizMission = async (data) => {
  const response = await post('/web/missions/type-quiz', data);
  if (response.success) {
    successMessage('Миссия успешно создана');
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to create Quiz mission');
};

/**
 * Update a URL-based mission.
 * @param {string} missionId - The ID of the mission to update.
 * @param {Object} data - The updated mission data.
 * @returns {Promise<Object>} The updated mission data.
 */
export const updateUrlMission = async (missionId, data) => {
  const response = await put(`/web/missions/type-url/${missionId}`, data);
  if (response.success) {
    successMessage('Миссия успешно обновлена');
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to update URL mission');
};

/**
 * Update a QR-based mission.
 * @param {string} missionId - The ID of the mission to update.
 * @param {Object} data - The updated mission data.
 * @returns {Promise<Object>} The updated mission data.
 */
export const updateQrMission = async (missionId, data) => {
  const response = await put(`/web/missions/type-qr/${missionId}`, data);
  if (response.success) {
    successMessage('Миссия успешно обновлена');
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to update QR mission');
};

/**
 * Update a quiz-based mission.
 * @param {string} missionId - The ID of the mission to update.
 * @param {Object} data - The updated mission data.
 * @returns {Promise<Object>} The updated mission data.
 */
export const updateQuizMission = async (missionId, data) => {
  const response = await put(`/web/missions/type-quiz/${missionId}`, data);
  if (response.success) {
    successMessage('Миссия успешно обновлена');
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to update Quiz mission');
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

/**
 * Get a QR-based mission by ID.
 * @param {string} missionId - The ID of the mission.
 * @returns {Promise<Object>} The mission data.
 */
export const getQrMission = async (missionId) => {
  const response = await get(`/web/missions/type-qr/${missionId}`);
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to fetch QR mission');
};

/**
 * Get a quiz-based mission by ID.
 * @param {string} missionId - The ID of the mission.
 * @returns {Promise<Object>} The mission data.
 */
export const getQuizMission = async (missionId) => {
  const response = await get(`/web/missions/type-quiz/${missionId}`);
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to fetch Quiz mission');
};
