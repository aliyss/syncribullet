import type { UserSettingsCatalog } from './catalog';
import type { UserSettingsLiveSyncType } from './live-sync';

export type UserSettings<
  USC extends UserSettingsCatalog = UserSettingsCatalog,
  USLS extends UserSettingsLiveSyncType = UserSettingsLiveSyncType,
> = {
  catalogs?: USC[];
  liveSync?: USLS[];
};

export interface UserSettingsMinified {
  c?: string;
  ls?: string;
}
