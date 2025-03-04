import { axiosCache } from '~/utils/axios/cache';
import type { RequireAtLeastOne } from '~/utils/helpers/types';
import type { IDs } from '~/utils/receiver/types/id';
import { IDSources } from '~/utils/receiver/types/id';

export async function getMappingIdsKitsu(
  id: number,
): Promise<RequireAtLeastOne<IDs>> {
  const mapping: RequireAtLeastOne<IDs> = {
    kitsu: id,
  };
  try {
    const response = await axiosCache(
      `https://kitsu.io/api/edge/anime/${id}/mappings?fields[mappings]=externalSite,externalId`,
      {
        id: `kitsu-mappings-${id}-kitsu`,
        method: 'GET',
        cache: {
          ttl: 1000 * 60 * 60 * 24,
          interpretHeader: false,
          staleIfError: 60 * 60 * 5,
        },
      },
    );
    if (!response.data || !response.data.data || !response.data.data.length) {
      return mapping;
    }
    for (const kitsuMappings of response.data.data) {
      switch (kitsuMappings?.attributes?.externalSite) {
        case 'anilist/anime':
          mapping.anilist = parseInt(kitsuMappings.attributes.externalId);
          break;
        case 'myanimelist/anime':
          mapping.mal = parseInt(kitsuMappings.attributes.externalId);
          break;
        case 'thetvdb/series':
          mapping.tvdb = parseInt(kitsuMappings.attributes.externalId);
          break;
        case 'trakt':
          // mapping.imdb = kitsuMappings.attributes.externalId;
          break;
        // case 'anidb':
        //   mapping.anidb = parseInt(kitsuMappings.attributes.externalId);
        //   break;
        case 'aozora':
          mapping.aozora = kitsuMappings.attributes.externalId;
          break;
        default:
          break;
      }
    }
  } catch (e) {
    console.log(e);
  }

  return mapping;
}

export async function getMappingIdsToKitsu(
  id: string,
  source: IDSources,
): Promise<RequireAtLeastOne<IDs>> {
  try {
    const usableSource = (() => {
      switch (source) {
        case IDSources.ANILIST:
          return 'anilist/anime';
        case IDSources.MAL:
          return 'myanimelist/anime';
        case IDSources.TVDB:
          return 'thetvdb/series';
        case IDSources.IMDB:
          return 'trakt';
        case IDSources.AOZORA:
          return 'aozora';
        default:
          return null;
      }
    })();
    if (!usableSource) {
      throw new Error('Invalid source provided!');
    }
    const url = `https://kitsu.io/api/edge/mappings?include=item&fields[anime]=id&filter[externalSite]=${usableSource}&filter[externalId]=${id}`;
    const response = await axiosCache(url, {
      id: `kitsu-mappings-${id}-${source}`,
      method: 'GET',
      cache: {
        ttl: 1000 * 60 * 60 * 24,
        interpretHeader: false,
        staleIfError: 60 * 60 * 5,
      },
    });

    if (response.data && response.data.data && response.data.data.length) {
      if (
        response.data.data[0].id &&
        response.data.data[0].relationships?.item?.data?.id
      ) {
        return {
          kitsu: response.data.data[0].relationships?.item?.data?.id,
        };
      }
    }
    throw new Error('No data found!');
  } catch (e) {
    console.log(e);
    throw new Error('Failed to fetch ids from Haglund API!');
  }
}
