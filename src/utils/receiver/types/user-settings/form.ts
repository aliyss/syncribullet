import type { ImporterMCITypes } from '~/utils/importer/types/importers';

import type { ReceiverMCITypes } from '../receivers';
import type { UserSettingsCatalog } from './catalog';
import type { UserSettingsLiveSyncType } from './live-sync';
import type { UserSettings } from './settings';

export type UserSettingsFormCatalog<
  MCIT extends ReceiverMCITypes,
  USC extends UserSettingsCatalog<MCIT> = UserSettingsCatalog<MCIT>,
> = {
  id: USC['id'];
  name: USC['name'];
  value: boolean;
};

export type UserSettingsFormLiveSync<
  USLS extends UserSettingsLiveSyncType = UserSettingsLiveSyncType,
> = {
  id: USLS;
  value: boolean;
};

export type UserSettingsForm<
  MCIT extends ReceiverMCITypes,
  US extends UserSettings<MCIT> = UserSettings<MCIT>,
> = {
  catalogs: UserSettingsFormCatalog<
    MCIT,
    NonNullable<US['catalogs']>[number]
  >[];
  liveSync: UserSettingsFormLiveSync<NonNullable<US['liveSync']>[number]>[];
};

export type UserSettingsFormImportCatalog<
  MCIT extends ReceiverMCITypes,
  IMCT extends ImporterMCITypes,
  USC extends UserSettingsCatalog<MCIT> = UserSettingsCatalog<MCIT>,
> = {
  id: USC['id'];
  name: USC['name'];
  value: boolean;
  filters: Record<IMCT['importCatalogFilters'][number], boolean>;
};

export type UserSettingsImportForm<
  MCIT extends ReceiverMCITypes,
  IMCT extends ImporterMCITypes,
  US extends UserSettings<MCIT> = UserSettings<MCIT>,
> = {
  catalogs: UserSettingsFormImportCatalog<
    MCIT,
    IMCT,
    NonNullable<US['catalogs']>[number]
  >[];
};
