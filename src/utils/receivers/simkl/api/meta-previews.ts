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
    const data = await fetch(
      `https://api.simkl.com/sync/all-items/${type}/${status}`,
      {
        method: 'GET',
        headers: createSimklHeaders(userConfig.auth),
      },
    );
    return await data.json();
  } catch (e) {
    console.log(e);
    throw new Error('Failed to fetch data from Simkl API!');
  }
}
