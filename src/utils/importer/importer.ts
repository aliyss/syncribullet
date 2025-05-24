import { exists } from '../helpers/array';
import { ManifestReceiverTypes } from '../manifest';
import type { ReceiverClient } from '../receiver/receiver-client';
import { compareIDs, testMaybeAnime } from '../receiver/types/id';
import type { IDs } from '../receiver/types/id';
import type { ReceiverMCITypes } from '../receiver/types/receivers';
import type { UserSettings as ReceiverUserSettings } from '../receiver/types/user-settings/settings';
import type {
  AllImporters,
  ImporterMCITypes,
  Importers,
} from './types/importers';
import type {
  ImportCatalogDataUncalculated,
  ImportCatalogs,
  ImportCatalogsParsed,
} from './types/user-settings/import-catalogs';
import type { UserSettings } from './types/user-settings/settings';

export interface ImporterInfoBase<R extends AllImporters> {
  id: R;
  text: string;
}

export interface ImporterInfo<R extends Importers> extends ImporterInfoBase<R> {
  icon: string;
  backgroundColour: string;
  borderColour: string;
}

export abstract class ImporterBase<R extends AllImporters> {
  public abstract importerInfo: R extends Importers
    ? ImporterInfo<R>
    : ImporterInfoBase<R>;
}

export abstract class Importer<
  MCIT extends ImporterMCITypes,
