import { axiosInstance } from '~/utils/axios/client-cache';
import { exists } from '~/utils/helpers/array';
import { ImporterClient } from '~/utils/importer/importer-client';
import type { ImportCatalogsParsed } from '~/utils/importer/types/user-settings/import-catalogs';
import {
  createIDCatalogString,
  createIDsFromCatalogString,
  testMaybeAnime,
} from '~/utils/receiver/types/id';
import type { IDs } from '~/utils/receiver/types/id';
import type { MetaObject } from '~/utils/receiver/types/meta-object';
import type { ReceiverMCITypes } from '~/utils/receiver/types/receivers';
import { WatchedBitField } from '~/utils/string/bitfield';

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
    const markAsWatched =
      !!data.state.flaggedWatched || !!data.state.timesWatched;

    const watched =
      data.type === 'series' && data.state.watched
        ? createIDsFromCatalogString(data.state.watched)
        : undefined;

    return {
      id: ids.ids,
      info: {
        id: data._id,
        name: data.name,
        type: data.type,
        maybeAnime: testMaybeAnime(ids.ids) ? true : undefined,
        series:
          data.type === 'series'
            ? watched?.count
              ? {
                  season: watched.count.season,
                  episode: watched.count.episode,
                  cinemeta: data.state.watched,
                }
              : data.state.episode
                ? {
                    season: data.state.season,
                    episode: data.state.episode,
                  }
                : undefined
            : undefined,
        posterUrl: data.poster,
        state: data.state,
      },
      metadata: {
        modified: new Date(data._mtime),
        last_watched: data.state.lastWatched
          ? new Date(data.state.lastWatched)
          : undefined,
      },
      filterPrecalculatedValues: {
        moviesStateFlaggedUnwatched:
          data.type === 'movie' ? !markAsWatched : null,

        moviesStateFlaggedWatched: data.type === 'movie' ? markAsWatched : null,
        moviesStateFlaggedDropped: data.type === 'movie' ? false : null,
        seriesStateFlaggedUnwatched:
          data.type === 'series' ? !markAsWatched : null,
        seriesStateFlaggedWatched:
          data.type === 'series' ? markAsWatched : null,
        seriesStateFlaggedDropped: data.type === 'series' ? false : null,
        seriesStateFlaggedOnHold: data.type === 'series' ? false : null,
        seriesStateHasWatchCount:
          data.type === 'series'
            ? markAsWatched
              ? null
              : data.state.watched
                ? true
                : false
            : null,
        seriesBackfillEpisodes: null,
        seriesUseCinemetaComparison: null,
        seriesPreferStateFlaggedWatchedOverWatchCount: null,
        supportsTypes: [data.type],
      },
    };
  }

  async _startImport() {
    throw new Error('Not implemented');
  }

  async markedAsWatched<T>(
    item: ImportCatalogsParsed<
      ReceiverMCITypes,
      ImporterStremioMCIT
    >['items'][number]['diffItem'],
    presetItem: T,
  ): Promise<
    [
      (
        | {
            ids: Partial<IDs>;
            count: {
              season: number;
              episode: number;
            };
          }[]
        | undefined
      ),
      T,
    ]
  > {
    if (!item.info.series?.cinemeta) {
      return [undefined, presetItem];
    }

    if (!item.filterPrecalculatedValues.seriesUseCinemetaComparison) {
      return [undefined, presetItem];
    }

    try {
      const response = await axiosInstance<
        | {
            meta: MetaObject | {} | undefined;
          }
        | undefined
      >(
        `/addon-routing/meta/${item.info.type}/${createIDCatalogString(createIDsFromCatalogString(item.info.series.cinemeta).ids)}.json`,
        {
          method: 'GET',
        },
      );
      const data = response.data;
      if (
        !data ||
        !data.meta ||
        !('videos' in data.meta) ||
        !data.meta.videos ||
        data.meta.videos.length === 0
      ) {
        return [undefined, presetItem];
      }
      const watched = WatchedBitField.constructAndResize(
        item.info.series.cinemeta,
        data.meta.videos.map((video) => video.id),
      );
      const items = data.meta.videos
        .filter((video) => {
          return watched.getVideo(video.id);
        })
        .map((video) => {
          const item = createIDsFromCatalogString(video.id);
          if (item.count) {
            return {
              ...item,
              count: item.count,
            };
          }
          return undefined;
        })
        .filter(exists);

      return [items, presetItem];
    } catch (e) {
      console.error('Error in markedAsWatched', e);
    }

    return [undefined, presetItem];
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
