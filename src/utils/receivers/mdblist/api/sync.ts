import { axiosInstance } from '~/utils/axios/cache';
import type { IDs } from '~/utils/receiver/types/id';

import type { MDBListUserSettings } from '../types/user-settings';

export async function syncMDBListMetaObject(
  ids: {
    ids: Partial<IDs>;
    count:
      | {
          season: number;
          episode: number;
        }
      | undefined;
  },
  userConfig: MDBListUserSettings,
): Promise<void> {
  if (!userConfig.auth) {
    throw new Error('No user config! This should not happen!');
  }

  const apikey = userConfig.auth.apikey;
  let data: Record<string, any> = {};

  if (ids.count) {
    // For TV shows/episodes
    data = {
      shows: [
        {
          ids: ids.ids,
          seasons: [
            {
              number: ids.count.season,
              episodes: [
                {
                  number: ids.count.episode,
                  watched_at: new Date().toISOString(),
                },
              ],
            },
          ],
        },
      ],
    };
  } else {
    // For movies
    data = {
      movies: [
        {
          ids: ids.ids,
          watched_at: new Date().toISOString(),
        },
      ],
    };
  }

  try {
    const response = await axiosInstance(
      `https://api.mdblist.com/sync/watched`,
      {
        method: 'POST',
        params: {
          apikey,
        },
        data,
      },
    );
    return await response.data;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to sync data to MDBList API!');
  }
}
