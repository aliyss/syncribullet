import type { CinemetaMeta } from '../cinemeta/meta';
import type { IDs } from '../ids/types';
import type { RequireAtLeastOne } from '../typing/helpers';
import { createSimklHeaders } from './helper';
import type { SetSimklItem } from './set';
import type {
  SimklIds,
  SimklLibrary,
  SimklLibraryObjectShow,
  SimklLibraryObjectStatus,
  SimklLibraryType,
} from './types';

export async function getSimklItem(
  cinemetaInfo: CinemetaMeta | null,
  ids: IDs,
  userConfig: Record<string, string> | undefined,
): Promise<SetSimklItem | undefined> {
  if (!userConfig || !userConfig.accesstoken) {
    return;
  }
  const imdbId = ids.imdb ? ids.imdb : cinemetaInfo?.meta?.id || undefined;
  let idsResult = ids;
  if (!ids.anilist && !ids.kitsu) {
    idsResult = {
      ...ids,
      imdb: imdbId,
    };
  } else {
    delete idsResult.imdb;
    delete idsResult.tvdb;
    delete idsResult.tmdb;
    idsResult = {
      ...ids,
    };
  }
  return {
    ids: {
      ...idsResult,
    } as RequireAtLeastOne<SimklIds>,
    name: cinemetaInfo?.meta?.name || '',
  };
}

export async function getSimklList(
  type: SimklLibraryType,
  status: SimklLibraryObjectStatus,
  userConfig: Record<string, string> | undefined,
): Promise<SimklLibrary> {
  if (!userConfig || !userConfig.accesstoken) {
    return {};
  }
  try {
    const data = await fetch(
      `https://api.simkl.com/sync/all-items/${type}/${status}`,
      {
        method: 'GET',
        headers: createSimklHeaders(
          userConfig.accesstoken,
          userConfig.clientid,
        ),
      },
    );
    return await data.json();
  } catch (e) {
    console.log(e);
  }
  return {};
}

export async function getSimklById(
  source: 'anilist',
  id: string,
  userConfig: Record<string, string> | undefined,
): Promise<SimklLibraryObjectShow[]> {
  if (!userConfig || !userConfig.accesstoken) {
    return [];
  }
  try {
    const data = await fetch(
      `https://api.simkl.com/search/id?${source}=${id}`,
      {
        method: 'GET',
        headers: createSimklHeaders(
          userConfig.accesstoken,
          userConfig.clientid,
        ),
      },
    );
    return await data.json();
  } catch (e) {
    console.log(e);
  }
  return [];
}

export async function getSimklAnimeById(
  id: string,
  userConfig: Record<string, string> | undefined,
): Promise<SimklLibraryObjectShow | undefined> {
  if (!userConfig || !userConfig.accesstoken) {
    return undefined;
  }
  try {
    const data = await fetch(
      `https://api.simkl.com/anime/${id}?extended=full`,
      {
        method: 'GET',
        headers: createSimklHeaders(
          userConfig.accesstoken,
          userConfig.clientid,
        ),
      },
    );
    return await data.json();
  } catch (e) {
    console.log(e);
  }
  return undefined;
}
