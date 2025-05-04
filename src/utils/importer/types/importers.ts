import type { ImporterSimklMCIT } from '~/utils/importers/simkl/types/manifest';
import type { ImporterStremioMCIT } from '~/utils/importers/stremio/types/manifest';

import type { ImporterClient } from '../importer-client';
import type { ImportCatalogDataUncalculated } from './user-settings/import-catalogs';

export enum Importers {
  STREMIO = 'stremio',
  SIMKL = 'simkl',
}

export type AllImporters = Importers;

export type ImporterMCIT<
  R extends AllImporters,
  ICF extends ImporterMCITypes['importCatalogFilters'],
  PIC,
> = {
  importerType: R;
  importCatalogFilters: ICF;
  importData: {
    preImportCatalogLibraryItem: PIC;
    importCatalogDataUncalculatedType: ImportCatalogDataUncalculated<ICF>;
  };
};

export type ImporterMCITypes = ImporterStremioMCIT | ImporterSimklMCIT;

export type ImporterClients = ImporterClient<ImporterMCITypes>;
