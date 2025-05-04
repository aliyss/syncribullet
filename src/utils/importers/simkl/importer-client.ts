import { ImporterClient } from '~/utils/importer/importer-client';
import type { IDs } from '~/utils/receiver/types/id';
import { convertToInternalIds } from '~/utils/receivers/simkl/meta/id';

import { getSimklLibraryItems } from './api/library-items';
import { importerInfo } from './constants';
import type { ImporterSimklMCIT } from './types/manifest';

const getSeasonEpisode = (
  input: `S${number}E${number}` | `E${number}` | string | undefined | null,
) => {
  if (!input) {
    return undefined;
  }
  const [season, episode] = input.split(/S|E/).slice(1);
  if (!season || !episode) {
    return undefined;
  }
  if (!episode) {
    return {
      season: undefined,
      episode: Number(season),
    };
  }
  return {
    season: Number(season),
    episode: Number(episode),
  };
};

export class SimklClientImporter extends ImporterClient<ImporterSimklMCIT> {
  importerInfo = importerInfo;

  async _convertFromImportCatalogLibraryItem(
    data: ImporterSimklMCIT['importData']['preImportCatalogLibraryItem'],
  ): Promise<
    ImporterSimklMCIT['importData']['importCatalogDataUncalculatedType']
  > {
    const ids: { ids: Partial<IDs> } = { ids: {} };
    let info: ImporterSimklMCIT['importData']['importCatalogDataUncalculatedType']['info'];
    let isMovieWatched: boolean | null;
    let isShowWatched: boolean | null;
    if ('show' in data) {
      isMovieWatched = null;
      isShowWatched = data.status === 'completed';
      ids.ids = convertToInternalIds(data.show.ids);
      info = {
        id: data.show.ids['simkl']!.toString(),
        name: data.show.title,
        type: 'series',
        series: getSeasonEpisode(data.last_watched),
        posterUrl: data.show.poster,
        state: data.show,
      };
    } else {
      isMovieWatched = data.status === 'completed';
      isShowWatched = null;
      ids.ids = convertToInternalIds(data.movie.ids);
      info = {
        id: data.movie.ids['simkl']!.toString(),
        name: data.movie.title,
        type: 'movie',
        posterUrl: data.movie.poster,
        state: data.movie,
      };
    }

    return {
      id: ids.ids,
      info,
      metadata: {
        modified: new Date(data.added_to_watchlist_at),
      },
      filterPrecalculatedValues: {
        moviesStateFlaggedUnwatched:
          isMovieWatched === null ? null : !isMovieWatched,
        moviesStateFlaggedWatched:
          isMovieWatched === null ? null : isMovieWatched,
        seriesStateFlaggedUnwatched:
          isShowWatched === null ? null : !isShowWatched,
        seriesStateFlaggedWatched:
          isShowWatched === null ? null : isShowWatched,
        seriesBackfillEpisodes: null,
      },
    };
  }

  async _loadLibraryDiff(
    lastImport?: string,
  ): Promise<ImporterSimklMCIT['importData']['preImportCatalogLibraryItem'][]> {
    return await getSimklLibraryItems(this.userSettings?.auth, lastImport);
  }
}
