import { axiosCache } from '~/utils/axios/cache';

import type { KitsuCatalogType } from '../types/catalog/catalog-type';
import type { AnimeMinimalMediaResponse } from '../types/kitsu/library';
import { KitsuLibraryEntry } from '../types/kitsu/library-entry';
import type { KitsuUserSettings } from '../types/user-settings';
import { createKitsuHeaders } from './headers';
import { KITSU_BASE_URL } from './url';

const minimalAnimeQuery = (id: number, type: KitsuCatalogType) => {
  const query = `#graphql
        query media($id:Int, $type:MediaType, $isAdult:Boolean) {
            Media(id:$id, type:$type, isAdult:$isAdult) {
                id
                title{userPreferred romaji english native}
                type
                format
                status(version:2)
                episodes
                isAdult
                isReviewBlocked 
                nextAiringEpisode{airingAt timeUntilAiring episode}
                mediaListEntry{id status score}
            }
        }
    `;
  return {
    query,
    variables: {
      id,
      type: type.toUpperCase(),
    },
  };
};

export const getAnilistMinimalMetaObject = async <
  T extends AnimeMinimalMediaResponse = AnimeMinimalMediaResponse,
>(
  id: number,
  type: KitsuCatalogType,
  userConfig: KitsuUserSettings,
): Promise<T> => {
  const { query, variables } = minimalAnimeQuery(id, type);

  if (!query) {
    throw new Error('No query provided');
  }

  if (query.startsWith('mutation') && !userConfig.auth) {
    throw new Error('No user config! This should not happen!');
  }

  try {
    const response = await axiosCache(KITSU_BASE_URL, {
      id: `anilist-${type}-${id}-${userConfig.auth?.access_token}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: userConfig.auth?.access_token
          ? `Bearer ${userConfig.auth.access_token}`
          : undefined,
      },
      data: {
        query,
        variables,
      },
      cache: {
        ttl: 1000 * 60 * 20,
        interpretHeader: false,
        staleIfError: 1000 * 60 * 5,
      },
    });

    if (response.status !== 200) {
      if (response.statusText)
        throw new Error(
          `Anilist Api returned with a ${response.status} status. ${response.statusText}`,
        );
      throw new Error(
        `Anilist Api returned with a ${response.status} status. The api might be down!`,
      );
    }

    return (await response.data.data) as T;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error(`Request timed out after ${5000}ms`);
    }
    throw new Error((error as Error).message);
  }
};

export const getKitsuMetaObject = async (
  id: number,
  type: KitsuCatalogType,
  userConfig: KitsuUserSettings,
): Promise<any> => {
  const include = [`include=genres,episodes,mediaRelationships.destination`];
  const fields = [
    `fields[anime]=titles,description,averageRating,posterImage,status,startDate,endDate,episodeCount,showType,nsfw`,
  ];

  const url = `${KITSU_BASE_URL}/library-entries?${[...include, ...fields].join(
    '&',
  )}`;

  try {
    const response = await axiosCache(url, {
      id: `kitsu-${type}-${status}-${id}`,
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

    // if (!response.data || !response.data.data || !response.data.data.length) {
    //   throw new Error('No catalog data found!');
    // }
    // const data = response.data as KitsuLibraryEntryResponse;
    // const items = data.data
    //   .map((entry) => {
    //     const included = data.included.find(
    //       (o) => o.id === entry.relationships.anime.data.id,
    //     );
    //     if (!included) {
    //       return;
    //     }
    //     return {
    //       ...entry,
    //       meta: included,
    //     } satisfies KitsuLibraryEntry;
    //   })
    //   .filter(exists);
    //
    // return items;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error(`Request timed out after ${5000}ms`);
    }
    throw new Error((error as Error).message);
  }
};
