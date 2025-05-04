import { axiosSessionCache } from '~/utils/axios/client-cache';

import type { ImporterStremioMCIT } from '../types/manifest';

export async function getStremioLibraryMeta(
  auth: ImporterStremioMCIT['auth'],
): Promise<[string, number][]> {
  if (!auth) {
    throw new Error('No auth provided');
  }

  const metaResponse = await axiosSessionCache()<{
    result: [string, number][];
  }>('https://api.strem.io/api/datastoreMeta', {
    data: {
      authKey: auth.authKey,
      collection: 'libraryItem',
    },
    method: 'POST',
    cache: false,
  });
  return metaResponse.data.result;
}
