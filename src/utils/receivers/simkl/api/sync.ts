import { axiosInstance } from '~/utils/axios/cache';
import type { IDs } from '~/utils/receiver/types/id';

import type { SimklUserSettings } from '../types/user-settings';
import { createSimklHeaders } from './headers';

export async function syncSimklMetaObject(
  ids: {
    ids: Partial<IDs>;
    count:
      | {
          season: number;
          episode: number;
        }
      | undefined;
  },
  userConfig: SimklUserSettings,
): Promise<void> {
  if (!userConfig.auth) {
    throw new Error('No user config! This should not happen!');
  }
  let data: Record<string, any> = {
    title: undefined,
    ids: ids.ids,
  };

  if (ids.count) {
    data['seasons'] = [
      {
        number: ids.count.season,
        episodes: [
          {
            number: ids.count.episode,
          },
        ],
      },
    ];
    data = {
      shows: [data],
    };
  } else {
    data = {
      movies: [data],
    };
  }

  try {
    const response = await axiosInstance(`https://api.simkl.com/sync/history`, {
      method: 'POST',
      headers: createSimklHeaders(userConfig.auth),
      data,
    });
    return await response.data;
  } catch (e) {
    console.log(e);
    throw new Error('Failed to fetch data from Simkl API!');
  }
}
