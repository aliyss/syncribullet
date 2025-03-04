import { axiosCache } from '~/utils/axios/cache';
import { exists } from '~/utils/helpers/array';

import type { KitsuCatalogType } from '../types/catalog/catalog-type';
import type {
  KitsuAnimeEntry,
  KitsuAnimeEntryResponse,
} from '../types/kitsu/anime-entry';
import type {
  KitsuLibraryEntryIncludedEpisodes,
  KitsuLibraryEntryIncludedGenres,
} from '../types/kitsu/library-entry';
import type { KitsuUserSettings } from '../types/user-settings';
import { createKitsuHeaders } from './headers';
import { KITSU_BASE_URL } from './url';

export const getKitsuMetaObject = async (
  id: number,
  type: KitsuCatalogType,
  userConfig: KitsuUserSettings,
): Promise<KitsuAnimeEntry> => {
  const include = [`include=genres,episodes`];
  const fields = [
    `fields[${type}]=titles,slug,description,averageRating,posterImage,status,startDate,endDate,episodeCount,showType,nsfw,coverImage,genres,episodes`,
    `fields[genres]=name`,
  ];

  const url = `${KITSU_BASE_URL}/${type}/${id}?${[...include, ...fields].join(
    '&',
  )}`;

  try {
    const response = await axiosCache(url, {
      id: `kitsu-${type}-${id}`,
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

    if (!response.data || !response.data.data) {
      throw new Error('No catalog data found!');
    }
    const data = response.data as KitsuAnimeEntryResponse;
    const info = {
      ...data.data,
      episodes: data.included.filter(
        (entry) => entry.type === 'episodes',
      ) as KitsuLibraryEntryIncludedEpisodes[],
      genres: (
        data.included.filter(
          (entry) => entry.type === 'genres',
        ) as KitsuLibraryEntryIncludedGenres[]
      )
        .map((entry) => entry.attributes.name)
        .filter(exists),
    } satisfies KitsuAnimeEntry;

    return info;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error(`Request timed out after ${5000}ms`);
    }
    throw new Error((error as Error).message);
  }
};
