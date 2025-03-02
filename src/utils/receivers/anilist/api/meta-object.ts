import { axiosCache } from '~/utils/axios/cache';

import type { AnimeMinimalMediaResponse } from '../types/anilist/library';
import type { AnilistCatalogType } from '../types/catalog/catalog-type';
import type { AnilistUserSettings } from '../types/user-settings';
import { ANILIST_BASE_URL } from './url';

const minimalAnimeQuery = (id: number, type: AnilistCatalogType) => {
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
  type: AnilistCatalogType,
  userConfig: AnilistUserSettings,
): Promise<T> => {
  const { query, variables } = minimalAnimeQuery(id, type);

  if (!query) {
    throw new Error('No query provided');
  }

  if (query.startsWith('mutation') && !userConfig.auth) {
    throw new Error('No user config! This should not happen!');
  }

  try {
    const response = await axiosCache(ANILIST_BASE_URL, {
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
