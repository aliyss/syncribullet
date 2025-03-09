import { axiosInstance } from '~/utils/axios/cache';
import type { UserSettings } from '~/utils/receiver/types/user-settings/settings';

import type { TVTimeMCIT } from '../types/manifest';
import type { TVTimeLibraryEntryEpisode } from '../types/tvtime/library-episode';
import { createTVTimeHeaders } from './headers';
import { TVTIME_BASE_URL } from './url';

export const episodesTVTimeMetaObject = async (
  id: string,
  count: {
    season: number;
    episode: number;
  },
  userConfig: UserSettings<TVTimeMCIT>,
): Promise<TVTimeLibraryEntryEpisode> => {
  if (!userConfig.auth) {
    throw new Error('User is not authenticated');
  }

  const fields = [`o=https://msapi.tvtime.com/v1/series/${id}/episodes`];
  const url = `${TVTIME_BASE_URL}?${fields.join('&')}`;

  try {
    const response = await axiosInstance(url, {
      method: 'GET',
      headers: createTVTimeHeaders(userConfig.auth),
    });

    if (response.status >= 200 && response.status < 300 && response.data.data) {
      const episode = (response.data.data as TVTimeLibraryEntryEpisode[]).find(
        (x) => x.season.number === count.season && x.number === count.episode,
      );
      if (!episode) {
        throw new Error('Episode not found');
      }
      return episode;
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
