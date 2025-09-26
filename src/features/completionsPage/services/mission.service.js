import { get, patch } from '@/utils/fetch';
import { successMessage } from '@/utils/toast';

/**
 * List completions for a URL-based mission
 * @param {string} missionId - The UUID of the mission.
 * @param {object} params - Query parameters (page, limit).
 * @returns {Promise<object>} A paginated list of mission completions.
 */
export const getUrlMissionCompletions = (missionId, params = {}) => {
  return get(`/web/missions/type-url/${missionId}/completions`, { params });
};

/**
 * Update the status of a mission completion
 * @param {string} missionId - The UUID of the mission.
 * @param {string} completionId - The UUID of the mission completion.
 * @param {object} data - The update data { status, moderator_comment }.
 * @returns {Promise<object>} The updated completion data.
 */
export const updateUrlMissionCompletionStatus = async (missionId, completionId, data) => {
  const response = await patch(
    `/web/missions/type-url/${missionId}/completions/${completionId}/status`,
    data
  );
  if (response.success) {
    successMessage('Статус проверки обновлен');
    return response.data;
  }
  throw new Error(response.error?.message || 'Failed to update completion status');
};
