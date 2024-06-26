import { Anilist as NewAnilist } from '@tdanks2000/anilist-wrapper';
import type { MediaListStatus } from '@tdanks2000/anilist-wrapper/dist/types';
import type { MediaSearchEntry } from 'anilist-node';
import Anilist from 'anilist-node';

import type { CinemetaEpisode, CinemetaMeta } from '../cinemeta/meta';
import type { AnilistLibrary } from './types';

export async function getAnilistItem(
  id: number,
  userConfig: Record<string, string> | undefined,
) {
  if (!userConfig || !userConfig.accesstoken) {
    return;
  }

  try {
    const anilist = new NewAnilist(userConfig.accesstoken);
    const anilistResult = (await anilist.media.anime(id)) as {
      data?: { Media: { mediaListEntry: any; streamingEpisodes?: any[] } };
    };
    return {
      seasonTitle: (anilistResult.data?.Media as any)?.title?.english,
      ...anilistResult.data?.Media.mediaListEntry,
    };
  } catch (e) {
    console.log(e);
  }
  return;
}

export async function searchAnilistItem(
  cinemetaInfo: CinemetaMeta | null,
  userConfig: Record<string, string> | undefined,
  episode?: CinemetaEpisode,
) {
  if (!userConfig || !userConfig.accesstoken) {
    return;
  }

  if (!cinemetaInfo || !cinemetaInfo.meta) {
    return;
  }

  if (
    !(
      cinemetaInfo.meta.genres && cinemetaInfo.meta.genres.includes('Animation')
    )
  ) {
    return;
  }

  const releaseDate = episode
    ? episode.released.split('T')[0].split('-')
    : undefined;

  let tempAnilistResult: MediaSearchEntry | undefined;
  try {
    const node_anilist = new Anilist(userConfig.accesstoken);

    if (releaseDate) {
      tempAnilistResult = await node_anilist.searchEntry.anime(
        cinemetaInfo.meta.name,
        {
          // @ts-ignore
          startDate_lesser: parseInt(releaseDate.join('')),
          // @ts-ignore
          endDate_greater: parseInt(releaseDate.join('')),
        },
      );
    }

    if (
      !Array.isArray(tempAnilistResult?.media) ||
      typeof tempAnilistResult?.media[0] === 'undefined'
    ) {
      tempAnilistResult = await node_anilist.searchEntry.anime(
        cinemetaInfo.meta.name,
        {},
      );
    }
  } catch (e) {
    console.log(e);
  }

  if (!tempAnilistResult) {
    return;
  }

  if (
    !Array.isArray(tempAnilistResult.media) ||
    typeof tempAnilistResult.media[0] === 'undefined'
  ) {
    return;
  }

  let firstMatch;
  let secondMatch;
  try {
    const anilist = new NewAnilist(userConfig.accesstoken);
    for (let i = 0; i < tempAnilistResult.media.length; i++) {
      if (
        episode &&
        episode.season &&
        episode.season > 1 &&
        !tempAnilistResult.media[i].title.english.includes(
          episode.season.toString(),
        )
      ) {
        continue;
      }
      const anilistResult = (await anilist.media.anime(
        tempAnilistResult.media[i].id,
      )) as {
        data?: { Media: { mediaListEntry: any; streamingEpisodes?: any[] } };
      };
      if (
        anilistResult.data &&
        anilistResult.data.Media.streamingEpisodes &&
        anilistResult.data.Media.streamingEpisodes.length > 0
      ) {
        const anilistResultWithEpisode =
          anilistResult.data.Media.streamingEpisodes.find((x) =>
            x.title.includes(episode?.name),
          );

        if (anilistResultWithEpisode) {
          return {
            seasonTitle: (anilistResult.data.Media as any)?.title?.english,
            ...anilistResult.data.Media.mediaListEntry,
            mediaId: tempAnilistResult.media[i].id,
          };
        }
      }

      if (!firstMatch && anilistResult.data?.Media.mediaListEntry) {
        firstMatch = {
          seasonTitle: (anilistResult.data.Media as any)?.title?.english,
          ...anilistResult.data.Media.mediaListEntry,
          mediaId: tempAnilistResult.media[i].id,
        };
      }

      if (
        anilistResult.data &&
        !anilistResult.data.Media.mediaListEntry &&
        !episode
      ) {
        const titles = Object.values(tempAnilistResult.media[i].title);

        for (let j = 0; j < titles.length; j++) {
          if (titles[j] === cinemetaInfo.meta.name) {
            return {
              seasonTitle: (anilistResult.data.Media as any)?.title?.english,
              ...anilistResult.data.Media,
            };
          }
        }
      } else if (
        !secondMatch &&
        anilistResult.data &&
        !anilistResult.data.Media.mediaListEntry &&
        episode
      ) {
        const titles = Object.values(tempAnilistResult.media[i].title);

        for (let j = 0; j < titles.length; j++) {
          if (titles[j] === cinemetaInfo.meta.name) {
            secondMatch = {
              seasonTitle: (anilistResult.data.Media as any)?.title?.english,
              ...anilistResult.data.Media,
            };
          }
        }
      }
    }
  } catch (e) {
    console.log(e);
  }

  return firstMatch || secondMatch;
}

export async function getAnilistUserList(
  status: MediaListStatus,
  userConfig: Record<string, string> | undefined,
): Promise<AnilistLibrary> {
  if (!userConfig || !userConfig.accesstoken) {
    return {
      data: {
        MediaListCollection: {
          lists: [],
        },
      },
    };
  }

  try {
    const node_anilist = new NewAnilist(userConfig.accesstoken);
    const user = await node_anilist.user.getCurrentUser();
    return (await node_anilist.lists.anime(
      (user as any).data.Viewer.id,
      status,
    )) as AnilistLibrary;
  } catch (e) {
    console.log(e);
  }

  return {
    data: {
      MediaListCollection: {
        lists: [],
      },
    },
  };
}
