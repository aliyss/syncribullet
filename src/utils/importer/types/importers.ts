import type { StremioMCIT } from '~/utils/importers/stremio/types/manifest';

import type { ImporterClient } from '../importer-client';

export enum Importers {
  STREMIO = 'stremio',
}

export type AllImporters = Importers;

export type ImporterMCIT<R extends AllImporters> = {
  importerType: R;
  importCatalogFilters: string[];
};

export type ImporterMCITypes = StremioMCIT;

export type ImporterClients = ImporterClient<ImporterMCITypes>;
