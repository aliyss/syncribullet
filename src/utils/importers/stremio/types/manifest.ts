import type { ImporterMCIT, Importers } from '~/utils/importer/types/importers';

export type StremioMCIT = ImporterMCIT<Importers.STREMIO> & {
  auth?: {
    authKey: string;
  };
  importCatalogFilters: ['stateFlaggedWatched'];
};
