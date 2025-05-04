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

export type GlobalFilterPrecalculatedValues = {
  moviesStateFlaggedWatched: boolean | null;
  moviesStateFlaggedUnwatched: boolean | null;
  seriesStateFlaggedWatched: boolean | null;
  seriesStateFlaggedUnwatched: boolean | null;
  seriesBackfillEpisodes: boolean | null;
};

export interface ImportCatalogDataUncalculated<
  ICF extends ImporterMCITypes['importCatalogFilters'],
> {
  id: Partial<IDs>;
  filterPrecalculatedValues: Record<ICF[number], boolean | null> &
    GlobalFilterPrecalculatedValues;
  info: {
    id: string;
    name: string;
    type: string;
    posterUrl?: string;
    maybeAnime?: boolean;
    series?: {
      season?: number;
      episode: number;
    };
    state: Record<string, any>;
  };
  metadata: {
    modified: Date;
  };
}
