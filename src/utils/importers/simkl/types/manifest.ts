import type { ImporterMCIT, Importers } from '~/utils/importer/types/importers';
import type { SimklMCIT } from '~/utils/receivers/simkl/types/manifest';
import type { SimklLibraryListEntry } from '~/utils/receivers/simkl/types/simkl/library';

export type SimklMCITFilters = [];

export type ImporterSimklMCIT = ImporterMCIT<
  Importers.SIMKL,
  SimklMCITFilters,
  SimklLibraryListEntry
> & {
  auth?: SimklMCIT['auth'];
};
