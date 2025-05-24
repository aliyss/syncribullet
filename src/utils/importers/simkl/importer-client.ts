import { ImporterClient } from '~/utils/importer/importer-client';
import type { ImporterMCITypes } from '~/utils/importer/types/importers';
import type { ImportCatalogsParsed } from '~/utils/importer/types/user-settings/import-catalogs';
import { ManifestReceiverTypes } from '~/utils/manifest';
import { createIDCatalogString } from '~/utils/receiver/types/id';
import type { IDs } from '~/utils/receiver/types/id';
import type { ReceiverMCITypes } from '~/utils/receiver/types/receivers';
import type { UserSettings } from '~/utils/receiver/types/user-settings/settings';
import { convertToInternalIds } from '~/utils/receivers/simkl/meta/id';
import type { SimklMCIT } from '~/utils/receivers/simkl/types/manifest';
import type {
  SimklMovieAddToList,
  SimklShowAddToList,
} from '~/utils/receivers/simkl/types/simkl/library';

import { getSimklLibraryItems } from './api/library-items';
import { syncSimklLibraryItems } from './api/sync';
import { importerInfo } from './constants';
import type { ImporterSimklMCIT } from './types/manifest';

const getSeasonEpisode = (
  input: `S${number}E${number}` | `E${number}` | string | undefined | null,
) => {
  if (!input) {
    return undefined;
  }
  const [season, episode] = input.split(/S|E/).slice(1);
  if (!season && !episode) {
    return undefined;
  }
  if (!episode) {
    return {
      season: undefined,
      episode: parseInt(season),
    };
  }
  return {
    season: parseInt(season),
    episode: parseInt(episode),
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
    let isMovieDropped: boolean | null;
    let isShowDropped: boolean | null;
    let isShowOnHold: boolean | null;
    if ('show' in data) {
      isMovieWatched = null;
      isMovieDropped = null;
      isShowWatched = data.status === 'completed';
      isShowDropped = data.status === 'dropped';
      isShowOnHold = data.status === 'hold';
      ids.ids = convertToInternalIds(data.show.ids);
      const episodeCount = getSeasonEpisode(data.last_watched);
      if (!episodeCount?.season && episodeCount?.episode) {
        episodeCount.season = 1;
      }

      const episodeCountNext = getSeasonEpisode(data.next_to_watch);
      info = {
        id: createIDCatalogString({
          simkl: ids.ids.simkl,
        })!,
        name: data.show.title,
        type: ManifestReceiverTypes.SERIES,
        series: episodeCount,
        currentLibrary: data.status,
        seriesFullCount: data.total_episodes_count
          ? {
              season: episodeCount?.season ?? episodeCountNext?.season,
              episode: data.total_episodes_count,
            }
          : undefined,
        maybeAnime: data.show.anime_type ? true : undefined,
        posterUrl: data.show.poster
          ? 'https://simkl.in/posters/' + data.show.poster + '_0.jpg'
          : undefined,
        state: data.show,
      };
    } else {
      isMovieWatched = data.status === 'completed';
      isMovieDropped = data.status === 'dropped';
      isShowWatched = null;
      isShowDropped = null;
      isShowOnHold = null;
      ids.ids = convertToInternalIds(data.movie.ids);
      info = {
        id: createIDCatalogString({
          simkl: ids.ids.simkl,
        })!,
        name: data.movie.title,
        type: ManifestReceiverTypes.MOVIE,
        posterUrl: data.movie.poster
          ? 'https://simkl.in/posters/' + data.movie.poster + '_0.jpg'
          : undefined,
        state: data.movie,
      };
    }

    return {
      id: ids.ids,
      info,
      metadata: {
        modified: new Date(data.added_to_watchlist_at),
        last_watched: data.last_watched_at
          ? new Date(data.last_watched_at)
          : undefined,
      },
      filterPrecalculatedValues: {
        moviesStateFlaggedUnwatched:
          isMovieWatched === null ? null : !isMovieWatched,
        moviesStateFlaggedWatched:
          isMovieWatched === null ? null : isMovieWatched,
        moviesStateFlaggedDropped:
          isMovieDropped === null ? null : isMovieDropped,
        seriesStateFlaggedUnwatched:
          isShowWatched === null ? null : !isShowWatched,
        seriesStateFlaggedWatched:
          isShowWatched === null ? null : isShowWatched,
        seriesStateFlaggedDropped:
          isShowDropped === null ? null : isShowDropped,
        seriesStateFlaggedOnHold: isShowOnHold === null ? null : isShowOnHold,
        seriesStateHasWatchCount:
          isShowWatched !== null
            ? isShowWatched
              ? null
              : data.last_watched_at
                ? true
                : false
            : null,
        seriesPreferStateFlaggedWatchedOverWatchCount: null,
        seriesBackfillEpisodes: null,
        supportsTypes: [info.type],
      },
    };
  }

  async _startImport(
    libraryItems: {
      item: ImportCatalogsParsed<
        SimklMCIT,
        ImporterMCITypes
      >['items'][number]['diffItem'];
      catalogId: [
        SimklMCIT['receiverType'],
        SimklMCIT['receiverCatalogType'],
        SimklMCIT['receiverCatalogStatus'],
      ];
      hasBeenModified: boolean;
    }[],
    importer: ImporterClient<ImporterMCITypes>,
    auth: NonNullable<UserSettings<SimklMCIT>['auth']>,
  ) {
    const libraryItemModificationPromises: Promise<
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
        SimklShowAddToList,
      ]
    >[] = [];
    const libraryItemsToImport = libraryItems.reduce(
      (
        acc: { movies: SimklMovieAddToList[]; shows: SimklShowAddToList[] },
        item,
      ) => {
        const presetItem = {
          status: item.catalogId[2],
          ids: item.item.id,
          title: item.item.info.name,
          added_at: item.item.metadata.modified.toISOString(),
        };
        if (item.item.info.type === ManifestReceiverTypes.MOVIE) {
          acc.movies.push(presetItem);
          return acc;
        } else {
          if (!item.item.info.series) {
            acc.shows.push(presetItem);
            return acc;
          }
          if (
            (item.hasBeenModified ||
              item.item.filterPrecalculatedValues.seriesBackfillEpisodes ||
              item.item.filterPrecalculatedValues.seriesStateHasWatchCount) &&
            !item.item.filterPrecalculatedValues.seriesStateFlaggedWatched
          ) {
            const newItem = {
              ...presetItem,
              seasons: Array.apply(
                null,
                Array(item.item.info.series.season || 1),
              ).map((_, i) => ({
                number: i + 1,
                watched_at: item.item.metadata.last_watched?.toISOString(),
                episodes:
                  item.item.info.series &&
                  i + 1 === item.item.info.series.season
                    ? Array.apply(
                        null,
                        Array(item.item.info.series.episode),
                      ).map((_, j) => ({
                        number: j + 1,
                      }))
                    : undefined,
              })),
            };
            if (item.item.filterPrecalculatedValues.seriesStateHasWatchCount) {
              libraryItemModificationPromises.push(
                importer.markedAsWatched(item.item, newItem),
              );
              return acc;
            } else {
              acc.shows.push(newItem);
              return acc;
            }
          }

          acc.shows.push(presetItem);
          return acc;
        }
      },
      { movies: [], shows: [] },
    );

    const responseItems = await Promise.all(libraryItemModificationPromises);
    for (let i = 0; i < responseItems.length; i++) {
      const [episodes, item] = responseItems[i];
      if (!episodes || episodes.length === 0) {
        libraryItemsToImport.shows.push(item);
        continue;
      }
      item.seasons = episodes.reduce(
        (acc, item) => {
          if (acc === undefined) {
            acc = [];
          }
          if (item.count.season) {
            const season = acc.find((s) => s.number === item.count.season);
            if (season) {
              season.episodes = item.count.episode
                ? [
                    ...(season.episodes || []),
                    {
                      number: item.count.episode,
                    },
                  ]
                : season.episodes;
            } else {
              acc.push({
                number: item.count.season,
                episodes: item.count.episode
                  ? [
                      {
                        number: item.count.episode,
                      },
                    ]
                  : undefined,
              });
            }
          }
          return acc;
        },
        [] as SimklShowAddToList['seasons'],
      );
      libraryItemsToImport.shows.push(item);
    }
    const response = await syncSimklLibraryItems(auth, libraryItemsToImport);

    // const libraryResponse = await syncSimklLibraryItemsAddToLibrary(auth, {
    //   movies: libraryItemsToImport.movies
    //     .map((item) => ({
    //       ...item,
    //       to: response.added.statuses.find((x) =>
    //         compareIDs(x.request.ids, item.ids),
    //       )?.response.status,
    //     }))
    //     .filter((x) => x.to !== undefined),
    //   shows: libraryItemsToImport.shows
    //     .map((item) => ({
    //       ...item,
    //       to: response.added.statuses.find((x) =>
    //         compareIDs(x.request.ids, item.ids),
    //       )?.response.status,
    //     }))
    //     .filter((x) => x.to !== undefined),
    // });
    console.log('Watch History Sync', response);
    // console.log('Library Sync', libraryResponse);
    // TODO: handle not found items
  }

  async markedAsWatched<T>(
    _: ImportCatalogsParsed<
      ReceiverMCITypes,
      ImporterSimklMCIT
    >['items'][number]['diffItem'],
    _presetItem: T,
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
    throw new Error('Not implemented');
  }

  async _loadLibraryDiff(
    lastImport?: string,
  ): Promise<ImporterSimklMCIT['importData']['preImportCatalogLibraryItem'][]> {
    return await getSimklLibraryItems(this.userSettings?.auth, lastImport);
  }
}
