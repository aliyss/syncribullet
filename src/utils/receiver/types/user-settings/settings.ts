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
  auth?: MCIT['auth'];
};

export interface UserSettingsMinified {
  c?: string;
  ls?: string;
}
