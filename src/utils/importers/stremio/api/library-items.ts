import { axiosSessionCache } from '~/utils/axios/client-cache';

import type { StremioImportLibraryItem } from '../types/library-item';
import type { ImporterStremioMCIT } from '../types/manifest';

export async function getStremioLibraryItems(
  auth: ImporterStremioMCIT['auth'],
  ids?: string[],
): Promise<StremioImportLibraryItem[]> {
  if (!auth) {
    throw new Error('No auth provided');
  }
  const catalogUpdateResponse = await axiosSessionCache()<{
    result: StremioImportLibraryItem[];
  }>('https://api.strem.io/api/datastoreGet', {
    id: `stremio-library-items-${ids?.join(',')}`,
    data: {
      authKey: auth.authKey,
      collection: 'libraryItem',
      ids: ids ?? [],
      all: ids === undefined ? true : false,
    },
    method: 'POST',
    cache: {
      ttl: 1000 * 60 * 20,
      interpretHeader: false,
      cacheTakeover: false,
      staleIfError: 60 * 60 * 5,
    },
  });
  return catalogUpdateResponse.data.result;
}
