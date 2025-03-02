import { axiosCache } from '~/utils/axios/cache';

import type { KitsuCurrentUser } from '../types/kitsu/user';
import type { KitsuUserSettings } from '../types/user-settings';
import { createKitsuHeaders } from './headers';
import { KITSU_BASE_URL } from './url';

export const getKitsuCurrentUser = async (
  userConfig: KitsuUserSettings,
): Promise<KitsuCurrentUser> => {
  if (!userConfig.auth) {
    throw new Error('No user config! This should not happen!');
  }

  const url = `${KITSU_BASE_URL}/users?filter[self]=true&fields[users]=id`;

  try {
    const response = await axiosCache(url, {
      id: `kitsu-currentUser-${userConfig.auth.access_token}`,
      method: 'GET',
      headers: createKitsuHeaders(userConfig.auth),
      cache: {
        ttl: 1000 * 60 * 20,
        interpretHeader: false,
        staleIfError: 1000 * 60 * 5,
      },
    });

    if (response.status !== 200) {
      if (response.statusText)
        throw new Error(
          `Kitsu Api returned with a ${response.status} status. ${response.statusText}`,
        );
      throw new Error(
        `Kitsu Api returned with a ${response.status} status. The api might be down!`,
      );
    }

    if (!response.data || !response.data.data || !response.data.data.length) {
      throw new Error('No user data found!');
    }

    return (await response.data.data[0]) as KitsuCurrentUser;
  } catch (error) {
    // console.error(error.response.data.errors);
    if ((error as Error).name === 'AbortError') {
      throw new Error(`Request timed out after ${5000}ms`);
    }
    throw new Error((error as Error).message);
  }
};
