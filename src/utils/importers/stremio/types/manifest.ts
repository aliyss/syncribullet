import type { ImporterMCIT, Importers } from '~/utils/importer/types/importers';

import type { StremioImportLibraryItem } from './library-item';

export type StremioMCITFilters = ['seriesUseCinemetaComparison'];

export type ImporterStremioMCIT = ImporterMCIT<
  Importers.STREMIO,
  StremioMCITFilters,
  StremioImportLibraryItem
> & {
  auth?: {
    authKey: string;
  };
};
