import type { UserSettingsCatalog } from './catalog';
import type { UserSettingsLiveSyncType } from './live-sync';
import type { UserSettings } from './settings';

export type UserSettingsFormCatalog<
  USC extends UserSettingsCatalog = UserSettingsCatalog,
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

export type UserSettingsForm<US extends UserSettings = UserSettings> = {
  catalogs: UserSettingsFormCatalog<NonNullable<US['catalogs']>[number]>[];
  liveSync: UserSettingsFormLiveSync<NonNullable<US['liveSync']>[number]>[];
};