> extends ImporterBase<MCIT['importerType']> {
  public userSettings: UserSettings<MCIT> | null = null;

  public _setUserConfig(userSettings: Importer<MCIT>['userSettings']): void {
    this.userSettings = userSettings;
  }

  abstract setUserConfig(userSettings: Importer<MCIT>['userSettings']): void;

  abstract _loadLibraryDiff(
    lastImport?: string,
  ): Promise<MCIT['importData']['preImportCatalogLibraryItem'][]>;

  abstract _startImport<T extends ReceiverMCITypes>(
    libraryItems: {
      item: ImportCatalogsParsed<
        T,
        ImporterMCITypes
      >['items'][number]['diffItem'];
      catalogId: [
        T['receiverType'],
        T['receiverCatalogType'],
        T['receiverCatalogStatus'],
      ];
      hasBeenModified: boolean;
    }[],
    importer: Importer<ImporterMCITypes>,
    auth: NonNullable<ReceiverUserSettings<T>['auth']>,
  ): Promise<void>;

  async startImport<T extends ReceiverMCITypes>(
    libraryItems: {
      item: ImportCatalogsParsed<
        T,
        ImporterMCITypes
      >['items'][number]['diffItem'];
      catalogId: [
        T['receiverType'],
        T['receiverCatalogType'],
        T['receiverCatalogStatus'],
      ];
      originalCatalogId: ImportCatalogsParsed<T, ImporterMCITypes>['id'];
      hasBeenModified: boolean;
    }[],
    userConfig: ReceiverUserSettings<T>,
    importer: Importer<ImporterMCITypes>,
  ): Promise<void> {
    if (!userConfig.importCatalog) {
      throw new Error('No import catalog');
    }
    if (!userConfig.auth) {
      throw new Error('No auth provided');
    }
    for (let i = 0; i < libraryItems.length; i++) {
      const item = libraryItems[i].item;
      const catalog = userConfig.importCatalog[importer.importerInfo.id].find(
        (x) => x.id === libraryItems[i].originalCatalogId,
      );
      item.filterPrecalculatedValues = {
        ...item.filterPrecalculatedValues,
        ...catalog?.filters,
      };
    }
    this._startImport(libraryItems, importer, userConfig.auth);
  }

  abstract _convertFromImportCatalogLibraryItem(
    data: MCIT['importData']['preImportCatalogLibraryItem'],
  ): Promise<MCIT['importData']['importCatalogDataUncalculatedType']>;

  async loadLibraryDiff(
    lastImport?: string,
  ): Promise<MCIT['importData']['importCatalogDataUncalculatedType'][]> {
    const libraryDiff = await this._loadLibraryDiff(lastImport);
    return await Promise.all(
      libraryDiff.map((item) =>
        this._convertFromImportCatalogLibraryItem(item),
      ),
    );
  }

  abstract markedAsWatched<T>(
    item: ImportCatalogsParsed<
      ReceiverMCITypes,
      MCIT
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
  >;

  async filterLibraryUncalculatedDiff(
    libraryDiff1: MCIT['importData']['importCatalogDataUncalculatedType'][],
    libraryDiff2: ImportCatalogDataUncalculated<[]>[],
  ): Promise<
    {
      diffItem: ImporterMCITypes['importData']['importCatalogDataUncalculatedType'];
      diff2Item?: ImportCatalogDataUncalculated<[]>;
    }[]
  > {
    const adjusted = libraryDiff1.map((item1) => {
      const libraryDiff2Item = libraryDiff2.find((item2) =>
        compareIDs(item1.id, item2.id),
      );
      if (!libraryDiff2Item) {
        return {
          diffItem: {
            ...item1,
            info: {
              ...item1.info,
              maybeAnime: testMaybeAnime({
                ...item1.id,
              }),
            },
          },
        };
      }
      if (libraryDiff2Item.metadata.modified > item1.metadata.modified) {
        return undefined;
      }
      if (
        libraryDiff2Item.filterPrecalculatedValues.moviesStateFlaggedWatched
      ) {
        return undefined;
      }
      if (
        libraryDiff2Item.filterPrecalculatedValues.seriesStateFlaggedWatched
      ) {
        return undefined;
      }

      const seriesInfo = item1.info.series;
      const fullSeriesInfo =
        item1.info.seriesFullCount ?? libraryDiff2Item.info.seriesFullCount;

      return {
        diffItem: {
          ...item1,
          id: {
            ...item1.id,
            ...libraryDiff2Item.id,
          },
          info: {
            id: libraryDiff2Item.info.id || item1.info.id,
            name: libraryDiff2Item.info.name || item1.info.name,
            type: libraryDiff2Item.info.type || item1.info.type,
            currentLibrary: libraryDiff2Item.info.currentLibrary,
            maybeAnime:
              item1.info.maybeAnime ??
              libraryDiff2Item.info.maybeAnime ??
              testMaybeAnime({
                ...item1.id,
                ...libraryDiff2Item.id,
              }),
            series: seriesInfo,
            seriesFullCount: fullSeriesInfo,
            posterUrl: item1.info.posterUrl || libraryDiff2Item.info.posterUrl,
            state: {
              importer: item1.info.state,
              mappedItem: libraryDiff2Item,
            },
          },
          filterPrecalculatedValues: {
            ...item1.filterPrecalculatedValues,
            moviesStateFlaggedDropped:
              libraryDiff2Item.filterPrecalculatedValues
                .seriesStateFlaggedDropped ??
              item1.filterPrecalculatedValues.moviesStateFlaggedDropped,
            seriesStateFlaggedDropped:
              libraryDiff2Item.filterPrecalculatedValues
                .seriesStateFlaggedDropped ??
              item1.filterPrecalculatedValues.seriesStateFlaggedDropped,
            seriesStateFlaggedOnHold:
              libraryDiff2Item.filterPrecalculatedValues
                .seriesStateFlaggedOnHold ??
              item1.filterPrecalculatedValues.seriesStateFlaggedOnHold,
          },
        },
        diff2Item: libraryDiff2Item,
      };
    });
    return adjusted.filter(exists);
  }

  async sortLibraryDiff<RCIT extends ReceiverMCITypes>(
    libraryDiff: {
      diffItem: ImporterMCITypes['importData']['importCatalogDataUncalculatedType'];
      diff2Item?: ImportCatalogDataUncalculated<[]>;
    }[],
    settings: Readonly<ImportCatalogs<RCIT, ImporterMCITypes>[]>,
    receiver: ReceiverClient<RCIT>,
  ): Promise<ImportCatalogsParsed<RCIT, MCIT>[]> {
    const catalogs = receiver.manifestCatalogItems;
    const hasAnimeCatalogs = catalogs.some(
      (x) => x.type === ManifestReceiverTypes.ANIME,
    );
    return settings
      .filter((setting) => !!setting.value)
      .map((setting) => {
        const catalog = catalogs.find((x) => x.id === setting.id);

        return {
          id: setting.id,
          items: libraryDiff.filter((diff) => {
            const item = diff.diffItem;
            if (item.info.type === 'movie') {
              if (
                item.filterPrecalculatedValues.moviesStateFlaggedWatched ===
                  setting.filters?.moviesStateFlaggedWatched &&
                item.filterPrecalculatedValues.moviesStateFlaggedUnwatched ===
                  setting.filters.moviesStateFlaggedUnwatched &&
                item.filterPrecalculatedValues.moviesStateFlaggedDropped ===
                  setting.filters.moviesStateFlaggedDropped &&
                (item.info.maybeAnime && hasAnimeCatalogs
                  ? catalog?.type === ManifestReceiverTypes.ANIME
                  : catalog?.type === item.info.type) &&
                setting.filters.supportsTypes.includes(item.info.type)
              ) {
                return true;
              }
            }
            if (item.info.type === 'series') {
              if (
                setting.filters
                  ?.seriesPreferStateFlaggedWatchedOverWatchCount === false
              ) {
                const seriesInfo = item.info.series;
                const fullSeriesInfo = item.info.seriesFullCount;

                let flagSeriesStateFlaggedWatched =
                  item.filterPrecalculatedValues.seriesStateFlaggedWatched;
                let flagSeriesStateFlaggedUnwatched =
                  item.filterPrecalculatedValues.seriesStateFlaggedUnwatched;
                let flagSeriesStateHasWatchCount =
                  item.filterPrecalculatedValues.seriesStateHasWatchCount;

                if (
                  seriesInfo &&
                  fullSeriesInfo &&
                  !(
                    !flagSeriesStateFlaggedWatched &&
                    flagSeriesStateFlaggedUnwatched &&
                    flagSeriesStateHasWatchCount
                  )
                ) {
                  if (
                    seriesInfo.season === fullSeriesInfo.season ||
                    (seriesInfo.season || 1) <= (fullSeriesInfo.season || 1)
                  ) {
                    if (seriesInfo.episode < fullSeriesInfo.episode) {
                      flagSeriesStateFlaggedWatched = false;
                      flagSeriesStateFlaggedUnwatched = true;
                      flagSeriesStateHasWatchCount = true;
                    } else if (
                      (seriesInfo.season || 1) ===
                        (fullSeriesInfo.season || 1) &&
                      seriesInfo.episode >= fullSeriesInfo.episode
                    ) {
                      flagSeriesStateFlaggedWatched = true;
                      flagSeriesStateFlaggedUnwatched = false;
                    }
                  }
                }
                item.filterPrecalculatedValues.seriesStateFlaggedWatched =
                  flagSeriesStateFlaggedWatched;
                item.filterPrecalculatedValues.seriesStateFlaggedUnwatched =
                  flagSeriesStateFlaggedUnwatched;
                item.filterPrecalculatedValues.seriesStateHasWatchCount =
                  flagSeriesStateHasWatchCount;
              }

              if (
                item.filterPrecalculatedValues.seriesStateFlaggedWatched ===
                  setting.filters?.seriesStateFlaggedWatched &&
                item.filterPrecalculatedValues.seriesStateFlaggedUnwatched ===
                  setting.filters.seriesStateFlaggedUnwatched &&
                item.filterPrecalculatedValues.seriesStateFlaggedDropped ===
                  setting.filters.seriesStateFlaggedDropped &&
                item.filterPrecalculatedValues.seriesStateFlaggedOnHold ===
                  setting.filters.seriesStateFlaggedOnHold &&
                item.filterPrecalculatedValues.seriesStateHasWatchCount ===
                  setting.filters.seriesStateHasWatchCount &&
                (item.info.maybeAnime && hasAnimeCatalogs
                  ? catalog?.type === ManifestReceiverTypes.ANIME
                  : catalog?.type === item.info.type) &&
                setting.filters.supportsTypes.includes(item.info.type)
              ) {
                if (
                  item.info.series &&
                  diff.diff2Item?.info.series &&
                  (item.info.series.season || 1) ===
                    (diff.diff2Item.info.series.season || 1) &&
                  item.info.series.episode ===
                    diff.diff2Item.info.series.episode &&
                  item.info.currentLibrary &&
                  item.info.currentLibrary ===
                    receiver.getManifestCatalogIdParsed(setting.id)[2]
                ) {
                  return false;
                }
                return true;
              }
            }
            return false;
          }),
        };
      });
  }
}
