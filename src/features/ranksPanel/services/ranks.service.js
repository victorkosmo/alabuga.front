// src/features/ranksPanel/services/ranks.service.js
import { get } from '@/utils/fetch';

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
