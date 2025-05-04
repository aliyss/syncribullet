import { exists } from '../helpers/array';
import { compareIDs, testMaybeAnime } from '../receiver/types/id';
import type {
  AllImporters,
  ImporterMCITypes,
  Importers,
} from './types/importers';
import type { ImportCatalogDataUncalculated } from './types/user-settings/import-catalogs';
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

  async filterLibraryUncalculatedDiff(
    libraryDiff1: MCIT['importData']['importCatalogDataUncalculatedType'][],
    libraryDiff2: ImportCatalogDataUncalculated<[]>[],
  ): Promise<MCIT['importData']['importCatalogDataUncalculatedType'][]> {
    const adjusted = libraryDiff1.map((item1) => {
      const libraryDiff2Item = libraryDiff2.find((item2) =>
        compareIDs(item1.id, item2.id),
      );
      if (!libraryDiff2Item) {
        return item1;
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
      // if (libraryDiff2Item.info.series && item1.info.series) {
      //   if (libraryDiff2Item.info.series.season && item1.info.series.season) {
      //     if (
      //       libraryDiff2Item.info.series.season > item1.info.series.season ||
      //       (libraryDiff2Item.info.series.season === item1.info.series.season &&
      //         libraryDiff2Item.info.series.episode > item1.info.series.episode)
      //     ) {
      //       return undefined;
      //     }
      //   } else if (
      //     !libraryDiff2Item.info.series.season &&
      //     !item1.info.series.season
      //   ) {
      //     if (
      //       libraryDiff2Item.info.series.episode > item1.info.series.episode
      //     ) {
      //       return undefined;
      //     }
      //   }
      // }
      return {
        ...item1,
        id: {
          ...item1.id,
          ...libraryDiff2Item.id,
        },
        info: {
          id: libraryDiff2Item.info.id || item1.info.id,
          name: libraryDiff2Item.info.name || item1.info.name,
          type: libraryDiff2Item.info.type || item1.info.type,
          maybeAnime: testMaybeAnime({
            ...item1.id,
            ...libraryDiff2Item.id,
          }),
          series: item1.info.series,
          posterUrl: libraryDiff2Item.info.posterUrl || item1.info.posterUrl,
          state: {
            importer: item1.info.state,
            mappedItem: libraryDiff2Item,
          },
        },
      };
    });
    return adjusted.filter(exists);
  }
}
