import type { ReceiverMCITypes } from '~/utils/receiver/types/receivers';
import type { UserSettingsCatalog } from '~/utils/receiver/types/user-settings/catalog';

import type { ImporterMCITypes } from '../importers';

export interface ImportCatalogs<
  RMCIT extends ReceiverMCITypes,
  IMCIT extends ImporterMCITypes,
  USC extends UserSettingsCatalog<RMCIT> = UserSettingsCatalog<RMCIT>,
> {
  id: USC['id'];
  filters: Record<IMCIT['importCatalogFilters'][number], boolean> | null;
}
