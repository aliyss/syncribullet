import { axiosCache, axiosInstance } from '~/utils/axios/cache';
import { exists } from '~/utils/helpers/array';

import type { KitsuCatalogType } from '../types/catalog/catalog-type';
import type {
  KitsuAnimeEntry,
  KitsuAnimeEntryResponse,
} from '../types/kitsu/anime-entry';
import type {
  KitsuLibraryEntryIncludedEpisodes,
  KitsuLibraryEntryIncludedGenres,
  KitsuLibraryEntryResponse,
} from '../types/kitsu/library-entry';
import type { KitsuCurrentUser } from '../types/kitsu/user';
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

export const getKitsuMinimalMetaObject = async (
  id: number,
  type: KitsuCatalogType,
  userConfig: KitsuUserSettings,
  currentUser: KitsuCurrentUser,
): Promise<KitsuLibraryEntryResponse> => {
  const include = [`include=${type}`];
  const filters = [
    `filter[kind]=${type}`,
    `filter[user_id]=${currentUser.id}`,
    `filter[anime_id]=${id}`,
  ];
  const fields = [
    `fields[libraryEntries]=status,anime,progress,notes,rating,startedAt,finishedAt,updatedAt,createdAt`,
    `fields[${type}]=titles,description,averageRating,posterImage,status,startDate,endDate,episodeCount,showType,nsfw,genres`,
  ];
  const pagination = [`page[limit]=1`, `page[offset]=0`];

  const url = `${KITSU_BASE_URL}/library-entries?${[
    ...include,
    ...filters,
    ...fields,
    ...pagination,
  ].join('&')}`;

  try {
    let response = await axiosInstance(url, {
      method: 'GET',
      headers: createKitsuHeaders(userConfig.auth),
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
    if (!response.data.data.length) {
      response = await axiosCache(`${KITSU_BASE_URL}/anime?${fields[0]}`, {
        id: `kitsu-${type}-${id}`,
        method: 'GET',
        headers: createKitsuHeaders(userConfig.auth),
        cache: {
          ttl: 1000 * 60 * 20,
          interpretHeader: false,
          staleIfError: 1000 * 60 * 5,
        },
      });
      response.data.included = [response.data.data];
    }

    return response.data as KitsuLibraryEntryResponse;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error(`Request timed out after ${5000}ms`);
    }
    throw new Error((error as Error).message);
  }
};
