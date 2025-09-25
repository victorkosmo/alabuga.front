import { get } from '@/utils/fetch';

/**
 * Retrieves a non-paginated list of all ranks with only their ID and title.
 * @returns {Promise<Array<{id: string, title: string}>>} A minimal list of ranks.
 */
export const getMinimalRanks = async () => {
  const response = await get('/web/ranks/minimal');
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to fetch ranks');
};
