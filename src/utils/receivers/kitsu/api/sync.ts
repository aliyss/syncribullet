import type { KitsuCatalogStatus } from '../types/catalog/catalog-status';
import type { KitsuCurrentUser } from '../types/kitsu/user';
import type { KitsuUserSettings } from '../types/user-settings';
import { createKitsuHeaders } from './headers';
import { KITSU_BASE_URL } from './url';

export const syncKitsuMetaObject = async (
  id: number,
  status: KitsuCatalogStatus | undefined,
  count:
    | {
        season: number;
        episode: number;
      }
    | undefined,
  userConfig: KitsuUserSettings,
  currentUser: KitsuCurrentUser,
  libraryEntryId: string | undefined,
): Promise<void> => {
  let url = `${KITSU_BASE_URL}/library-entries`;

  const data = {
    data: {
      attributes: {
        status: status || 'current',
        progress: count?.episode,
      },
      relationships: {
        anime: {
          data: {
            id: id.toString(),
            type: 'anime',
          },
        },
        user: {
          data: {
            id: currentUser.id,
            type: 'users',
          },
        },
      },
      type: 'library-entries',
    },
  } as Record<string, any>;

  let method = 'POST';
  if (libraryEntryId) {
    url += `/${libraryEntryId}`;
    data.data.id = libraryEntryId;
    method = 'PATCH';
  }

  try {
    // Has to be done with fetch because axios or kitsu do something wierd.
    const response = await fetch(url, {
      method: method,
      headers: Object.entries(createKitsuHeaders(userConfig.auth)).map(
        ([key, value]) => [`${key}`, `${value}`] as [string, string],
      ),
      body: JSON.stringify(data),
    });

    if (response.status >= 200 && response.status < 300) {
      try {
        return await response.json();
      } catch (error) {
        return;
      }
    } else {
      if (response.statusText)
        throw new Error(
          `Kitsu Api returned with a ${response.status} status. ${response.statusText}`,
        );
      throw new Error(
        `Kitsu Api returned with a ${response.status} status. The api might be down!`,
      );
    }
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error(`Request timed out after ${5000}ms`);
    }
    throw new Error((error as Error).message);
  }
};
