import { get, post } from '@/utils/fetch';
import { successMessage } from '@/utils/toast';

/**
 * Get paginated list of campaigns.
 * @param {Object} params - Query parameters.
 * @param {number} [params.page=1] - Page number.
 * @param {number} [params.limit=10] - Items per page.
 * @returns {Promise<Object>} The full API response with data and meta.
 */
export const getCampaigns = (params = {}) => {
  const { page = 1, limit = 10 } = params;
  return get('/web/campaigns', {
    params: { page, limit }
  });
};

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
 * Create a new campaign.
 * @param {Object} data - Campaign data.
 * @param {string} data.title - The title of the campaign.
 * @param {string} [data.description] - The description of the campaign.
 * @param {string} [data.start_date] - Optional start date.
 * @param {string} [data.end_date] - Optional end date.
 * @param {number} [data.max_participants] - Optional participant limit.
 * @returns {Promise<Object>} The created campaign data.
 */
export const createCampaign = async (data) => {
  const response = await post('/web/campaigns', data);
  if (response.success) {
    successMessage('Кампания успешно создана');
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to create campaign');
};
