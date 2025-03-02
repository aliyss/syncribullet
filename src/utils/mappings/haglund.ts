import { axiosCache } from '~/utils/axios/cache';
import type { RequireAtLeastOne } from '~/utils/helpers/types';
import type { IDs } from '~/utils/receiver/types/id';
import { IDSources } from '~/utils/receiver/types/id';

export async function getMappingIdsHaglund(
  id: string,
  source: IDSources,
): Promise<RequireAtLeastOne<IDs>> {
  try {
    const response = await axiosCache(
      `https://arm.haglund.dev/api/v2/ids?source=${source}&id=${id}&include=anilist,kitsu,myanimelist,imdb`,
      {
        id: `haglund-mappings-${id}-${source}`,
        method: 'GET',
        cache: {
          ttl: 1000 * 60 * 60 * 24,
          interpretHeader: false,
          staleIfError: 60 * 60 * 5,
        },
      },
    );
    const haglundIds = (await response.data) as Record<string, string>;
    const ids = {} as RequireAtLeastOne<IDs>;
    for (const key in haglundIds) {
      if (!haglundIds[key]) {
        continue;
      }
      switch (key) {
        case 'anilist':
          ids.anilist = parseInt(haglundIds[key]);
          break;
        case 'kitsu':
          ids.kitsu = parseInt(haglundIds[key]);
          break;
        case 'myanimelist':
          ids.mal = parseInt(haglundIds[key]);
          break;
        case 'imdb':
          ids.imdb = haglundIds[key];
          break;
        default:
          break;
      }
    }
    return ids;
  } catch (e) {
    console.log(e);
    throw new Error('Failed to fetch ids from Haglund API!');
  }
}

export async function getMappingIdsHaglundIMDB(
  id: string,
  season: number | undefined,
): Promise<RequireAtLeastOne<IDs>> {
  try {
    const response = await axiosCache(
      `https://arm.haglund.dev/api/v2/imdb?id=${id}&include=anilist,kitsu,myanimelist,imdb`,
      {
        id: `haglund-mappings-${id}-${IDSources.IMDB}`,
        method: 'GET',
        cache: {
          ttl: 1000 * 60 * 60 * 24,
          interpretHeader: false,
          staleIfError: 60 * 60 * 5,
        },
      },
    );
    const haglundIds = (await response.data) as Record<string, string>[];
    let haglundSeason = {} as Record<string, string>;
    if (season && haglundIds.length >= 1 && haglundIds[season - 1]) {
      haglundSeason = haglundIds[season - 1];
    } else if (!season && haglundIds.length >= 1) {
      haglundSeason = haglundIds[0];
    }
    const ids = {} as RequireAtLeastOne<IDs>;
    for (const key in haglundSeason) {
      if (!haglundSeason[key]) {
        continue;
      }
      switch (key) {
        case 'anilist':
          ids.anilist = parseInt(haglundSeason[key]);
          break;
        case 'kitsu':
          ids.kitsu = parseInt(haglundSeason[key]);
          break;
        case 'myanimelist':
          ids.mal = parseInt(haglundSeason[key]);
          break;
        case 'imdb':
          ids.imdb = haglundSeason[key];
          break;
        default:
          break;
      }
    }
    return ids;
  } catch (e) {
    console.log(e);
    throw new Error('Failed to fetch ids from Haglund API!');
  }
}
