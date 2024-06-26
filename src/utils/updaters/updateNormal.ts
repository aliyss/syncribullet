import { getAnilistItem, searchAnilistItem } from '../anilist/get';
import { setAnilistItem } from '../anilist/set';
import { validateAnilistUserConfig } from '../anilist/validate';
import { getCinemetaMeta } from '../cinemeta/meta';
import type { CinemetaEpisode, CinemetaMeta } from '../cinemeta/meta';
import { convertHaglundIdsToIds, getHaglundIds } from '../haglund/get';
import type { IDs } from '../ids/types';
import { getSimklItem } from '../simkl/get';
import type { SetSimklItem } from '../simkl/set';
import { setSimklMovieItem, setSimklShowItem } from '../simkl/set';
import { validateSimklUserConfig } from '../simkl/validate';
import type { StremioSubtitleId } from '../stremio/types';

export const updateStandard = async (
  stremioInfo: StremioSubtitleId,
  ids: IDs,
  userConfig: Record<string, Record<string, string> | undefined>,
) => {
  let cinemetaInfo: CinemetaMeta | null = null;

  if (
    ids.imdb &&
    !ids.anilist &&
    validateSimklUserConfig(userConfig['simkl'])
  ) {
    cinemetaInfo = await getCinemetaMeta(stremioInfo.type, ids.imdb);
  }

  const simklResult: SetSimklItem | undefined = await getSimklItem(
    cinemetaInfo,
    ids,
    userConfig['simkl'],
  );

  let timeout = 0;
  if (cinemetaInfo?.meta?.runtime) {
    timeout = parseInt(cinemetaInfo.meta.runtime.split(' ')[0]) * 60 * 1000;
  }

  let anilistResult: any | undefined = ids.anilist
    ? await getAnilistItem(ids.anilist, userConfig['anilist'])
    : undefined;

  if (
    !cinemetaInfo &&
    ids.imdb !== undefined &&
    !anilistResult &&
    validateAnilistUserConfig(userConfig['anilist'])
  ) {
    cinemetaInfo = await getCinemetaMeta(stremioInfo.type, ids.imdb);
  }

  if (cinemetaInfo?.meta && !anilistResult) {
    const videoId = `${stremioInfo.id}:${stremioInfo.season || 0}:${
      stremioInfo.episode
    }`;
    const video = cinemetaInfo.meta.videos?.find(
      (x: CinemetaEpisode) => x.id === videoId,
    );
    anilistResult = await searchAnilistItem(
      cinemetaInfo,
      userConfig['anilist'],
      video,
    );
  }

  if (anilistResult.seasonTitle && simklResult) {
    simklResult.name = anilistResult.seasonTitle;
  }

  if (anilistResult && simklResult) {
    simklResult.ids.anilist = anilistResult.mediaId || anilistResult.id;
    if (simklResult.ids.anilist) {
      simklResult.ids.imdb = undefined;
    }
  }

  const seasonCount = stremioInfo.season || 0;
  const episodeCount = stremioInfo.episode || 0;

  console.log(anilistResult, 'anilistResult');
  console.log(simklResult, 'simklResult');
  console.log(seasonCount, 'seasonCount');
  console.log(episodeCount, 'episodeCount');

  setTimeout(
    async function () {
      const syncedItems = [];
      const anilistUpdateResult = await setAnilistItem(
        anilistResult,
        episodeCount,
        userConfig['anilist'],
      );
      let simklUpdateResult;
      if (stremioInfo.type === 'series' && simklResult) {
        simklUpdateResult = await setSimklShowItem(
          simklResult,
          seasonCount,
          episodeCount,
          userConfig['simkl'],
        );
      } else if (stremioInfo.type === 'movie' && simklResult) {
        simklUpdateResult = await setSimklMovieItem(
          simklResult,
          userConfig['simkl'],
        );
      }
      if (anilistUpdateResult) {
        syncedItems.push('anilist');
      }
      if (simklUpdateResult) {
        syncedItems.push('simkl');
      }
    },
    timeout / 1000 / 60,
  );
};

export const updateNormal = async (
  stremioInfo: StremioSubtitleId,
  userConfig: Record<string, Record<string, string> | undefined>,
) => {
  let ids: IDs | undefined;
  switch (stremioInfo.source) {
    case 'kitsu':
      const haglundIds = await getHaglundIds(
        stremioInfo.source,
        stremioInfo.id,
      );
      if (!haglundIds) {
        return;
      }
      ids = convertHaglundIdsToIds(haglundIds);
      console.log(ids, 'kitsu');
      break;
    default:
      ids = {
        imdb: stremioInfo.id,
      };
      console.log(ids, 'imdb');
      break;
  }
  updateStandard(stremioInfo, ids, userConfig);
};
