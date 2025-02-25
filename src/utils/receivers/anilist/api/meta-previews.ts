import { axiosCache } from '~/utils/axios/cache';

import type { AnimeListResponse } from '../types/anilist/library';
import type { AnilistCurrentUser } from '../types/anilist/user';
import type { AnilistCatalogStatus } from '../types/catalog/catalog-status';
import type { AnilistCatalogType } from '../types/catalog/catalog-type';
import type { AnilistUserSettings } from '../types/user-settings';
import { generateQueryHeaders } from './headers';
import { ANILIST_BASE_URL } from './url';

const animeQuery = async <U extends AnilistCurrentUser = AnilistCurrentUser>(
  currentUser: U,
  status: AnilistCatalogStatus,
  chunk: number,
  perChunk: number,
) => {
  const queryVals = generateQueryHeaders(
    'MediaListCollection',
    currentUser.id,
    'ANIME',
    status,
    chunk,
    perChunk,
  );

  const query =
    queryVals[1] +
    `lists {
          name
          isCustomList
          isSplitCompletedList
          status
          entries {
            id
            media {
              averageScore
              meanScore
              id
              idMal
              title {
                romaji
                english
                native
                userPreferred
              }
              status
              type 
              seasonYear
              coverImage {
                extraLarge
                large
                medium
                color
              }
              bannerImage
              episodes
              nextAiringEpisode {
                id
                episode
                airingAt
                timeUntilAiring
                mediaId
              }
              description
              format
              startDate {
                year
                month
                day
              }
              endDate {
                year
                month
                day
              }
              duration
              genres
              synonyms
              tags {
                name
                isMediaSpoiler
              }
              isFavourite
              isAdult
              siteUrl
            }
            status
            score
            progress
            repeat
            priority
            private
            notes
            hiddenFromStatusLists
            advancedScores
            startedAt {
              year
              month
              day
            }
            completedAt {
              year
              month
              day
            }
            updatedAt
            createdAt
          }
      }
    }
  }`;

  return {
    query,
    variables: queryVals[0],
  };
};

export const getAnilistMetaPreviews = async <
  T extends AnimeListResponse = AnimeListResponse,
  U extends AnilistCurrentUser = AnilistCurrentUser,
>(
  type: AnilistCatalogType,
  status: AnilistCatalogStatus,
  userConfig: AnilistUserSettings,
  currentUser: U,
  chunk: number,
  perChunk: number,
): Promise<T> => {
  const { query, variables } = await animeQuery<U>(
    currentUser,
    status,
    chunk + 1,
    perChunk,
  );

  if (!query) {
    throw new Error('No query provided');
  }

  if (query.startsWith('mutation') && !userConfig.auth) {
    throw new Error('No user config! This should not happen!');
  }

  try {
    const response = await axiosCache(ANILIST_BASE_URL, {
      id: `anilist-${type}-${status}-${currentUser.id}-${
        chunk + 1
      }-${perChunk}`,
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
