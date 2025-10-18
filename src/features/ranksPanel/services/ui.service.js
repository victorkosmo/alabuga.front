import { get } from '@/utils/fetch';

/**
 * Retrieve a minimal list of all campaigns (ID and title).
 * @returns {Promise<Object>}
 */
export const getMinimalCampaigns = () => {
  return get('/web/ui/campaigns/list-minimal');
};

/**
 * Retrieve a minimal list of all achievements globally.
 * @returns {Promise<Object>}
 */
export const getMinimalGlobalAchievements = () => {
  return get('/web/ui/achievements/list-global');
};
