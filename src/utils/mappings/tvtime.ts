import { axiosCache } from '../axios/cache';
import type { RequireAtLeastOne } from '../helpers/types';
import { IDSources, type IDs } from '../receiver/types/id';
import type { UserSettings } from '../receiver/types/user-settings/settings';
import { createTVTimeHeaders } from '../receivers/tvtime/api/headers';
import { TVTIME_BASE_URL } from '../receivers/tvtime/api/url';
import type { TVTimeCatalogType } from '../receivers/tvtime/types/catalog/catalog-type';
import type { TVTimeMCIT } from '../receivers/tvtime/types/manifest';

export type TVTimeSearchResult = {
  uuid: string;
  id: number;
  name: string;
  type: TVTimeCatalogType;
};

export async function getMappingIdsTVTimeIMDB(
  id: string,
  type: TVTimeCatalogType | undefined,
  userSettings: UserSettings<TVTimeMCIT>,
): Promise<RequireAtLeastOne<IDs>> {
  try {
    const fields = [
      `o=https://search.tvtime.com/v1/search/${type ? type : 'movie,series'}`,
      `q=${id}`,
      `offset=0`,
      `limit=1`,
    ];
    const response = await axiosCache(
      `${TVTIME_BASE_URL}?${fields.join('&')}`,
      {
        id: `tvtime-mappings-${id}-${IDSources.IMDB}`,
        headers: createTVTimeHeaders(userSettings.auth),
        method: 'GET',
        cache: {
          ttl: 1000 * 60 * 60 * 24,
          interpretHeader: false,
          staleIfError: 60 * 60 * 5,
        },
      },
    );

    const tvTimeResult = response.data as {
      status: 'success' | 'error';
      data: TVTimeSearchResult[];
    };

    if (tvTimeResult.status !== 'success') {
      throw new Error('Failed to fetch meta from TVTime API!');
    }

    const ids: RequireAtLeastOne<IDs> = {
      [IDSources.IMDB]: id,
    };

    for (const result of tvTimeResult.data) {
      const { id: tvdbId, uuid } = result;
      return {
        [IDSources.IMDB]: id,
        [IDSources.TVDB]: tvdbId,
        [IDSources.TVTIME]: uuid,
      };
    }
    return ids;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch ids from Haglund API!');
  }
}
