import type { UserSettings } from '~/utils/receiver/types/user-settings/settings';

import type { SimklMCIT } from './manifest';

export type SimklUserSettings = UserSettings<SimklMCIT> & {
  auth?: {
    access_token: string;
    client_id: string;
  };
};
