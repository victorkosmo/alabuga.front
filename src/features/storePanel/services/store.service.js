import { get, post, put, remove } from '@/utils/fetch';
import { successMessage } from '@/utils/toast';

/**
 * Get paginated list of global store items.
 * @param {Object} params - Query parameters.
 * @param {number} [params.page=1] - Page number.
 * @param {number} [params.limit=10] - Items per page.
 * @returns {Promise<Object>} The full API response with data and meta.
 */
export const getStoreItems = (params = {}) => {
  const { page = 1, limit = 10 } = params;
  return get('/web/store', {
    params: { page, limit }
  });
};

/**
 * Create a new store item.
 * @param {Object} data - Store item data.
 * @returns {Promise<Object>} The created store item data.
 */
export const createStoreItem = async (data) => {
  const response = await post('/web/store', data);
  if (response.success) {
    successMessage('Товар успешно создан');
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to create store item');
};

/**
 * Update an existing store item.
 * @param {string} id - The ID of the store item to update.
 * @param {Object} data - Store item data to update.
 * @returns {Promise<Object>} The updated store item data.
 */
export const updateStoreItem = async (id, data) => {
  const response = await put(`/web/store/${id}`, data);
  if (response.success) {
    successMessage('Товар успешно обновлен');
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to update store item');
};

/**
 * Delete a store item.
 * @param {string} id - The ID of the store item to delete.
 * @returns {Promise<Object>} The API response.
 */
export const deleteStoreItem = async (id) => {
  const response = await remove(`/web/store/${id}`);
  if (response.success) {
    successMessage('Товар успешно удален');
    return response;
  }
  throw new Error(response.error?.message || 'Failed to delete store item');
};
