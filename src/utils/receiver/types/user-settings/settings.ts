import type {
  ImporterMCITypes,
  Importers,
} from '~/utils/importer/types/importers';
import type { ImportCatalogs } from '~/utils/importer/types/user-settings/import-catalogs';

import type { ReceiverMCITypes } from '../receivers';
import type { UserSettingsCatalog } from './catalog';
import type { UserSettingsLiveSyncType } from './live-sync';

export type UserSettings<
  MCIT extends ReceiverMCITypes,
  USC extends UserSettingsCatalog<MCIT> = UserSettingsCatalog<MCIT>,
  USLS extends UserSettingsLiveSyncType = UserSettingsLiveSyncType,
> = {
  catalogs?: USC[];
  liveSync?: USLS[];
  importCatalog?: Record<
    Importers,
    Readonly<ImportCatalogs<MCIT, ImporterMCITypes>[]>
  >;
  lastImportSync?: Record<
    Importers,
    Readonly<{
      lastImport?: string;
      lastSync?: string;
    }>
  >;
  auth?: MCIT['auth'];
};

export interface UserSettingsMinified {
  c?: string;
  ls?: string;
}
