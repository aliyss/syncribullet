import { axiosInstance } from '~/utils/axios/cache';

import { TVTimeCatalogType } from '../types/catalog/catalog-type';
import type { TVTimeUserSettings } from '../types/user-settings';
import { createTVTimeHeaders } from './headers';
import { TVTIME_BASE_URL } from './url';

export const syncTVTimeMetaObject = async (
  id: string,
  type: TVTimeCatalogType,
  userConfig: TVTimeUserSettings,
  edisodeId?: number,
): Promise<void> => {
  const fields =
    type === TVTimeCatalogType.SERIES
      ? [
          `o=https://api2.tozelabs.com/v2/watched_episodes/episode/${edisodeId}`,
          `is_rewatch=0`,
        ]
      : [`o=https://msapi.tvtime.com/prod/v1/tracking/${id}/watch`];
  const url = `${TVTIME_BASE_URL}?${fields.join('&')}`;

  try {
    const response = await axiosInstance(url, {
      method: 'POST',
      headers: createTVTimeHeaders(userConfig.auth),
    });

    if (response.status >= 200 && response.status < 300) {
      try {
        return await response.data;
      } catch {
        return;
      }
    } else {
      if (response.statusText)
        throw new Error(
          `TVTime Api returned with a ${response.status} status. ${response.statusText}`,
        );
      throw new Error(
        `TVTime Api returned with a ${response.status} status. The api might be down!`,
      );
    }
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error(`Request timed out after ${5000}ms`);
    }
    throw new Error((error as Error).message);
  }
};
