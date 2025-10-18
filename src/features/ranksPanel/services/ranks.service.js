// src/features/ranksPanel/services/ranks.service.js
import { get, post, put } from '@/utils/fetch';
import { successMessage } from '@/utils/toast';

/**
 * Get paginated list of ranks.
 * @param {Object} params - Query parameters.
 * @param {number} [params.page=1] - Page number.
 * @param {number} [params.limit=10] - Items per page.
 * @param {string} [params.campaign_id] - Optional campaign ID to filter ranks.
 * @returns {Promise<Object>} The full API response with data and meta.
 */
export const getRanks = (params = {}) => {
  return get('/web/ranks', { params });
};

/**
 * Create a new rank.
 * @param {FormData} data - The rank data.
 * @returns {Promise<Object>} The created rank data.
 */
export const createRank = async (data) => {
  const response = await post('/web/ranks', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  if (response.success) {
    successMessage('Ранг успешно создан');
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to create rank');
};

/**
 * Update an existing rank.
 * @param {string} id - The ID of the rank to update.
 * @param {FormData} data - The updated rank data.
 * @returns {Promise<Object>} The updated rank data.
 */
export const updateRank = async (id, data) => {
  const response = await put(`/web/ranks/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  if (response.success) {
    successMessage('Ранг успешно обновлен');
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to update rank');
};
