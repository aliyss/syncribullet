import { axiosCache } from '~/utils/axios/cache';

import type { SimklCatalogStatus } from '../types/catalog/catalog-status';
import type { SimklCatalogType } from '../types/catalog/catalog-type';
import type { SimklLibrary } from '../types/simkl/library';
import type { SimklUserSettings } from '../types/user-settings';
import { createSimklHeaders } from './headers';

export async function getSimklMetaPreviews(
  type: SimklCatalogType,
  status: SimklCatalogStatus,
  userConfig: SimklUserSettings,
): Promise<SimklLibrary> {
  if (!userConfig.auth) {
    throw new Error('No user config! This should not happen!');
  }

  try {
    const response = await axiosCache(
      `https://api.simkl.com/sync/all-items/${type}/${status}`,
      {
        id: `simkl-${type}-${status}-${userConfig.auth.access_token}`,
        method: 'GET',
        headers: createSimklHeaders(userConfig.auth),
        cache: {
          ttl: 1000 * 60 * 20,
          interpretHeader: false,
          staleIfError: 1000 * 60 * 5,
        },
      },
    );
    return await response.data;
  } catch (e) {
    console.log(e);
    throw new Error('Failed to fetch data from Simkl API!');
  }
}
