import type { ManifestReceiverTypes } from '~/utils/manifest';
import type { IDs } from '~/utils/receiver/types/id';
import type { ReceiverMCITypes } from '~/utils/receiver/types/receivers';
import type { UserSettingsCatalog } from '~/utils/receiver/types/user-settings/catalog';

import type { ImporterMCITypes } from '../importers';

export interface ImportCatalogs<
  RMCIT extends ReceiverMCITypes,
  IMCIT extends ImporterMCITypes,
  USC extends UserSettingsCatalog<RMCIT> = UserSettingsCatalog<RMCIT>,
> {
  id: USC['id'];
  value: boolean;
  filters:
    | (Record<IMCIT['importCatalogFilters'][number], boolean | null> &
        GlobalFilterPrecalculatedValues)
    | null;
}

export interface ImportCatalogsParsed<
  RMCIT extends ReceiverMCITypes,
  IMCIT extends ImporterMCITypes,
  USC extends UserSettingsCatalog<RMCIT> = UserSettingsCatalog<RMCIT>,
> {
  id: USC['id'];
  items: {
    diffItem: IMCIT['importData']['importCatalogDataUncalculatedType'];
    diff2Item?: ImportCatalogDataUncalculated<[]>;
  }[];
}

export type ImportCatalogEntityType =
  | ManifestReceiverTypes.MOVIE
  | ManifestReceiverTypes.SERIES;

export type GlobalFilterPrecalculatedValues = {
  moviesStateFlaggedWatched: boolean | null;
  moviesStateFlaggedUnwatched: boolean | null;
  moviesStateFlaggedDropped: boolean | null;
  seriesStateFlaggedWatched: boolean | null;
  seriesStateFlaggedUnwatched: boolean | null;
  seriesStateFlaggedDropped: boolean | null;
  seriesStateFlaggedOnHold: boolean | null;
  seriesStateHasWatchCount: boolean | null;
  seriesPreferStateFlaggedWatchedOverWatchCount: boolean | null;
  seriesBackfillEpisodes: boolean | null;
  supportsTypes: ImportCatalogEntityType[];
};

export interface ImportCatalogDataUncalculated<
  ICF extends ImporterMCITypes['importCatalogFilters'],
  STATE extends Record<string, any> = Record<string, any>,
> {
  id: Partial<IDs>;
  filterPrecalculatedValues: Record<ICF[number], boolean | null> &
    GlobalFilterPrecalculatedValues;
  info: {
    id: string;
    name: string;
    type: ImportCatalogEntityType;
    posterUrl?: string;
    maybeAnime?: boolean;
    series?: {
      season?: number;
      episode: number;
      cinemeta?: string;
    };
    currentLibrary?: string;
    seriesFullCount?: {
      season?: number;
      episode: number;
    };
    state: STATE;
  };
  metadata: {
    modified: Date;
    last_watched?: Date;
  };
}
