import { axiosCache } from '~/utils/axios/cache';
import { exists } from '~/utils/helpers/array';

import type { KitsuCatalogStatus } from '../types/catalog/catalog-status';
import type { KitsuCatalogType } from '../types/catalog/catalog-type';
import type {
  KitsuLibraryEntry,
  KitsuLibraryEntryIncluded,
  KitsuLibraryEntryIncludedGenres,
  KitsuLibraryEntryResponse,
} from '../types/kitsu/library-entry';
import type { KitsuCurrentUser } from '../types/kitsu/user';
import type { KitsuUserSettings } from '../types/user-settings';
import { createKitsuHeaders } from './headers';
import { KITSU_BASE_URL } from './url';

export const getKitsuMetaPreviews = async (
  type: KitsuCatalogType,
  status: KitsuCatalogStatus,
  userConfig: KitsuUserSettings,
  currentUser: KitsuCurrentUser,
  chunk: number,
  perChunk: number,
  genre?: string,
): Promise<KitsuLibraryEntry[]> => {
  const include = [`include=${type},${type}.genres`];
  const filters = [
    `filter[status]=${status}`,
    `filter[kind]=${type}`,
    `filter[user_id]=${currentUser.id}`,
  ];
  const fields = [
    `fields[libraryEntries]=status,anime,progress,notes,rating,startedAt,finishedAt,updatedAt,createdAt`,
    `fields[${type}]=titles,description,averageRating,posterImage,status,startDate,endDate,episodeCount,showType,nsfw,coverImage,genres`,
    `fields[genres]=name`,
  ];
  const pagination = [`page[limit]=${perChunk}`, `page[offset]=${chunk}`];

  const url = `${KITSU_BASE_URL}/library-entries?${[
    ...include,
    ...filters,
    ...fields,
    ...pagination,
  ].join('&')}`;

  try {
    const response = await axiosCache(url, {
      id: `kitsu-${type}-${status}-${currentUser.id}-${
        !genre ? chunk : undefined
      }-${!genre ? perChunk : undefined}`,
      method: 'GET',
      headers: createKitsuHeaders(userConfig.auth),
      cache: {
        ttl: 1000 * 60 * 20,
        interpretHeader: false,
        staleIfError: 1000 * 60 * 5,
        cachePredicate: {
          responseMatch: ({ data }) => {
            return data?.data?.length > 0;
          },
        },
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
      throw new Error('No catalog data found!');
    }

    const data = response.data as KitsuLibraryEntryResponse;
    const items = data.data
      .map((entry) => {
        const included = data.included.find(
          (o) =>
            o.id === entry.relationships.anime?.data?.id && o.type === 'anime',
        ) as KitsuLibraryEntryIncluded | undefined;
        const genres = included?.relationships?.genres?.data
          ?.map(
            (o) =>
              data.included.find(
                (i) => i.id === o.id && i.type === 'genres',
              ) as KitsuLibraryEntryIncludedGenres | undefined,
          )
          .filter(exists);
        if (!included) {
          return;
        }
        return {
          ...entry,
          meta: included,
          genres: genres?.map((o) => o.attributes.name) ?? [],
        } satisfies KitsuLibraryEntry;
      })
      .filter(exists)
      .filter((o) => {
        if (
          genre &&
          o.meta.attributes.showType.toUpperCase() !== genre.toUpperCase()
        ) {
          return false;
        }
        return true;
      });

    return items;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error(`Request timed out after ${5000}ms`);
    }
    throw new Error((error as Error).message);
  }
};
