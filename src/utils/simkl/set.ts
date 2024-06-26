import type { RequireAtLeastOne } from '../typing/helpers';
import { createSimklHeaders } from './helper';
import type { SimklIds } from './types';

export interface SetSimklItem {
  name: string;
  ids: RequireAtLeastOne<SimklIds>;
}

export async function setSimklShowItem(
  simklResult: SetSimklItem,
  season: number,
  episode: number,
  userConfig: Record<string, string> | undefined,
) {
  if (!userConfig || !userConfig.accesstoken || !userConfig.clientid) {
    return;
  }

  const items = {
    shows: [
      {
        title: undefined,
        ids: simklResult.ids,
        seasons: [
          {
            number: season || 1,
            episodes: [
              {
                number: episode,
              },
            ],
          },
        ],
      },
    ] as SimklShowAddToList[],
  };

  try {
    const data = await fetch('https://api.simkl.com/sync/history', {
      method: 'POST',
      headers: createSimklHeaders(userConfig.accesstoken, userConfig.clientid),
      body: JSON.stringify(items),
    });
    return await data.json();
  } catch (e) {
    console.log(e);
  }
}

export async function setSimklMovieItem(
  simklResult: SetSimklItem,
  userConfig: Record<string, string> | undefined,
) {
  if (!userConfig || !userConfig.accesstoken || !userConfig.clientid) {
    return;
  }

  const items = {
    movies: [
      {
        title: simklResult.name,
        ids: simklResult.ids,
      },
    ],
  };

  try {
    const data = await fetch('https://api.simkl.com/sync/history', {
      method: 'POST',
      headers: createSimklHeaders(userConfig.accesstoken, userConfig.clientid),
      body: JSON.stringify(items),
    });
    return await data.json();
  } catch (e) {
    console.log(e);
  }
}

export interface SimklShowEpisodeAddToList {
  number?: number;
  watched_at?: string;
}

export interface SimklShowSeasonAddToList {
  number?: number;
  watched_at?: string;
  episodes?: SimklShowEpisodeAddToList[];
}

export interface SimklShowAddToList {
  title?: string;
  ids: RequireAtLeastOne<SimklIds>;
  to?: string;
  watched_at?: string;
  seasons?: SimklShowSeasonAddToList[];
}
