import type { UserSettings } from '~/utils/receiver/types/user-settings/settings';

import type { KitsuMCIT } from './manifest';

export type KitsuUserSettings = UserSettings<KitsuMCIT> & {
  auth?: {
    access_token: string;
    rt: string;
    e: string;
    t?: string;
  };
};
