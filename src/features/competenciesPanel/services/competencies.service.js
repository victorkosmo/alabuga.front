import { get, post, put, remove } from '@/utils/fetch';
import { successMessage } from '@/utils/toast';

/**
 * Get paginated list of competencies.
 * @param {Object} params - Query parameters.
 * @param {number} [params.page=1] - Page number.
 * @param {number} [params.limit=10] - Items per page.
 * @returns {Promise<Object>} The full API response with data and meta.
 */
export const getCompetencies = (params = {}) => {
  const { page = 1, limit = 10 } = params;
  return get('/web/competencies', {
    params: { page, limit }
  });
};

/**
 * Create a new competency.
 * @param {Object} data - Competency data.
 * @param {string} data.name - The name of the competency.
 * @param {string} [data.description] - The description of the competency.
 * @returns {Promise<Object>} The created competency data.
 */
export const createCompetency = async (data) => {
  const response = await post('/web/competencies', data);
  if (response.success) {
    successMessage('Компетенция успешно создана');
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to create competency');
};

/**
 * Update an existing competency.
 * @param {string} id - The ID of the competency to update.
 * @param {Object} data - Competency data to update.
 * @returns {Promise<Object>} The updated competency data.
 */
export const updateCompetency = async (id, data) => {
  const response = await put(`/web/competencies/${id}`, data);
  if (response.success) {
    successMessage('Компетенция успешно обновлена');
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to update competency');
};

/**
 * Delete a competency.
 * @param {string} id - The ID of the competency to delete.
 * @returns {Promise<Object>} The API response.
 */
export const deleteCompetency = async (id) => {
  const response = await remove(`/web/competencies/${id}`);
  if (response.success) {
    successMessage('Компетенция успешно удалена');
    return response;
  }
  throw new Error(response.error?.message || 'Failed to delete competency');
};
