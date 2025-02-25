import { axiosCache } from '~/utils/axios/cache';

import type { AnilistCurrentUser } from '../types/anilist/user';
import type { AnilistUserSettings } from '../types/user-settings';
import { ANILIST_BASE_URL } from './url';

const UserProfileQuery = `id name
    about
    avatar {
      large
      medium
    }
    bannerImage
    isFollowing
    isFollower
    isBlocked
    bans
    options {
      titleLanguage
      displayAdultContent
      airingNotifications
      profileColor
      activityMergeTime
      staffNameLanguage
      notificationOptions {
        type
        enabled
      }
    }
    mediaListOptions {
      scoreFormat
      rowOrder
      animeList {
        sectionOrder
        splitCompletedSectionByFormat
        customLists
        advancedScoring
        advancedScoringEnabled
      }
      mangaList {
        sectionOrder
        splitCompletedSectionByFormat
        customLists
        advancedScoring
        advancedScoringEnabled
      }
    }
    favourites {
      anime {
        nodes {
          id
          title {
            romaji
            english
            native
            userPreferred
          }
          type
        }
      }
      manga {
        nodes {
          id
          title {
            romaji
            english
            native
            userPreferred
          }
          type
        }
      }
      characters {
        nodes {
          id
          name {
            english: full
          }
        }
      }
      staff {
        nodes {
          id
          name {
            english: full
          }
        }
      }
      studios {
        nodes {
          id
          name
        }
      }
    }
    unreadNotificationCount
    siteUrl
    donatorTier
    donatorBadge
    moderatorRoles
    updatedAt
`;

export const getAnilistCurrentUser = async <U extends AnilistCurrentUser>(
  userConfig: AnilistUserSettings,
): Promise<U> => {
  if (!userConfig.auth) {
    throw new Error('No user config! This should not happen!');
  }

  try {
    const response = await axiosCache(ANILIST_BASE_URL, {
      id: `anilist-currentUser-${userConfig.auth.access_token}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${userConfig.auth.access_token}`,
      },
      data: {
        query: `query { Viewer { ${UserProfileQuery} } }`,
      },
      cache: {
        ttl: 1000 * 60 * 20,
        interpretHeader: false,
        staleIfError: 1000 * 60 * 5,
      },
    });

    if (response.status !== 200) {
      if (response.statusText)
        throw new Error(
          `Anilist Api returned with a ${response.status} status. ${response.statusText}`,
        );
      throw new Error(
        `Anilist Api returned with a ${response.status} status. The api might be down!`,
      );
    }

    return (await response.data.data.Viewer) as U;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error(`Request timed out after ${5000}ms`);
    }
    throw new Error((error as Error).message);
  }
};
