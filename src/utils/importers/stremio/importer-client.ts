import { ImporterClient } from '~/utils/importer/importer-client';
import { createIDsFromCatalogString } from '~/utils/receiver/types/id';

import { getStremioLibraryItems } from './api/library-items';
import { getStremioLibraryMeta } from './api/library-meta';
import { importerInfo } from './constants';
import type { ImporterStremioMCIT } from './types/manifest';

export class StremioClientImporter extends ImporterClient<ImporterStremioMCIT> {
  importerInfo = importerInfo;

  async _convertFromImportCatalogLibraryItem(
    data: ImporterStremioMCIT['importData']['preImportCatalogLibraryItem'],
  ): Promise<
    ImporterStremioMCIT['importData']['importCatalogDataUncalculatedType']
  > {
    const ids = createIDsFromCatalogString(data._id);
    return {
      id: ids.ids,
      info: {
        id: data._id,
        name: data.name,
        type: data.type,
        series:
          data.type === 'series' && data.state.episode
            ? {
                season: data.state.season,
                episode: data.state.episode,
              }
            : undefined,
        posterUrl: data.poster,
        state: data.state,
      },
      metadata: {
        modified: new Date(data._mtime),
      },
      filterPrecalculatedValues: {
        moviesStateFlaggedUnwatched:
          data.type === 'movie' ? !data.state.flaggedWatched : null,
        moviesStateFlaggedWatched:
          data.type === 'movie' ? !!data.state.flaggedWatched : null,
        seriesStateFlaggedUnwatched:
          data.type === 'series' ? !data.state.flaggedWatched : null,
        seriesStateFlaggedWatched:
          data.type === 'series' ? !!data.state.flaggedWatched : null,
        seriesBackfillEpisodes: null,
        seriesUseCinemetaComparison: null,
      },
    };
  }

  async _loadLibraryDiff(
    lastImport?: string,
  ): Promise<
    ImporterStremioMCIT['importData']['preImportCatalogLibraryItem'][]
  > {
    const metas = await getStremioLibraryMeta(this.userSettings?.auth);
    let unsyncedIds: string[] | undefined = metas
      .filter((meta) => {
        const [, lastModified] = meta;
        if (!lastImport) {
          return true;
        }
        return lastImport ? lastModified > Number(lastImport) : true;
      })
      .map((meta) => meta[0]);

    if (unsyncedIds.length === 0) {
      return [];
    }

    if (unsyncedIds.length === metas.length) {
      unsyncedIds = undefined;
    }

    return await getStremioLibraryItems(this.userSettings?.auth, unsyncedIds);
  }
}
